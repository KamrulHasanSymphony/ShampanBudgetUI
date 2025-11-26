IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_GetUOMList]'))
BEGIN
DROP PROCEDURE  sp_GetUOMList
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUOMList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetUOMList]
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

		 SET @sql = N'

		  SELECT DISTINCT

			 1	Id
			,''UOM-00001'' Code
			,''Ltr'' Name
			,''Active'' Status

			UNION ALL

            SELECT DISTINCT

			 ISNULL(H.Id,0)	Id
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM UOMs H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
