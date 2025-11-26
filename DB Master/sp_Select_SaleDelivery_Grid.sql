IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[sp_Select_SaleDelivery_Grid]'))
BEGIN
DROP PROCEDURE  sp_Select_SaleDelivery_Grid
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_SaleDelivery_Grid 'get_summary',0,10,'','M.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_SaleDelivery_Grid]
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
					SELECT COUNT(DISTINCT M.Id) AS totalcount
					FROM SaleDeleveries M 
					LEFT OUTER JOIN BranchProfiles Br ON M.BranchId = Br.Id
					LEFT OUTER JOIN Customers cus ON M.CustomerId = cus.Id
					LEFT OUTER JOIN SalesPersons SP ON M.SalePersonId = SP.Id
					LEFT OUTER JOIN DeliveryPersons DP ON M.DeliveryPersonId = DP.Id
					LEFT OUTER JOIN Routes rut ON M.RouteId = rut.Id
					LEFT OUTER JOIN EnumTypes ET ON M.DriverPersonId = ET.Id
					WHERE 1 = 1  ';
			
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
				,ISNULL(M.Id,0)	Id
				,ISNULL(M.Code,'''') Code
				,ISNULL(M.VehicleNo,'''') VehicleNo
				,ISNULL(M.VehicleType,'''') VehicleType
				,ISNULL(M.DeliveryAddress,'''') DeliveryAddress
				,ISNULL(M.Comments,'''') Comments
				,ISNULL(FORMAT(M.GrandTotalAmount, ''N2''), ''0.00'') AS GrdTotalAmount
				,ISNULL(FORMAT(M.GrandTotalSDAmount, ''N2''), ''0.00'') AS GrdTotalSDAmount
				,ISNULL(FORMAT(M.GrandTotalVATAmount, ''N2''), ''0.00'') AS GrdTotalVATAmount
				,ISNULL(FORMAT(M.InvoiceDateTime,''yyyy-MM-dd''),''1900-01-01'') InvoiceDateTime
				,ISNULL(FORMAT(M.DeliveryDate,''yyyy-MM-dd''),''1900-01-01'') DeliveryDate

				,ISNULL(Br.Name,'') BranchName
				,ISNULL(cus.Name,'') CustomerName
				,ISNULL(SP.Name,'') SalePersonName
				,ISNULL(DP.Name,'') DeliveryPersonName
				,ISNULL(rut.Name,'') RouteName
				,ISNULL(ET.Name,'') DriverPersonName

				FROM SaleDeleveries M 
				LEFT OUTER JOIN BranchProfiles Br ON M.BranchId = Br.Id
				LEFT OUTER JOIN Customers cus ON M.CustomerId = cus.Id
				LEFT OUTER JOIN SalesPersons SP ON M.SalePersonId = SP.Id
				LEFT OUTER JOIN DeliveryPersons DP ON M.DeliveryPersonId = DP.Id
				LEFT OUTER JOIN Routes rut ON M.RouteId = rut.Id
				LEFT OUTER JOIN EnumTypes ET ON M.DriverPersonId = ET.Id
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

