IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_GetReceiveByEnumTypeList]'))
BEGIN
DROP PROCEDURE  sp_GetReceiveByEnumTypeList
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetReceiveByEnumTypeList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetReceiveByEnumTypeList]
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

			 ISNULL(H.Id,0)	Id
			,ISNULL(H.Id,0)	Value
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.EnumType,'''')	EnumType

			 FROM EnumTypes H
			
			 WHERE H.EnumType = ''CustomerAdvanceReceiptBy''  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
