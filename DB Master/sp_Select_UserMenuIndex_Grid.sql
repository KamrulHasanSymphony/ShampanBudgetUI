IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Select_UserMenuIndex_Grid]'))
BEGIN
DROP PROCEDURE  sp_Select_UserMenuIndex_Grid
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_UserMenuIndex_Grid 'get_summary',0,10,'','H.RoleId','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_UserMenuIndex_Grid]
    @calltype VARCHAR(200) = 'call for nothing',
    @skip INT,  
    @take INT,               
    @filter VARCHAR(200) = '',
    @orderby VARCHAR(200) = '',
    @param1 VARCHAR(200) = '',
    @param2 VARCHAR(200) = '',
    @param3 VARCHAR(200) = '',
    @param4 VARCHAR(200) = '',
    @param5 VARCHAR(200) = '',
    @param6 VARCHAR(200) = '',
    @param7 VARCHAR(200) = '',
    @param8 VARCHAR(200) = '',
    @param9 VARCHAR(200) = '',
    @param10 VARCHAR(200) = ''
AS
BEGIN
    IF @calltype = 'get_summary' 
    BEGIN
        DECLARE @sql NVARCHAR(MAX);
        DECLARE @params NVARCHAR(MAX) = N'@param1 VARCHAR(200),@param2 VARCHAR(200),@param3 VARCHAR(200),@param4 VARCHAR(200),@param5 VARCHAR(200), @filter NVARCHAR(200), @skip INT, @take INT, @orderby NVARCHAR(200)';


			CREATE TABLE #Temp (
			UserId VARCHAR(255),
			RoleId VARCHAR(255),
			RoleName VARCHAR(255),
			FullName VARCHAR(255) );

			INSERT INTO #Temp (UserId, RoleId, RoleName,FullName)
			SELECT DISTINCT UM.UserId, UM.RoleId, R.Name AS RoleName,'' FullName
			FROM [dbo].[UserMenu] UM
			LEFT OUTER JOIN [dbo].[Role] R ON UM.RoleId = R.Id
			WHERE 1 = 1
			UNION ALL
			SELECT UM.UserName AS UserId, '0' AS RoleId, '' AS RoleName,UM.FullName
			FROM [Auth_Sample].[dbo].[AspNetUsers] UM
			WHERE UM.UserName NOT IN (SELECT DISTINCT UserId FROM [dbo].[UserMenu])
			AND 1 = 1; 

         -- Common query parts
		SET @sql = N'
					SELECT COUNT(RoleId) AS totalcount FROM #Temp WHERE 1 = 1 ';
			
		IF (@filter <> '')
		BEGIN
			SET @sql = @sql + ' AND (' + @filter + ')';
		END	        
					
		PRINT @sql;
		EXEC sp_executesql @sql, @params, @param1,@param2,@param3,@param4,@param5, @filter, @skip, @take, @orderby;

        SET @sql = N'
            SELECT * 
            FROM (
                SELECT 
				ROW_NUMBER() OVER(ORDER BY ' + @orderby + ') AS rowindex
				,H.*
				FROM #Temp H 
				WHERE 1 = 1 ';        
        
		IF (@filter <> '')
		BEGIN
			SET @sql = @sql + ' AND (' + @filter + ')';
		END

        SET @sql = @sql + '               
        ) AS a
        WHERE rowindex > @skip AND (@take = 0 OR rowindex <= @take)';

        PRINT @sql;
        -- Execute main query
        EXEC sp_executesql @sql, @params, @param1,@param2,@param3,@param4,@param5, @filter, @skip, @take, @orderby;
		DROP TABLE #Temp
        RETURN;
    END
    ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END

