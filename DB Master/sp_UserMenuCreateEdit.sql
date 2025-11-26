IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_UserMenuCreateEdit]'))
BEGIN
DROP PROCEDURE  sp_UserMenuCreateEdit
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_UserMenuCreateEdit]  'ERP',1,1,'ERP','::1'
 

CREATE PROCEDURE [dbo].[sp_UserMenuCreateEdit]	
	@UserId nvarchar(64) = NULL,
	@RoleId INT = 0,
	@MenuId INT = 0,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;

		--DELETE FROM UserMenu WHERE UserId = @UserId
        
		
		INSERT INTO [dbo].[UserMenu] 
			(
				 UserId
				,RoleId
				,MenuId
				,CreatedBy
				,CreatedOn
				,CreatedFrom
				,LastModifiedBy
				,LastModifiedOn
				,LastUpdateFrom
			) 
			VALUES
			(
				 @UserId
				,@RoleId
				,@MenuId
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
			)		

		SET @TotalRowsAffected = @@ROWCOUNT;

        IF (@TotalRowsAffected = 0)
        BEGIN
            RAISERROR('Failed!', 16, 1);
        END
        ELSE
        BEGIN
           SELECT SCOPE_IDENTITY();
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
