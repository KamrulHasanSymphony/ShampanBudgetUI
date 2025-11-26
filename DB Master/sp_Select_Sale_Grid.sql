IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Select_Sale_Grid]'))
BEGIN
DROP PROCEDURE  sp_Select_Sale_Grid
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_Sale_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_Sale_Grid]
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
					FROM Sales H 
					LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
					LEFT OUTER JOIN Customers C ON H.CustomerId = C.Id
					LEFT OUTER JOIN SalesPersons SP ON H.SalePersonId = SP.Id
					LEFT OUTER JOIN Routes R ON H.RouteId = R.Id
					LEFT OUTER JOIN Currencies CR ON H.CurrencyId = CR.Id

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
				,ISNULL(H.Code,'''')	Code
				,ISNULL(H.DeliveryAddress,'''')	DeliveryAddress
				,ISNULL(H.VehicleNo,'''')	VehicleNo
				,ISNULL(H.VehicleType,'''')	VehicleType				
				,ISNULL(FORMAT(H.InvoiceDateTime,''yyyy-MM-dd HH:mm''),''1900-01-01'') InvoiceDateTime
				,ISNULL(FORMAT(H.DeliveryDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') DeliveryDate	
				,ISNULL(H.GrandTotalAmount,0) GrandTotalAmount
				,ISNULL(H.GrandTotalSDAmount,0) GrandTotalSDAmount
				,ISNULL(H.GrandTotalVATAmount,0) GrandTotalVATAmount
				,ISNULL(H.Comments,'''')	Comments	
				,ISNULL(H.TransactionType,'''')	TransactionType				
				,ISNULL(H.FiscalYear,'''')	FiscalYear				
				,ISNULL(H.PeriodId,'''')	PeriodId
				,ISNULL(H.CurrencyRateFromBDT,0) CurrencyRateFromBDT
				
				,ISNULL(H.IsPost,0) IsPost
				,ISNULL(H.PostBy,'''') PostBy
				,ISNULL(FORMAT(H.PostedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') PostedOn
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(H.CreatedFrom,'''') CreatedFrom
				,ISNULL(H.LastUpdateFrom,'''') LastUpdateFrom		
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn
		        ,ISNULL(H.BranchId,0) BranchId
		        ,ISNULL(H.CustomerId,0) CustomerId
		        ,ISNULL(H.SalePersonId,0) SalePersonId
		        ,ISNULL(H.RouteId,0) RouteId
		        ,ISNULL(H.CurrencyId,0) CurrencyId
		

				FROM Sales H 
				LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
				LEFT OUTER JOIN Customers C ON H.CustomerId = C.Id
				LEFT OUTER JOIN SalesPersons SP ON H.SalePersonId = SP.Id
				LEFT OUTER JOIN Routes R ON H.RouteId = R.Id
				LEFT OUTER JOIN Currencies CR ON H.CurrencyId = CR.Id
				
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

