IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_GetUserGroupData]'))
BEGIN
DROP PROCEDURE  sp_GetUserGroupData
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUserGroupData 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetUserGroupData]
    @calltype VARCHAR(200) = 'call for nothing',
    @Desc1 VARCHAR(200) = '',
    @Desc2 VARCHAR(200) = '',
    @Desc3 VARCHAR(200) = '',
    @Desc4 VARCHAR(200) = '',
    @Desc5 VARCHAR(200) = '',
    @Desc6 VARCHAR(200) = '',
    @Desc7 VARCHAR(200) = '',
    @Desc8 VARCHAR(200) = '',
    @Desc9 VARCHAR(200) = '',
    @Desc10 VARCHAR(200) = ''
AS
BEGIN
    IF @calltype = 'get_List'
    BEGIN
	   	
		DECLARE @sql NVARCHAR(MAX);
		DECLARE @params NVARCHAR(MAX) = N'@Desc1 VARCHAR(200)';

		 SET @sql = N'
					 SELECT Id, Name GroupName FROM [dbo].[UserGroup] WHERE 1 = 1 ';

			EXEC sp_executesql @sql, @params, @Desc1;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
