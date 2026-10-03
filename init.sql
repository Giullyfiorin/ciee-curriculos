IF DB_ID('CieeCurriculos') IS NULL
BEGIN
    CREATE DATABASE CieeCurriculos;
END;
GO

USE CieeCurriculos;
GO

IF OBJECT_ID('dbo.Candidatos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Candidatos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nomeCompleto NVARCHAR(200) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        telefone NVARCHAR(30) NULL,
        areaInteresse NVARCHAR(150) NULL,
        resumoProfissional NVARCHAR(MAX) NULL,
        criadoEm DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END;
GO