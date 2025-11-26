IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_GetAssignedMenuList]'))
BEGIN
DROP PROCEDURE  sp_GetAssignedMenuList
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetAssignedMenuList 'get_List', 'ERP', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetAssignedMenuList]
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
SELECT 
UM.MenuId,
M.[Url],
M.[Name] AS MenuName,M.IconClass,
M.Controller,
ISNULL(M.ParentId,0) ParentId,
ISNULL(M.SubParentId,0) SubParentId,
ISNULL(M.SubChildId,0) SubChildId,
ISNULL(M.DisplayOrder,0) DisplayOrder,
(SELECT COUNT(ParentId) 
FROM [dbo].[Menu] 
LEFT OUTER JOIN  
[dbo].[UserMenu] ON Menu.Id = UserMenu.MenuId
WHERE Menu.IsActive = 1 AND ParentId = M.Id 
AND UserMenu.UserId = @Desc1
) AS TotalChild
FROM 
UserMenu UM
LEFT OUTER JOIN  
[dbo].[RoleMenu] RM ON UM.MenuId = RM.Id
LEFT OUTER JOIN  
[dbo].[Menu] M ON UM.MenuId = M.Id
LEFT OUTER JOIN  
[dbo].[Role] R ON UM.RoleId = R.Id
LEFT OUTER JOIN  
[AuthDMS].[dbo].[AspNetUsers] U ON UM.UserId = U.UserName
WHERE M.IsActive = 1 AND UM.UserId = @Desc1
GROUP BY 
    UM.MenuId,
    M.[Url],
    M.[Name],
    M.IconClass,
    M.Controller,
    M.ParentId,
    M.SubParentId,
    M.SubChildId,
    M.DisplayOrder,
    M.Id
ORDER BY 
    M.DisplayOrder
';

			EXEC sp_executesql @sql, @params, @Desc1;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
