sequenceDiagram
    actor Usuario
    participant LoginComp as Login Component
    participant AuthService as Auth Service
    participant AuthInterceptor as Auth Interceptor
    participant HttpClient as HTTP Client
    participant Backend as NestJS Backend
    participant AuthController as Auth Controller
    participant PassportGuard as Passport Guard
    participant AuthServiceB as Auth Service (Backend)
    participant BCrypt as BCrypt
    participant JWT as JWT Module
    participant UserRepo as User Repository
    participant DB as PostgreSQL

    %% Login Flow
    rect rgb(230, 230, 250)
        Note over Usuario,DB: Flujo de Inicio de Sesión
        Usuario->>+LoginComp: Ingresa email y password
        LoginComp->>LoginComp: Valida formulario (Validators)
        LoginComp->>+AuthService: loginUser(loginDto)
        AuthService->>+AuthInterceptor: POST /auth/login
        AuthInterceptor->>AuthInterceptor: Añade withCredentials: true
        AuthInterceptor->>+HttpClient: Ejecuta request
        HttpClient->>+Backend: POST /api/auth/login<br/>{email, password}
        Backend->>+AuthController: loginUser(loginDto, response)
    end

    %% Validation Flow
    rect rgb(255, 240, 245)
        Note over AuthController,DB: Validación de Credenciales
        AuthController->>AuthController: class-validator valida DTO
        AuthController->>+AuthServiceB: loginUser(loginDto)
        AuthServiceB->>+UserRepo: findOne({email})
        UserRepo->>+DB: SELECT * FROM users WHERE email=?
        DB-->>-UserRepo: User data
        UserRepo-->>-AuthServiceB: User entity
        
        alt Usuario no existe
            AuthServiceB-->>AuthController: UnauthorizedException
            AuthController-->>Backend: 401 Unauthorized
            Backend-->>Usuario: Error: Credenciales inválidas
        end
        
        AuthServiceB->>+BCrypt: compare(password, user.password)
        BCrypt-->>-AuthServiceB: boolean (match result)
        
        alt Password incorrecto
            AuthServiceB-->>AuthController: UnauthorizedException
            AuthController-->>Backend: 401 Unauthorized
            Backend-->>Usuario: Error: Credenciales inválidas
        end
        
        alt Usuario inactivo
            AuthServiceB->>AuthServiceB: Verifica user.isActive
            AuthServiceB-->>AuthController: UnauthorizedException
            AuthController-->>Backend: 401 Unauthorized
            Backend-->>Usuario: Error: Usuario inactivo
        end
    end

    %% JWT Generation
    rect rgb(240, 255, 240)
        Note over AuthServiceB,Backend: Generación de JWT
        AuthServiceB->>+JWT: sign({id, email, fullname, roles})
        JWT->>JWT: Genera token con JWT_SECRET
        JWT-->>-AuthServiceB: JWT token string
        AuthServiceB-->>-AuthController: {user, token}
    end

    %% Cookie Setting
    rect rgb(255, 250, 240)
        Note over AuthController,Backend: Configuración de Cookie HttpOnly
        AuthController->>AuthController: response.cookie('token', token, {<br/>httpOnly: true,<br/>secure: production,<br/>sameSite: 'strict',<br/>maxAge: 24h<br/>})
        AuthController-->>-Backend: {user} (sin token en body)
        Backend-->>-HttpClient: 200 OK + Set-Cookie header
    end

    %% Frontend Response
    rect rgb(245, 245, 255)
        Note over HttpClient,Usuario: Actualización de Estado
        HttpClient-->>-AuthInterceptor: Response {user}
        AuthInterceptor-->>-AuthService: Observable<AuthResponse>
        AuthService->>AuthService: handleAuthSuccess({user})
        AuthService->>AuthService: _user.set(user)
        AuthService->>AuthService: _authStatus.set('authenticated')
        AuthService-->>-LoginComp: null (success)
        LoginComp->>LoginComp: Router.navigate(['/dashboard'])
        LoginComp-->>-Usuario: Redirige a Dashboard
    end

    %% Subsequent Requests
    rect rgb(240, 248, 255)
        Note over Usuario,DB: Peticiones Subsecuentes con Cookie
        Usuario->>+LoginComp: Navega a sección protegida
        LoginComp->>+AuthService: Alguna petición (ej: getUsers)
        AuthService->>+AuthInterceptor: GET /auth/users
        AuthInterceptor->>AuthInterceptor: Añade withCredentials: true
        AuthInterceptor->>+HttpClient: Request con cookie
        HttpClient->>+Backend: GET /api/auth/users<br/>Cookie: token=<JWT>
        Backend->>+AuthController: findAll()
        AuthController->>+PassportGuard: @MyAuth(admin)
        PassportGuard->>PassportGuard: JwtStrategy.validate()
        PassportGuard->>PassportGuard: Extrae JWT de cookie
        PassportGuard->>+JWT: verify(token)
        JWT-->>-PassportGuard: Payload {id, email, roles}
        
        alt Token inválido o expirado
            PassportGuard-->>AuthController: UnauthorizedException
            AuthController-->>Backend: 401 Unauthorized
            Backend-->>Usuario: Redirige a login
        end
        
        PassportGuard->>PassportGuard: UserRoleGuard verifica roles
        
        alt Sin permisos
            PassportGuard-->>AuthController: ForbiddenException
            AuthController-->>Backend: 403 Forbidden
            Backend-->>Usuario: Error: Sin permisos
        end
        
        PassportGuard-->>-AuthController: User válido
        AuthController->>+AuthServiceB: findAll(queryParams)
        AuthServiceB->>+UserRepo: find({...options})
        UserRepo->>+DB: SELECT * FROM users
        DB-->>-UserRepo: Users array
        UserRepo-->>-AuthServiceB: Users entities
        AuthServiceB-->>-AuthController: Users[]
        AuthController-->>-Backend: 200 OK + Users[]
        Backend-->>-HttpClient: Response con datos
        HttpClient-->>-AuthInterceptor: Observable<Users[]>
        AuthInterceptor-->>-AuthService: Datos procesados
        AuthService-->>-LoginComp: Users array
        LoginComp-->>-Usuario: Muestra datos en tabla
    end

    %% Logout Flow
    rect rgb(255, 245, 245)
        Note over Usuario,Backend: Flujo de Cierre de Sesión
        Usuario->>+LoginComp: Click en Logout
        LoginComp->>+AuthService: logoutUser()
        AuthService->>+AuthInterceptor: POST /auth/logout
        AuthInterceptor->>AuthInterceptor: withCredentials: true
        AuthInterceptor->>+HttpClient: Request
        HttpClient->>+Backend: POST /api/auth/logout
        Backend->>+AuthController: logoutUser(response)
        AuthController->>AuthController: response.clearCookie('token')
        AuthController-->>-Backend: {message: 'Logout successful'}
        Backend-->>-HttpClient: 200 OK
        HttpClient-->>-AuthInterceptor: Response
        AuthInterceptor-->>-AuthService: Success
        AuthService->>AuthService: _user.set(null)
        AuthService->>AuthService: _authStatus.set('not-authenticated')
        AuthService-->>-LoginComp: null
        LoginComp->>LoginComp: Router.navigate(['/auth/login'])
        LoginComp-->>-Usuario: Redirige a Login
    end