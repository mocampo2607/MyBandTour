SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE pr_ModificarConcierto
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

    IF EXISTS (SELECT 1 FROM dbo.ConciertosCR WHERE Codigo = @Codigo)
    BEGIN
    UPDATE dbo.ConciertosCR
    SET Banda = @Banda,
        Genero = @Genero,
        Fecha = @Fecha,
        Hora = @Hora,
        Pais = @Pais,
        Lugar = @Lugar
    WHERE Codigo = @Codigo;

    SET @Resultado = 0;
    END
    ELSE
    BEGIN
        SET @Resultado = 1;
    END

END
GO
