IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_GetUserMenuAccessData]'))
BEGIN
DROP PROCEDURE  sp_GetUserMenuAccessData
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUserMenuAccessData '1','ERP'
 
 
CREATE PROCEDURE [dbo].[sp_GetUserMenuAccessData]
    @Id INT = 0,
    @UserId NVARCHAR(50) = '0'
AS
BEGIN
    BEGIN   	


-- DECLARE @RoleId INT = 1, @UserId NVARCHAR(10) = 'ERP';

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
        M.IsActive = 1 
),
MenuData AS (
    SELECT 
        CAST(1 AS BIT) AS IsChecked,
        UM.RoleId,
        UM.MenuId,
        M.ParentId,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller,
        M.DisplayOrder,
        UM.List,
        UM.[Insert],
        UM.[Delete],
        UM.Post
    FROM 
        UserMenu UM   
    LEFT OUTER JOIN  
        [dbo].[Menu] M ON UM.MenuId = M.Id
    LEFT OUTER JOIN  
        [dbo].[Role] R ON UM.RoleId = R.Id
    LEFT OUTER JOIN  
        [AuthDMS].[dbo].[AspNetUsers] U ON UM.UserId = U.UserName
    JOIN
        MenuHierarchy MH ON UM.MenuId = MH.Id
    WHERE 
        M.IsActive = 1 AND UM.RoleId = @Id AND UM.UserId = @UserId 

    UNION ALL

    SELECT 
        0 AS IsChecked,
        0 AS RoleId,
        M.Id AS MenuId,
        M.ParentId,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller,
        M.DisplayOrder,
        0 AS List,
        0 AS [Insert],
        0 AS [Delete],
        0 AS Post
    FROM 
        [dbo].[Menu] M
    JOIN
        MenuHierarchy MH ON M.Id = MH.Id
    WHERE 
        M.IsActive = 1 AND M.Id NOT IN (SELECT MenuId FROM UserMenu WHERE RoleId = @Id AND UserId = @UserId)
)

SELECT DISTINCT
    MenuId Id,
    IsChecked,
    RoleId,
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
