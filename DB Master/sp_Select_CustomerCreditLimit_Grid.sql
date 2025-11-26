IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Select_CustomerCreditLimit_Grid]'))
BEGIN
DROP PROCEDURE  sp_Select_CustomerCreditLimit_Grid
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_CustomerCreditLimit_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_CustomerCreditLimit_Grid]
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
					FROM CustomerCreditLimits H 
					LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
					LEFT OUTER JOIN Customers C ON H.CustomerId = C.Id					
					WHERE 1 = 1 ';
			
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
				,ISNULL(H.Id,0)	Id
				,ISNULL(FORMAT(H.LimitEntryDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') LimitEntryDate
				,ISNULL(H.CreditLimit,0) CreditLimit

				,ISNULL(H.ApproveedBy,'''')	ApproveedBy
				,ISNULL(H.IsLatest,0) IsLatest
				,ISNULL(H.IsApproveed,0) IsApproveed
				,ISNULL(FORMAT(H.ApproveedDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') ApproveedDate
				,ISNULL(H.IsPost,0) IsPost
				,ISNULL(H.PostedBy,'''') PostedBy
				,ISNULL(FORMAT(H.PostedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') PostedOn
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(H.CreatedFrom,'''') CreatedFrom
				,ISNULL(H.LastUpdateFrom,'''') LastUpdateFrom		
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn

		        ,ISNULL(H.CustomerId,0) CustomerId
		        ,ISNULL(H.BranchId,0) BranchId


				FROM CustomerCreditLimits H 
				LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
				LEFT OUTER JOIN Customers C ON H.CustomerId = C.Id	
				
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
        RETURN;
    END
    ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END

