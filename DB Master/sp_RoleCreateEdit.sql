IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_RoleCreateEdit]'))
BEGIN
DROP PROCEDURE  sp_RoleCreateEdit
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_RoleCreateEdit]  0,'Admin','ERP','::1','add'
--			EXECUTE [dbo].[sp_RoleCreateEdit]  1,'Admin','ERP','::1','update'
--			EXECUTE [dbo].[sp_RoleCreateEdit]  2,'User','ERP','::1','add'
--			EXECUTE [dbo].[sp_RoleCreateEdit]  2,'User','ERP','::1','update'
 

CREATE PROCEDURE [dbo].[sp_RoleCreateEdit]
	
	@Id INT = 0,
	@Name		 nvarchar(50) = NULL,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL,
	@Operation	 nvarchar(20) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;
        
		IF NOT EXISTS (SELECT 1 FROM [dbo].[Role] WHERE Name = @Name AND Id != @Id)
			BEGIN
			IF(@Operation = 'add')
			BEGIN
				INSERT INTO [dbo].[Role] 
			(
				 Name
				,CreatedBy
				,CreatedOn
				,CreatedFrom
			) 
			VALUES
			(
				 @Name
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
			)
			END
			ELSE
			BEGIN
				 UPDATE [dbo].[Role] SET  
				 Name=@Name
				,LastModifiedBy=@CreatedBy
				,LastModifiedOn=GETDATE()
				,LastUpdateFrom=@CreatedFrom
                       
				WHERE  Id = @Id
			END
			END
		ELSE
		BEGIN
			RAISERROR('[%s] Data Already Exist!', 16, 1, @Name);
		END		

		SET @TotalRowsAffected = @@ROWCOUNT;

        IF (@TotalRowsAffected = 0)
        BEGIN
            RAISERROR('Failed!', 16, 1);
        END
        ELSE
        BEGIN
           SELECT ISNULL(SCOPE_IDENTITY(),@Id);
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
