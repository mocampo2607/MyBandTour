SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE pr_InsertarConciertoCR
    @Codigo VARCHAR(50),
    @Banda VARCHAR(50),
    @Genero VARCHAR(50),
    @Fecha DATE,
    @Hora TIME(7),
    @Pais VARCHAR(50),
    @Lugar VARCHAR(50),
    @Resultado INT OUTPUT
AS
BEGIN

	SET NOCOUNT ON;
    INSERT INTO dbo.ConciertosCR(Codigo, Banda, Genero, Fecha, Hora, Pais, Lugar)
    VALUES (@Codigo, @Banda, @Genero, @Fecha, @Hora, @Pais, @Lugar)

    SET @Resultado = 0;
END
GO
