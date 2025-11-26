IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_RoleMenuCreateEdit]'))
BEGIN
DROP PROCEDURE  sp_RoleMenuCreateEdit
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_RoleMenuCreateEdit]  1,0,1,'ERP','::1'
--			EXECUTE [dbo].[sp_RoleMenuCreateEdit]  0,1,1,'ERP','::1'
 

CREATE PROCEDURE [dbo].[sp_RoleMenuCreateEdit]	
	@RoleId INT = 0,
	@UserGroupId INT = 0,
	@MenuId INT = 0,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;

		--DELETE FROM RoleMenu WHERE RoleId = @RoleId
        
		
		INSERT INTO [dbo].[RoleMenu] 
			(
				 RoleId
				,UserGroupId
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
				 @RoleId
				,@UserGroupId
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
