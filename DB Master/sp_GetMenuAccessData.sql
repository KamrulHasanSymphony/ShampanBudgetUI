IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_GetMenuAccessData]'))
BEGIN
DROP PROCEDURE  sp_GetMenuAccessData
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetMenuAccessData '1'
 
 
CREATE PROCEDURE [dbo].[sp_GetMenuAccessData]
    @Id INT = 0
AS
BEGIN
    BEGIN   	


WITH MenuHierarchy AS (
    SELECT 
        Id, 
        [Name], 
        ParentId, 
        CAST([Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu
    WHERE  
         IsActive = 1 AND ParentId = 0 -- Start with top-level menus (where ParentId is NULL)
    UNION ALL
    SELECT 
        m.Id, 
        m.[Name], 
        m.ParentId, 
        CAST(mc.MenuName + ' > ' + m.[Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu m    
    INNER JOIN 
        MenuHierarchy mc ON m.ParentId = mc.Id
    WHERE  
         m.IsActive = 1 
),
MenuData AS (
    SELECT 
        1 AS IsChecked,
        RM.RoleId,
        RM.MenuId,
        RM.List,
        RM.[Insert],
        RM.[Delete],
        RM.Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        RoleMenu RM
    LEFT OUTER JOIN  
        [dbo].[Menu] M ON RM.MenuId = M.Id
    JOIN
        MenuHierarchy MH ON RM.MenuId = MH.Id
    WHERE 
        M.IsActive = 1 AND RM.RoleId = @Id

    UNION ALL

    SELECT 
        0 AS IsChecked,
        0 AS RoleId,
        M.Id AS MenuId,
        0 AS List,
        0 AS [Insert],
        0 AS [Delete],
        0 AS Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        [dbo].[Menu] M
    JOIN
        MenuHierarchy MH ON M.Id = MH.Id
    WHERE 
        M.IsActive = 1 AND M.Id NOT IN (SELECT MenuId FROM RoleMenu WHERE RoleId = @Id)
)

SELECT DISTINCT
    MenuId Id,
    IsChecked,
    RoleId,
	'0' UserGroupId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder,
    MAX(List) AS List,
    MAX([Insert]) AS [Insert],
    MAX([Delete]) AS [Delete],
    MAX(Post) AS Post
FROM 
    MenuData
GROUP BY 
    IsChecked,
    RoleId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder
ORDER BY 
    DisplayOrder;

    END
END
