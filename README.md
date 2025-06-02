## **Índice**

1. [Visión General](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
2. [Modelos](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    2.1. [Caso](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    2.2. [Informe](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    2.3. [Fiscal](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
3. [Procedimientos Almacenados (SQL Server)](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    3.1. [usp_CrearCasoPorCorreo](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    3.2. [usp_ObtenerCasosPorCorreo](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    3.3. [usp_AgregarInformeAlCaso](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    3.4. [usp_ReasignarCaso](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
    3.5. [usp_ListarFiscales](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
    
4. [Estructura de Carpetas](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
5. [Configuración de la Conexión a Base de Datos](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)
6. [Notas Adicionales](https://www.notion.so/Documentaci-n-del-Backend-MP-206f018fc2658038bf7ad220c7b25167?pvs=21)

---

## **Visión General**

Este backend está escrito en **Node.js** (v18), utiliza **TypeScript** y expone una API REST construida con **Express**. Se conecta a una base de datos **SQL Server** y hace uso de varios procedimientos almacenados (SP) para las operaciones de negocio. La funcionalidad principal incluye:

- **Gestión de Casos**
    - Crear un nuevo caso (usp_CrearCasoPorCorreo)
    - Listar casos de un fiscal dado (usp_ObtenerCasosPorCorreo)
    - Reasignar un caso a otro fiscal (usp_ReasignarCaso)
- **Gestión de Informes**
    - Agregar un informe a un caso existente (usp_AgregarInformeAlCaso)
- **Gestión de Fiscales**
    - Listar todos los fiscales (usp_ListarFiscales)

La arquitectura sigue la separación de responsabilidades:

- **Modelos (src/models/)**: definición de interfaces TypeScript (Caso, Informe, Fiscal).
- **Servicios (src/services/)**: lógica de acceso a datos y mapeo (llamadas a SP).
- **Controladores (src/controllers/)**: validaciones de petición, invocación a servicios y construcción de las respuestas HTTP.
- **Rutas (src/routes/)**: definición de endpoints REST y asociación con sus controladores.

---

## **Modelos**

En src/models/ encontramos las interfaces que describen la forma de los objetos que manejamos en la aplicación.

### **2.1. Modelo**

### **Caso**

```tsx
// src/models/caso.ts

export interface Caso {
  CasoID: number;
  FechaRegistro: Date;
  Estado: string;
  Progreso: string;
  Descripcion: string;
  FechaUltimaActualizacion: Date;
  FiscalID: number;
}
```

- **CasoID** (number): Identificador único del caso (PK).
- **FechaRegistro** (Date): Fecha y hora en que se creó el caso (por defecto SYSUTCDATETIME()).
- **Estado** (string): Estado actual del caso (por ejemplo: "PENDIENTE", "EN_PROGRESO", etc.).
- **Progreso** (string): Porcentaje de avance (p.ej. "0%", "50%", "100%").
- **Descripcion** (string): Descripción textual del caso.
- **FechaUltimaActualizacion** (Date): Fecha y hora de la última modificación del caso.
- **FiscalID** (number): ID del fiscal asignado al caso (FK → dbo.Fiscal.FiscalID).

---

### **2.2. Modelo**

### **Informe**

```tsx
// src/models/informe.ts

export interface Informe {
  InformeID: number;
  FechaGeneracion: Date;
  TipoInforme: string;
  DescripcionBreve: string;
  CasoID: number;
}
```

- **InformeID** (number): Identificador único del informe (PK).
- **FechaGeneracion** (Date): Fecha y hora en que se generó el informe (SYSUTCDATETIME()).
- **TipoInforme** (string): Tipo del informe (p.ej. "Inicial", "Seguimiento", "Cierre").
- **DescripcionBreve** (string): Texto breve descriptivo del informe.
- **CasoID** (number): ID del caso asociado (FK → dbo.Caso.CasoID).

---

### **2.3. Modelo**

### **Fiscal**

```tsx
// src/models/fiscal.ts

export interface Fiscal {
  FiscalID: number;
  Nombre: string;
  CorreoElectronico: string;
  Usuario: string;
  Rol: string;
  FiscaliaID: number;
  Permisos: string; // (opcional, se deja vacío si no se obtiene del SP)
}
```

- **FiscalID** (number): Identificador único del fiscal (PK).
- **Nombre** (string): Nombre completo del fiscal.
- **CorreoElectronico** (string): Dirección de correo electrónico (única).
- **Usuario** (string): Nombre de usuario de acceso.
- **Rol** (string): Rol o perfil del fiscal (p.ej. "Administrador", "Revisor", "Fiscal").
- **FiscaliaID** (number): ID de la fiscalía a la que pertenece el fiscal (FK → dbo.Fiscalia.FiscaliaID).
- **Permisos** (string): Lista (separada por comas) de permisos asignados; en nuestro SP de ejemplo se retorna vacío.

---

## **Procedimientos Almacenados**

A continuación se listan los procedimientos almacenados en SQL Server que se utilizan en la aplicación, junto a sus parámetros y comportamiento.

### **3.1.**

### **usp_CrearCasoPorCorreo**

```sql
CREATE PROCEDURE dbo.usp_CrearCasoPorCorreo
    @CorreoElectronico      NVARCHAR(100),
    @Descripcion            NVARCHAR(MAX),
    @NuevoCasoID            INT            OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FiscalID INT;

    -- 1) Obtener FiscalID desde dbo.Fiscal con el correo
    SELECT @FiscalID = FiscalID
    FROM dbo.Fiscal
    WHERE CorreoElectronico = @CorreoElectronico;

    IF @FiscalID IS NULL
    BEGIN
        RAISERROR('No existe un fiscal con el correo %s', 16, 1, @CorreoElectronico);
        RETURN;
    END

    -- 2) Insertar en dbo.Caso y capturar nuevo CasoID
    INSERT INTO dbo.Caso
    (
        Estado,
        Progreso,
        Descripcion,
        FechaUltimaActualizacion,
        FiscalID
    )
    VALUES
    (
        N'PENDIENTE',            -- Estado por defecto
        N'0%',                   -- Progreso inicial
        @Descripcion,            -- Descripción
        SYSUTCDATETIME(),        -- FechaUltimaActualizacion
        @FiscalID
    );

    SET @NuevoCasoID = SCOPE_IDENTITY();
END
```

- **Parámetros de entrada**:
    - @CorreoElectronico (NVARCHAR(100)): correo del fiscal que crea el caso.
    - @Descripcion (NVARCHAR(MAX)): descripción del caso.
- **Parámetro de salida**:
    - @NuevoCasoID (INT OUTPUT): el ID recién generado de la tabla Caso.

---

### **3.2.**

### **usp_ObtenerCasosPorCorreo**

```sql
CREATE PROCEDURE dbo.usp_ObtenerCasosPorCorreo
    @CorreoElectronico NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CasoID,
        FechaRegistro,
        Estado,
        Progreso,
        Descripcion,
        FechaUltimaActualizacion,
        FiscalID
    FROM dbo.Caso
    WHERE FiscalID = (
      SELECT FiscalID
      FROM dbo.Fiscal
      WHERE CorreoElectronico = @CorreoElectronico
    );
END
```

- **Parámetro de entrada**:
    - @CorreoElectronico (NVARCHAR(100)): correo del fiscal cuyo FiscalID se usa para filtrar casos.
- **Salida**:
    - Una lista de filas con los campos CasoID, FechaRegistro, Estado, Progreso, Descripcion, FechaUltimaActualizacion, FiscalID.

---

### **3.3.**

### **usp_AgregarInformeAlCaso**

```sql
CREATE PROCEDURE dbo.usp_AgregarInformeAlCaso
    @CorreoElectronico    NVARCHAR(100),
    @CasoID               INT,
    @TipoInforme          NVARCHAR(100),
    @DescripcionBreve     NVARCHAR(255),
    @NuevoInformeID       INT           OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE
        @FiscalID    INT,
        @CasoFiscal  INT,
        @ExisteFiscal BIT = 0,
        @ExisteCaso   BIT = 0;

    -- 1) Verificar que exista fiscal con ese correo
    SELECT
        @FiscalID = FiscalID,
        @ExisteFiscal = 1
    FROM dbo.Fiscal
    WHERE CorreoElectronico = @CorreoElectronico;

    IF @ExisteFiscal = 0
    BEGIN
        RAISERROR('No existe ningún fiscal con correo = %s.', 16, 1, @CorreoElectronico);
        RETURN;
    END

    -- 2) Verificar que exista el caso
    SELECT
        @CasoFiscal = FiscalID,
        @ExisteCaso = 1
    FROM dbo.Caso
    WHERE CasoID = @CasoID;

    IF @ExisteCaso = 0
    BEGIN
        RAISERROR('No existe ningún caso con CasoID = %d.', 16, 1, @CasoID);
        RETURN;
    END

    -- 3) Verificar que el fiscal asignado al caso coincida
    IF @CasoFiscal <> @FiscalID
    BEGIN
        RAISERROR(
            'El fiscal con correo %s no está autorizado para agregar informe al caso %d.',
            16, 1,
            @CorreoElectronico, @CasoID
        );
        RETURN;
    END

    -- 4a) Insertar en dbo.Informe
    INSERT INTO dbo.Informe
    (
        FechaGeneracion,    -- SYSUTCDATETIME()
        TipoInforme,
        DescripcionBreve
    )
    VALUES
    (
        SYSUTCDATETIME(),
        @TipoInforme,
        @DescripcionBreve
    );

    SET @NuevoInformeID = SCOPE_IDENTITY();

    -- 4b) Insertar en dbo.Informe_Caso (tabla N:M)
    INSERT INTO dbo.Informe_Caso
    (
        InformeID,
        CasoID
    )
    VALUES
    (
        @NuevoInformeID,
        @CasoID
    );

    -- 4c) Actualizar FechaUltimaActualizacion en dbo.Caso
    UPDATE dbo.Caso
    SET FechaUltimaActualizacion = SYSUTCDATETIME()
    WHERE CasoID = @CasoID;
END
```

- **Parámetros de entrada**:
    - @CorreoElectronico (NVARCHAR(100)): correo del fiscal que agregará el informe.
    - @CasoID (INT): ID del caso al que se le añade el informe.
    - @TipoInforme (NVARCHAR(100)): tipo de informe.
    - @DescripcionBreve (NVARCHAR(255)): descripción breve.
- **Parámetro de salida**:
    - @NuevoInformeID (INT OUTPUT): ID recién generado en la tabla Informe.

---

### **3.4.**

### **usp_ReasignarCaso**

```sql
CREATE PROCEDURE dbo.usp_ReasignarCaso
    @CasoID         INT,
    @NuevoFiscalID  INT,
    @MotivoSalida   NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE
        @Estado            NVARCHAR(50),
        @FiscalActual      INT,
        @FiscaliaActual    INT,
        @FiscaliaNuevo     INT;

    -- 1) Verificar que exista el caso y obtener Estado y FiscalID actual
    SELECT
        @Estado = c.Estado,
        @FiscalActual = c.FiscalID
    FROM dbo.Caso AS c
    WHERE c.CasoID = @CasoID;

    IF @FiscalActual IS NULL
    BEGIN
        INSERT INTO dbo.LogReasignacionFallida
        (
            Motivo,
            CasoID,
            FiscalAnteriorID,
            FiscalNuevoID
        )
        VALUES
        (
            N'No existe ningún caso con CasoID = ' + CAST(@CasoID AS NVARCHAR(10)),
            @CasoID,
            NULL,
            @NuevoFiscalID
        );
        SET @MotivoSalida = N'No existe ningún caso con CasoID = ' + CAST(@CasoID AS NVARCHAR(10));
        RETURN;
    END

    -- 2) Verificar que exista el nuevo fiscal y obtener su FiscaliaID
    SELECT
        @FiscaliaNuevo = f.FiscaliaID
    FROM dbo.Fiscal AS f
    WHERE f.FiscalID = @NuevoFiscalID;

    IF @FiscaliaNuevo IS NULL
    BEGIN
        INSERT INTO dbo.LogReasignacionFallida
        (
            Motivo,
            CasoID,
            FiscalAnteriorID,
            FiscalNuevoID
        )
        VALUES
        (
            N'No existe ningún fiscal con FiscalID = ' + CAST(@NuevoFiscalID AS NVARCHAR(10)),
            @CasoID,
            @FiscalActual,
            @NuevoFiscalID
        );
        SET @MotivoSalida = N'No existe ningún fiscal con FiscalID = ' + CAST(@NuevoFiscalID AS NVARCHAR(10));
        RETURN;
    END

    -- 3) Verificar que el caso esté en estado 'PENDIENTE'
    IF @Estado <> N'PENDIENTE'
    BEGIN
        INSERT INTO dbo.LogReasignacionFallida
        (
            Motivo,
            CasoID,
            FiscalAnteriorID,
            FiscalNuevoID
        )
        VALUES
        (
            N'El caso no está en estado PENDIENTE',
            @CasoID,
            @FiscalActual,
            @NuevoFiscalID
        );
        SET @MotivoSalida = N'El caso no está en estado PENDIENTE';
        RETURN;
    END

    -- 4) Obtener la FiscaliaID del fiscal actual del caso
    SELECT
        @FiscaliaActual = f2.FiscaliaID
    FROM dbo.Fiscal AS f2
    WHERE f2.FiscalID = @FiscalActual;

    -- 5) Verificar que el nuevo fiscal pertenezca a la misma fiscalía
    IF @FiscaliaActual <> @FiscaliaNuevo
    BEGIN
        INSERT INTO dbo.LogReasignacionFallida
        (
            Motivo,
            CasoID,
            FiscalAnteriorID,
            FiscalNuevoID
        )
        VALUES
        (
            N'El nuevo fiscal no pertenece a la misma fiscalía',
            @CasoID,
            @FiscalActual,
            @NuevoFiscalID
        );
        SET @MotivoSalida = N'El nuevo fiscal no pertenece a la misma fiscalía';
        RETURN;
    END

    -- 6) Reasignar el caso y actualizar FechaUltimaActualizacion
    UPDATE dbo.Caso
    SET
        FiscalID = @NuevoFiscalID,
        FechaUltimaActualizacion = SYSUTCDATETIME()
    WHERE
        CasoID = @CasoID;

    SET @MotivoSalida = NULL;
END
```

- **Parámetros de entrada**:
    - @CasoID (INT): ID del caso a reasignar.
    - @NuevoFiscalID (INT): ID del nuevo fiscal.
- **Parámetro de salida**:
    - @MotivoSalida (NVARCHAR(255) OUTPUT): si hay fallo, contiene el texto del motivo; si todo OK, queda NULL.

---

### **3.5.**

### **usp_ListarFiscales**

```sql
CREATE PROCEDURE dbo.usp_ListarFiscales
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        FiscalID,
        Nombre,
        CorreoElectronico,
        Usuario,
        Rol,
        FiscaliaID
    FROM dbo.Fiscal
    ORDER BY Nombre;
END
```

- **Salida**: Todas las filas de la tabla Fiscal con los campos indicados.

---

## **Estructura de Carpetas**

```
backend/
├─ src/
│  ├─ controllers/
│  │  ├─ casoController.ts
│  │  └─ fiscalController.ts
│  ├─ models/
│  │  ├─ caso.ts
│  │  ├─ informe.ts
│  │  └─ fiscal.ts
│  ├─ services/
│  │  ├─ db.ts
│  │  ├─ casoService.ts
│  │  └─ fiscalService.ts
│  ├─ routes/
│  │  ├─ casos.ts
│  │  ├─ fiscales.ts
│  │  └─ index.ts
│  ├─ index.ts
│  └─ ... (otros archivos como .env, tsconfig.json, etc.)
├─ package.json
└─ tsconfig.json
```

---

## **Configuración de la Conexión a Base de Datos**

En el archivo raíz crea un .env con:

```
DB_HOST=<tu_servidor_sql>
DB_PORT=1433
DB_USER=<tu_usuario_sql>
DB_PASSWORD=<tu_password_sql>
DB_DATABASE=<tu_base_de_datos>
DB_ENCRYPT=true        # Ajusta según tu entorno (Azure = true, local = false)
```

Asegúrate de instalar las dependencias:

```
npm install express mssql cors morgan dotenv
npm install --save-dev typescript ts-node-dev @types/express @types/node @types/mssql
```

## **Notas Adicionales**

- Los SP manejan errores internos y, en algunos casos (por ejemplo, usp_ReasignarCaso), colocan un registro en LogReasignacionFallida y devuelven un mensaje explícito en @MotivoSalida.
- La aplicación **no** genera tokens JWT ni maneja autenticación avanzada; se asume que el correo electrónico en los headers es suficiente para identificar al fiscal (y que el hash de la contraseña ya fue validado anteriormente).
- Si en el futuro quieres agregar paginación a los listados (casos, fiscales), bastaría con modificar los servicios para aceptar parámetros como page y limit, y ajustar los SP o consultas SQL correspondientes.
- El tipo de datos en SQL Server para asegurarte de que NVARCHAR(255) es suficiente para almacenar los motivos (@MotivoSalida) o los permisos, según se extienda la lógica.
- Para entornos de producción, considera implementar un manejo de errores más detallado (logs en archivos, monitoreo), validación de esquemas (con Joi o class-validator), y una capa de autenticación/autorización (JWT, sesiones, OAuth, etc.).

---