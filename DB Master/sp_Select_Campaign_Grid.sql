IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Select_Campaign_Grid]'))
BEGIN
DROP PROCEDURE  sp_Select_Campaign_Grid
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_Campaign_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_Campaign_Grid]
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

         -- Common query parts
		SET @sql = N'
					 SELECT COUNT(DISTINCT H.Id) AS totalcount
					 FROM Campaigns H
					 WHERE H.IsActive = 1';
			
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
				    ,ISNULL(H.Id, 0) AS Id
					,ISNULL(H.Code, '''') AS Code
					,ISNULL(H.Name, '''') AS Name
					,ISNULL(H.Description, '''') AS Description
					,ISNULL(H.IsArchive, 0) AS IsArchive
					,ISNULL(H.IsActive, 0) AS IsActive
					,CASE WHEN ISNULL(H.IsActive, 0) = 1 THEN ''Active'' ELSE ''Inactive'' END AS Status
					,ISNULL(H.CreatedBy, '''') AS CreatedBy
					,ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy
					,ISNULL(FORMAT(H.CreatedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS CreatedOn
					,ISNULL(FORMAT(H.LastModifiedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS LastModifiedOn
					,ISNULL(H.BranchId, 0) AS BranchId
 
					FROM Campaigns H

					WHERE H.IsActive = 1 ';        
        
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
        RETURN;
    END
    ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END

