SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE pr_Autenticar

@Usuario varchar(50),
@Password varchar(50),
@Resultado int output

AS
BEGIN

	SET NOCOUNT ON;

	IF EXISTS (SELECT 1 FROM DBO.Usuarios WHERE Usuario = @Usuario AND Password = @Password)
	BEGIN
		SET @Resultado = 1
	END
	ELSE
	BEGIN
		SET @Resultado = 0
	END
END
GO
