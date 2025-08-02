SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE pr_EliminarConcierto
@Codigo VARCHAR(50),
@Resultado INT OUTPUT

AS
BEGIN

	SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM dbo.ConciertosCR WHERE Codigo = @Codigo)
	BEGIN
		DELETE FROM dbo.ConciertosCR WHERE Codigo = @Codigo;
		SET @Resultado = 0; 
	END
	ELSE 
	BEGIN
		SET @Resultado = 1;
	END

END
GO
