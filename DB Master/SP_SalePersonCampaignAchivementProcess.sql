IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[SP_SalePersonCampaignAchivementProcess]'))
BEGIN
DROP PROCEDURE  SP_SalePersonCampaignAchivementProcess
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		 SP_SalePersonCampaignAchivementProcess 3,'2025-06-30'
--		 SP_SalePersonCampaignAchivementProcess 3,'2025-12-31'


CREATE PROCEDURE [dbo].[SP_SalePersonCampaignAchivementProcess]  
(
    @SalePersonId INT,
    @Date NVARCHAR(20)
)
AS
BEGIN    
    
	CREATE TABLE #TempResults
	(
		BranchId INT,
		CampaignTargetId INT,
		SalePersonId INT,
		CampaignId INT,
		Name NVARCHAR(255),
		TotalTarget DECIMAL(18, 2),
		TotalSale DECIMAL(18, 2),
		StartDate NVARCHAR(20),
		EndDate NVARCHAR(20),
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


	INSERT INTO #TempResults(BranchId,CampaignTargetId,SalePersonId,CampaignId,Name,TotalTarget,TotalSale,StartDate,EndDate,SelfSaleCommissionRate,BonusAmount,OtherSaleCommissionRate,OtherCommissionBonus) 
	SELECT DISTINCT 
		ISNULL(CT.BranchId,0) BranchId,
		ISNULL(CT.Id,0) CampaignTargetId,
		ISNULL(CT.SalePersonId,0) SalePersonId,
		ISNULL(CT.CampaignId,0) CampaignId,
		ISNULL(E.Name,'') Name,
		ISNULL(CT.TotalTarget,0) TotalTarget,
		ISNULL(CT.TotalSale,0) TotalSale,
		ISNULL(CT.StartDate,'') StartDate,
		ISNULL(CT.EndDate,'') EndDate,
		ISNULL(CT.SelfSaleCommissionRate,0) SelfSaleCommissionRate,		
		((ISNULL(CT.TotalSale,0) * ISNULL(CT.SelfSaleCommissionRate,0)) / 100) AS BonusAmount,
		ISNULL(CT.OtherSaleCommissionRate,0) OtherSaleCommissionRate,
		ISNULL(CASE
			WHEN E.Id = @SalePersonId THEN
				((SELECT SUM(ISNULL(CT2.TotalSale,0)) FROM SalePersonCampaignTargets CT2 WHERE IsApproved = 1 AND @Date BETWEEN CT.StartDate AND CT.EndDate 
				AND CT2.SalePersonId IN (SELECT SalePersonId FROM #Temp)) * ISNULL(CT.OtherSaleCommissionRate,0) / 100)
			ELSE 0
		END,0) AS OtherCommissionBonus

	FROM SalesPersons E
	LEFT OUTER JOIN SalePersonCampaignTargets CT ON E.Id = CT.SalePersonId AND IsApproved = 1 AND @Date BETWEEN CT.StartDate AND CT.EndDate
	WHERE E.Id IN (@SalePersonId)
	

	SELECT *,(ISNULL(BonusAmount,0)+ISNULL(OtherCommissionBonus,0)) TotalBonus FROM #TempResults;

	DROP TABLE #Temp;
	DROP TABLE #TempResults;

END

