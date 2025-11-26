IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Select_GetRoleAll]'))
BEGIN
DROP PROCEDURE  sp_Select_GetRoleAll
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_Select_GetRoleAll '1'
 
 
CREATE PROCEDURE [dbo].[sp_Select_GetRoleAll]
    @Id INT = 0
AS
BEGIN
    BEGIN
	   	
		SELECT
		 Id
		,ISNULL(Name,'') Name
		,ISNULL(CreatedBy,'')	CreatedBy	
		,ISNULL(CreatedFrom,'')	CreatedFrom	
		,ISNULL(LastUpdateFrom,'')LastUpdateFrom	
		,ISNULL(LastModifiedBy,'')LastModifiedBy	
		,Isnull(FORMAT(CreatedOn,'yyyy-MM-dd HH:mm:ss'),'1900-01-01') CreatedOn
		,Isnull(FORMAT(LastModifiedOn,'yyyy-MM-dd HH:mm:ss'),'1900-01-01') LastModifiedOn
		,LastUpdateFrom

		FROM [dbo].[Role] WHERE Id = @Id 

    END
END
