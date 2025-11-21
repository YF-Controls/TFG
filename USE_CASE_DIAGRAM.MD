graph TB
    subgraph "Actores"
        Guest[👤 Invitado<br/>Sin autenticar]
        User[👤 Usuario<br/>Role: USER]
        Admin[👨‍💼 Administrador<br/>Role: ADMIN]
    end
    
    subgraph "Sistema de Domótica"
        subgraph "Gestión de Autenticación"
            UC1[Registrarse en el sistema]
            UC2[Iniciar sesión]
            UC3[Cerrar sesión]
            UC4[Verificar estado de autenticación]
            UC5[Cambiar idioma]
        end
        
        subgraph "Gestión de Usuarios - Solo Admin"
            UC6[Listar usuarios]
            UC7[Editar usuario]
            UC8[Activar/Desactivar usuario]
            UC9[Eliminar usuario]
            UC10[Asignar roles a usuario]
            UC11[Ver roles disponibles]
        end
        
        subgraph "Gestión de Áreas de Dispositivos - Admin"
            UC12[Crear área de dispositivo]
            UC13[Listar áreas de dispositivos]
            UC14[Ver detalle de área]
            UC15[Editar área de dispositivo]
            UC16[Eliminar área de dispositivo]
            UC17[Activar/Desactivar área]
            UC18[Buscar áreas por nombre]
            UC19[Filtrar áreas activas/inactivas]
            UC20[Ordenar áreas]
        end
        
        subgraph "Gestión de Tipos de Dispositivos - Admin"
            UC21[Crear tipo de dispositivo]
            UC22[Listar tipos de dispositivos]
            UC23[Ver detalle de tipo]
            UC24[Editar tipo de dispositivo]
            UC25[Eliminar tipo de dispositivo]
            UC26[Activar/Desactivar tipo]
            UC27[Buscar tipos por nombre]
            UC28[Filtrar tipos activos/inactivos]
            UC29[Ordenar tipos]
        end
        
        subgraph "Gestión de Dispositivos - Admin"
            UC30[Crear dispositivo]
            UC31[Listar dispositivos]
            UC32[Ver detalle de dispositivo]
            UC33[Editar dispositivo]
            UC34[Eliminar dispositivo]
            UC35[Activar/Desactivar dispositivo]
            UC36[Asignar área a dispositivo]
            UC37[Asignar tipo a dispositivo]
            UC38[Buscar dispositivos]
            UC39[Filtrar dispositivos activos/inactivos]
            UC40[Ordenar dispositivos]
        end
        
        subgraph "Dashboard de Usuario"
            UC41[Ver dashboard principal]
            UC42[Ver estado de dispositivos]
            UC43[Ver dispositivos por área]
            UC44[Ver dispositivos por tipo]
        end
        
        subgraph "Dashboard de Administración"
            UC45[Acceder a panel admin]
            UC46[Ver estadísticas del sistema]
            UC47[Navegar entre secciones admin]
        end
    end
    
    %% Guest connections
    Guest --> UC1
    Guest --> UC2
    Guest --> UC5
    
    %% User connections
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC41
    User --> UC42
    User --> UC43
    User --> UC44
    
    %% Admin connections
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    
    Admin --> UC21
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    Admin --> UC25
    Admin --> UC26
    Admin --> UC27
    Admin --> UC28
    Admin --> UC29
    
    Admin --> UC30
    Admin --> UC31
    Admin --> UC32
    Admin --> UC33
    Admin --> UC34
    Admin --> UC35
    Admin --> UC36
    Admin --> UC37
    Admin --> UC38
    Admin --> UC39
    Admin --> UC40
    
    Admin --> UC41
    Admin --> UC42
    Admin --> UC43
    Admin --> UC44
    Admin --> UC45
    Admin --> UC46
    Admin --> UC47
    
    %% Includes relationships
    UC7 -.->|include| UC10
    UC12 -.->|include| UC4
    UC13 -.->|include| UC4
    UC21 -.->|include| UC4
    UC22 -.->|include| UC4
    UC30 -.->|include| UC36
    UC30 -.->|include| UC37
    UC33 -.->|include| UC36
    UC33 -.->|include| UC37
    
    %% Extends relationships
    UC18 -.->|extend| UC13
    UC19 -.->|extend| UC13
    UC20 -.->|extend| UC13
    UC27 -.->|extend| UC22
    UC28 -.->|extend| UC22
    UC29 -.->|extend| UC22
    UC38 -.->|extend| UC31
    UC39 -.->|extend| UC31
    UC40 -.->|extend| UC31
    
    %% Styling
    classDef guestStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef userStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef adminStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef authUC fill:#ffebee,stroke:#c62828,stroke-width:1px
    classDef userMgmtUC fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px
    classDef deviceAreaUC fill:#e0f2f1,stroke:#00897b,stroke-width:1px
    classDef deviceTypeUC fill:#fce4ec,stroke:#c2185b,stroke-width:1px
    classDef deviceUC fill:#e8eaf6,stroke:#3f51b5,stroke-width:1px
    classDef dashboardUC fill:#fff9c4,stroke:#f9a825,stroke-width:1px
    
    class Guest guestStyle
    class User userStyle
    class Admin adminStyle
    class UC1,UC2,UC3,UC4,UC5 authUC
    class UC6,UC7,UC8,UC9,UC10,UC11 userMgmtUC
    class UC12,UC13,UC14,UC15,UC16,UC17,UC18,UC19,UC20 deviceAreaUC
    class UC21,UC22,UC23,UC24,UC25,UC26,UC27,UC28,UC29 deviceTypeUC
    class UC30,UC31,UC32,UC33,UC34,UC35,UC36,UC37,UC38,UC39,UC40 deviceUC
    class UC41,UC42,UC43,UC44,UC45,UC46,UC47 dashboardUC