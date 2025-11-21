```shell
https://mermaid.live/
```

graph TB
    subgraph "Frontend - Angular 20"
        subgraph "Presentation Layer"
            AppRoot[App Root Component]
            
            subgraph "Auth Module"
                AuthLayout[Auth Layout]
                LoginPage[Login Page]
                RegisterPage[Register Page]
                LoginComp[Login Component]
                RegisterComp[Register Component]
                UserTableComp[User Table Component]
                EditUserComp[Edit User Component]
            end
            
            subgraph "Admin Dashboard"
                AdminLayout[Admin Dashboard Layout]
                UsersAdminPage[Users Admin Page]
                DeviceAreasAdminPage[Device Areas Page]
                DeviceTypesAdminPage[Device Types Page]
                DevicesAdminPage[Devices Page]
                LinkButton[Link Button]
            end
            
            subgraph "Main Dashboard"
                MainLayout[Main Dashboard Layout]
                MainPage[Main Dashboard Page]
                MainNavbar[Main Navbar]
            end
            
            subgraph "Device Management"
                DeviceAreaTable[Device Area Table]
                DeviceTypeTable[Device Type Table]
                DeviceTable[Device Table]
                CreateDeviceArea[Create Device Area]
                CreateDeviceType[Create Device Type]
                CreateDevice[Create Device]
            end
            
            subgraph "Shared Components"
                IconComp[Icon Component]
                SwitchLang[Switch Language]
                ConfirmDialog[Confirm Dialog]
                FormError[Form Field Error]
            end
        end
        
        subgraph "Business Logic Layer"
            AuthService[Auth API Service]
            DeviceAreasService[Device Areas API]
            DeviceTypesService[Device Types API]
            DevicesService[Devices API]
            LanguageService[Language Service]
        end
        
        subgraph "Infrastructure Layer"
            AuthInterceptor[Auth Interceptor]
            Guards[Route Guards]
            HttpClient[HTTP Client]
        end
    end
    
    subgraph "HTTP Layer"
        CORS[CORS Middleware]
        CookieParser[Cookie Parser]
        RestAPI[REST API Endpoints]
    end
    
    subgraph "Backend - NestJS 11"
        subgraph "API Layer - Controllers"
            AuthController[Auth Controller]
            DeviceAreasController[Device Areas Controller]
            DeviceTypesController[Device Types Controller]
            DevicesController[Devices Controller]
        end
        
        subgraph "Business Logic - Services"
            AuthServiceB[Auth Service]
            DeviceAreasServiceB[Device Areas Service]
            DeviceTypesServiceB[Device Types Service]
            DevicesServiceB[Devices Service]
        end
        
        subgraph "Security Layer"
            JwtStrategy[JWT Strategy]
            PassportGuard[Passport Guard]
            UserRoleGuard[User Role Guard]
            JwtModule[JWT Module]
        end
        
        subgraph "Data Access Layer"
            UserRepo[User Repository]
            DeviceAreaRepo[Device Area Repository]
            DeviceTypeRepo[Device Type Repository]
            DeviceRepo[Device Repository]
            TypeORM[TypeORM]
        end
        
        subgraph "Domain Layer"
            UserEntity[User Entity]
            DeviceAreaEntity[Device Area Entity]
            DeviceTypeEntity[Device Type Entity]
            DeviceEntity[Device Entity]
        end
        
        subgraph "Validation Layer"
            DTOs[DTOs + Validators]
            ClassValidator[Class Validator]
            ClassTransformer[Class Transformer]
        end
    end
    
    subgraph "Database"
        PostgreSQL[(PostgreSQL Database)]
    end
    
    subgraph "External Services"
        BCrypt[BCrypt Password Hash]
        JWT[JWT Token Generation]
    end

    %% Frontend Internal Connections
    AppRoot --> AuthLayout
    AppRoot --> AdminLayout
    AppRoot --> MainLayout
    
    AuthLayout --> LoginPage
    AuthLayout --> RegisterPage
    LoginPage --> LoginComp
    RegisterPage --> RegisterComp
    
    AdminLayout --> UsersAdminPage
    AdminLayout --> DeviceAreasAdminPage
    AdminLayout --> DeviceTypesAdminPage
    AdminLayout --> DevicesAdminPage
    
    UsersAdminPage --> UserTableComp
    UsersAdminPage --> EditUserComp
    DeviceAreasAdminPage --> DeviceAreaTable
    DeviceAreasAdminPage --> CreateDeviceArea
    DeviceTypesAdminPage --> DeviceTypeTable
    DeviceTypesAdminPage --> CreateDeviceType
    DevicesAdminPage --> DeviceTable
    DevicesAdminPage --> CreateDevice
    
    MainLayout --> MainPage
    MainLayout --> MainNavbar
    
    LoginComp --> AuthService
    RegisterComp --> AuthService
    UserTableComp --> AuthService
    EditUserComp --> AuthService
    MainNavbar --> AuthService
    
    DeviceAreaTable --> DeviceAreasService
    CreateDeviceArea --> DeviceAreasService
    DeviceTypeTable --> DeviceTypesService
    CreateDeviceType --> DeviceTypesService
    DeviceTable --> DevicesService
    CreateDevice --> DevicesService
    
    AuthService --> AuthInterceptor
    DeviceAreasService --> AuthInterceptor
    DeviceTypesService --> AuthInterceptor
    DevicesService --> AuthInterceptor
    
    AuthInterceptor --> HttpClient
    Guards --> AuthService
    
    LoginComp --> FormError
    RegisterComp --> FormError
    EditUserComp --> FormError
    CreateDeviceArea --> FormError
    
    AdminLayout --> IconComp
    AdminLayout --> SwitchLang
    EditUserComp --> ConfirmDialog
    UserTableComp --> ConfirmDialog
    
    SwitchLang --> LanguageService
    FormError --> LanguageService

    %% Frontend to Backend Connection
    HttpClient -->|HTTP/HTTPS| RestAPI
    
    %% Backend Entry Point
    RestAPI --> CORS
    RestAPI --> CookieParser
    CORS --> AuthController
    CORS --> DeviceAreasController
    CORS --> DeviceTypesController
    CORS --> DevicesController
    
    %% Backend Security Flow
    AuthController --> PassportGuard
    DeviceAreasController --> PassportGuard
    DeviceTypesController --> PassportGuard
    DevicesController --> PassportGuard
    
    PassportGuard --> JwtStrategy
    JwtStrategy --> JwtModule
    PassportGuard --> UserRoleGuard
    
    %% Backend Controller to Service
    AuthController --> AuthServiceB
    DeviceAreasController --> DeviceAreasServiceB
    DeviceTypesController --> DeviceTypesServiceB
    DevicesController --> DevicesServiceB
    
    %% Backend Validation
    AuthController --> DTOs
    DeviceAreasController --> DTOs
    DeviceTypesController --> DTOs
    DevicesController --> DTOs
    DTOs --> ClassValidator
    DTOs --> ClassTransformer
    
    %% Backend Service to Repository
    AuthServiceB --> UserRepo
    AuthServiceB --> BCrypt
    AuthServiceB --> JWT
    DeviceAreasServiceB --> DeviceAreaRepo
    DeviceTypesServiceB --> DeviceTypeRepo
    DevicesServiceB --> DeviceRepo
    DevicesServiceB --> DeviceAreaRepo
    DevicesServiceB --> DeviceTypeRepo
    
    %% Backend Repository to Entity
    UserRepo --> TypeORM
    DeviceAreaRepo --> TypeORM
    DeviceTypeRepo --> TypeORM
    DeviceRepo --> TypeORM
    
    TypeORM --> UserEntity
    TypeORM --> DeviceAreaEntity
    TypeORM --> DeviceTypeEntity
    TypeORM --> DeviceEntity
    
    %% Backend to Database
    UserEntity -->|ORM Mapping| PostgreSQL
    DeviceAreaEntity -->|ORM Mapping| PostgreSQL
    DeviceTypeEntity -->|ORM Mapping| PostgreSQL
    DeviceEntity -->|ORM Mapping| PostgreSQL

    %% Styling
    classDef frontendLayer fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef backendLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    classDef dataLayer fill:#fff3e0,stroke:#f57c00,stroke-width:3px
    classDef securityLayer fill:#ffebee,stroke:#c62828,stroke-width:3px
    classDef sharedLayer fill:#e8f5e9,stroke:#388e3c,stroke-width:3px
    classDef httpLayer fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef externalLayer fill:#fff9c4,stroke:#f9a825,stroke-width:2px

    class AppRoot,AuthLayout,LoginPage,RegisterPage,LoginComp,RegisterComp,UserTableComp,EditUserComp,AdminLayout,UsersAdminPage,DeviceAreasAdminPage,DeviceTypesAdminPage,DevicesAdminPage,LinkButton,MainLayout,MainPage,MainNavbar,DeviceAreaTable,DeviceTypeTable,DeviceTable,CreateDeviceArea,CreateDeviceType,CreateDevice frontendLayer
    
    class AuthController,DeviceAreasController,DeviceTypesController,DevicesController,AuthServiceB,DeviceAreasServiceB,DeviceTypesServiceB,DevicesServiceB backendLayer
    
    class UserRepo,DeviceAreaRepo,DeviceTypeRepo,DeviceRepo,TypeORM,UserEntity,DeviceAreaEntity,DeviceTypeEntity,DeviceEntity,PostgreSQL dataLayer
    
    class JwtStrategy,PassportGuard,UserRoleGuard,JwtModule,AuthInterceptor,Guards securityLayer
    
    class IconComp,SwitchLang,ConfirmDialog,FormError,AuthService,DeviceAreasService,DeviceTypesService,DevicesService,LanguageService,HttpClient,DTOs,ClassValidator,ClassTransformer sharedLayer
    
    class CORS,CookieParser,RestAPI httpLayer
    
    class BCrypt,JWT externalLayer
