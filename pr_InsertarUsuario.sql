SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE pr_InsertarUsuario
@Usuario VARCHAR(50),
@Password VARCHAR(50),
@Resultado INT OUTPUT

AS
BEGIN

	SET NOCOUNT ON;
	INSERT INTO dbo.Usuarios(Usuario, Password)
	VALUES (@Usuario, @Password)

	SET @Resultado = 0;

END
GO
