IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Delete]'))
BEGIN
DROP PROCEDURE  sp_Delete
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE [dbo].[sp_Delete]  '1','',''
--			EXECUTE [dbo].[sp_Delete]  '','ERP',''
--			EXECUTE [dbo].[sp_Delete]  '','','1'
 

CREATE PROCEDURE [dbo].[sp_Delete]	
	@RoleId nvarchar(64) = NULL,
	@UserId nvarchar(64) = NULL,
	@UserGroupId nvarchar(64) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;

		IF(@RoleId !='')
		BEGIN
			DELETE FROM RoleMenu WHERE RoleId = @RoleId
			SELECT 'RoleMenu' RoleMenu;
		END		
		ELSE IF(@UserId !='')
		BEGIN
			DELETE FROM UserMenu WHERE UserId = @UserId  
			SELECT 'UserMenu' UserMenu;
		END
		ELSE IF(@UserGroupId !='')
		BEGIN
			DELETE FROM RoleMenu WHERE UserGroupId = @UserGroupId
			SELECT 'RoleMenu' RoleMenu;
		END
		

        COMMIT TRANSACTION ProcessCommit;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        DECLARE @ERRORMESSAGE NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ERRORMESSAGE = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
        RAISERROR(@ERRORMESSAGE, @ErrorSeverity, @ErrorState);
    END CATCH
END
