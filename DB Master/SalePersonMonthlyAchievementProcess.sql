IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[SalePersonMonthlyAchievementProcess]'))
BEGIN
DROP PROCEDURE  SalePersonMonthlyAchievementProcess
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		 SalePersonMonthlyAchievementProcess 1,'2025'


CREATE PROCEDURE [dbo].[SalePersonMonthlyAchievementProcess]  
(
    @SalePersonId INT,
    @FiscalYear NVARCHAR(20)
)
AS
BEGIN    
    
	CREATE TABLE #TempResults
	(
		BranchId INT,
		SalePersonId INT,
		Name NVARCHAR(255),
		MonthlyTarget DECIMAL(18, 2),
		MonthlySales DECIMAL(18, 2),
		StartDate NVARCHAR(20),
		EndDate NVARCHAR(20),
		Year INT,
		MonthId INT,
		MonthStart NVARCHAR(20),
		MonthEnd NVARCHAR(20),
		SelfSaleCommissionRate DECIMAL(18, 2),
		BonusAmount DECIMAL(18, 2),
		OtherSaleCommissionRate DECIMAL(18, 2),
		OtherCommissionBonus DECIMAL(18, 2)		
	);


	CREATE TABLE #Temp 
	(
		Id INT IDENTITY(1,1),
		SalePersonId INT
	);	

	INSERT INTO #Temp(SalePersonId)
	SELECT Id
	FROM SalesPersons        
	WHERE ParentId = @SalePersonId


	INSERT INTO #TempResults(BranchId,SalePersonId,Name,MonthlyTarget,MonthlySales,StartDate,EndDate,Year,MonthId,MonthStart,MonthEnd,SelfSaleCommissionRate,BonusAmount,OtherSaleCommissionRate,OtherCommissionBonus) 
	SELECT DISTINCT 
		ISNULL(YT.BranchId,0) BranchId,
		ISNULL(YT.SalePersonId,0) SalePersonId,
		ISNULL(E.Name,'') Name,
		ISNULL(YTD.MonthlyTarget,0) MonthlyTarget,
		ISNULL(YTD.MonthlyTarget,0) MonthlySales,
		ISNULL(YT.YearStart,'') StartDate,
		ISNULL(YT.YearEnd,'') EndDate,
		ISNULL(YTD.Year,0) Year,
		ISNULL(YTD.MonthId,0) MonthId,
		ISNULL(YTD.MonthStart,'') MonthStart,
		ISNULL(YTD.MonthEnd,'') MonthEnd,
		ISNULL(YT.SelfSaleCommissionRate,0) SelfSaleCommissionRate,		
		((ISNULL(YTD.MonthlyTarget,0) * ISNULL(YT.SelfSaleCommissionRate,0)) / 100) AS BonusAmount,
		ISNULL(YT.OtherSaleCommissionRate,0) OtherSaleCommissionRate,
		ISNULL(CASE
			WHEN E.Id = @SalePersonId THEN
				((SELECT SUM(ISNULL(YTD2.MonthlyTarget,0)) FROM SalePersonYearlyTargets YT2 
				INNER JOIN SalePersonYearlyTargetDetails YTD2 ON YT2.Id = YTD2.SalePersonYearlyTargetId
				WHERE YT2.SalePersonId IN (SELECT SalePersonId FROM #Temp)) * ISNULL(YTD.OtherSaleCommissionRate,0) / 100)
			ELSE 0
		END,0) AS OtherCommissionBonus

	FROM SalesPersons E
	LEFT OUTER JOIN SalePersonYearlyTargets YT ON E.Id = YT.SalePersonId
	INNER JOIN SalePersonYearlyTargetDetails YTD ON YT.Id = YTD.SalePersonYearlyTargetId
	WHERE E.Id IN (@SalePersonId)
	

	SELECT *,(ISNULL(BonusAmount,0)+ISNULL(OtherCommissionBonus,0)) TotalBonus FROM #TempResults;

	DROP TABLE #Temp;
	DROP TABLE #TempResults;

END

