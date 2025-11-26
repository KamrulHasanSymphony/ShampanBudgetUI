ALTER TABLE [dbo].[Menu] DROP CONSTRAINT [DF__Menu__IsActive__4850AF91]
GO
/****** Object:  Table [dbo].[Menu]    Script Date: 2025-01-20 11:18:02 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Menu]') AND type in (N'U'))
DROP TABLE [dbo].[Menu]
GO
/****** Object:  Table [dbo].[Menu]    Script Date: 2025-01-20 11:18:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Menu](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Url] [nvarchar](250) NULL,
	[Name] [nvarchar](250) NULL,
	[Module] [nvarchar](250) NULL,
	[Controller] [nvarchar](250) NULL,
	[ParentId] [int] NULL,
	[SubParentId] [int] NULL,
	[SubChildId] [int] NULL,
	[DisplayOrder] [int] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](50) NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
	[IconClass] [nvarchar](100) NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Menu] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Menu] ON 
GO
------------------------------------ Dashboard  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (1, N'/Common/Home?branchChange=False', N'Dashboard', N'Common', N'Home', 0, 0, 0, 1, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-tachometer-alt', 1)
GO
------------------------------------ LogOff  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (2, N'/Login/LogOff', N'User Logout', NULL, N'Login', 0, 0, 0, 9999, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-sign-out-alt', 1)
GO
------------------------------------ Menu Authorization  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (3, NULL, N'Menu Authorization', N'SetUp', NULL, 0, 0, 0, 8000, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-cog', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (4, N'/SetUp/MenuAuthorization/Role', N'Role', N'SetUp', N'MenuAuthorization', 3, 3, 0, 8001, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-circle', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (5, N'/SetUp/MenuAuthorization/UserGroup', N'User Group', N'SetUp', N'MenuAuthorization', 3, 3, 0, 8002, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-circle', 0)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (6, N'/SetUp/MenuAuthorization/RoleMenu', N'Role Menu Assign', N'SetUp', N'MenuAuthorization', 3, 3, 0, 8003, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-shield', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (7, N'/SetUp/MenuAuthorization/UserMenu', N'User Menu Assign', N'SetUp', N'MenuAuthorization', 3, 3, 0, 8004, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-address-book', 1)
GO
------------------------------------ DMS Module  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (8, NULL, N'DMS',N'DMS', NULL, 0, 0, 0, 2, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-warehouse', 1)
GO
------------------------------------ Purchase  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (9, NULL, N'Purchase',N'DMS', NULL, 8, 8, 0, 3, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-shopping-cart', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (10, N'/DMS/PurchaseOrder/Index', N'Purchase Order Entry',N'DMS', N'PurchaseOrder', 9, 9, 0, 4, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-file-invoice', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (11, N'/DMS/Purchase/Index', N'Purchase Entry',N'DMS', N'Purchase', 9, 9, 0, 5, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-file-alt', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (12, N'/DMS/PurchaseReturn/Index', N'Purchase Return Entry',N'DMS', N'PurchaseReturn', 9, 9, 0, 6, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-truck-loading', 1)
GO
------------------------------------ Sale  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (13, NULL, N'Sale',N'DMS', NULL, 8, 8, 0, 10, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-cart-plus', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (14, N'/DMS/SaleOrder/Index', N'Sale Order Entry',N'DMS', N'SaleOrder', 13, 13, 0, 11, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-clipboard-list', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (15, N'/DMS/SaleDelivery/Index', N'Sale Delivery Entry',N'DMS', N'SaleDelivery', 13, 13, 0, 12, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-shipping-fast', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (16, N'/DMS/SaleDeliveryReturn/Index', N'Sale Delivery Return Entry',N'DMS', N'SaleDeliveryReturn', 13, 13, 0, 13, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-truck-loading', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (17, N'/DMS/Sale/Index', N'Sale Entry',N'DMS', N'Sale', 13, 13, 0, 14, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-file-invoice-dollar',1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (18, N'/DMS/SaleReturn/Index', N'Sale Return Entry',N'DMS', N'SaleReturn', 13, 13, 0, 15, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-truck-loading', 1)
GO
------------------------------------ Campaign  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (19, NULL, N'Campaign',N'DMS', NULL, 8, 8, 0, 20, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-bullhorn', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (20, N'/DMS/Campaign/Index?Type=CampaignByInvoiceValue', N'Total Invoice Value',N'DMS', N'Campaign', 19, 19, 0, 21, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-chart-line', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (21, N'/DMS/Campaign/Index?Type=CampaignByProductValue', N'Product Unit Rate',N'DMS', N'Campaign', 19, 19, 0, 22, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-cube', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (22, N'/DMS/Campaign/Index?Type=CampaignByProductQuantity', N'Product Qty Discount',N'DMS', N'Campaign', 19, 19, 0, 23, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-balance-scale', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (23, N'/DMS/Campaign/Index?Type=CampaignByProductTotalValue', N'Product Total Price',N'DMS', N'Campaign', 19, 19, 0, 24, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-chart-line', 1)
GO
------------------------------------ SalesPerson  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (24, NULL, N'Sales Person',N'DMS', NULL, 8, 8, 0, 30, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-user-tie', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (25, N'/DMS/SalesPerson/Index', N'Sale Person Entry',N'DMS', N'SalesPerson', 24, 24, 0, 31, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-handshake', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (26, N'/DMS/SalePersonCampaignTarget/Index', N'Campaign Target Entry',N'DMS', N'SalePersonCampaignTarget', 24, 24, 0, 32, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-chart-line', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (27, N'/DMS/SalePersonYearlyTarget/Index', N'Yearly Target Entry',N'DMS', N'SalePersonYearlyTarget', 24, 24, 0, 33, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-chart-line', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (28, N'/DMS/SalePersonMonthlyAchievement/Index', N'Monthly Achievement Entry',N'DMS', N'SalePersonMonthlyAchievement', 24, 24, 0, 34, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-certificate', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (29, N'/DMS/SalePersonCampaignAchievement/Index', N'Campaign Achievement Entry',N'DMS', N'SalePersonCampaignAchievement', 24, 24, 0, 35, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-certificate', 1)
GO
------------------------------------ SetUp Module  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (30, NULL, N'Set Up',N'SetUp', NULL, 0, 0, 0, 50, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-cog', 1)
GO
------------------------------------ Branch  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (31, NULL, N'Branch',N'SetUp', NULL, 30, 30, 0, 51, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-code-branch', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (32, N'/DMS/BranchProfile/Index', N'Branch Profile Entry',N'SetUp', N'BranchProfile', 31, 31, 0, 52, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-sitemap', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (33, N'/DMS/BranchAdvance/Index', N'Branch Advance Entry',N'SetUp', N'BranchAdvance', 31, 31, 0, 53, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-arrow-circle-right', 0)
GO
------------------------------------ Fiscal Year  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (34, NULL, N'Fiscal Year',N'SetUp', NULL, 30, 30, 0, 54, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-calendar-alt', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (35, N'/DMS/FiscalYear/Index', N'Fiscal Year Entry',N'SetUp', N'FiscalYear', 34, 34, 0, 55, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-calendar-alt', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (36, N'/DMS/FiscalYearForSale/Index', N'Fiscal Year For Sale Entry',N'SetUp', N'FiscalYearForSale', 34, 34, 0, 56, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-calendar-alt', 1)
GO
------------------------------------ Customer  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (37, NULL, N'Customer',N'SetUp', NULL, 30, 30, 0, 56, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-id-badge', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (38, N'/DMS/CustomerGroup/Index', N'Customer Group Entry',N'SetUp', N'CustomerGroup', 37, 37, 0, 57, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-user-friends', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (39, N'/DMS/Customer/Index', N'Customer Entry',N'SetUp', N'Customer', 37, 37, 0, 58, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-user-circle', 1)
GO
------------------------------------ Supplier  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (40, NULL, N'Supplier',N'SetUp', NULL, 30, 30, 0, 59, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-handshake', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (41, N'/DMS/SupplierGroup/Index', N'Supplier Group Entry',N'SetUp', N'SupplierGroup', 40, 40, 0, 60, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-people-carry', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (42, N'/DMS/Supplier/Index', N'Supplier Entry',N'SetUp', N'Supplier', 40, 40, 0, 61, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fas fa-handshake', 1)
GO
------------------------------------ Product  -------------------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (43, NULL, N'Product',N'SetUp', NULL, 30, 30, 0, 62, N'ERP', GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-box', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (44, N'/DMS/ProductGroup/Index', N'Product Group Entry',N'SetUp', N'SupplierGroup', 43, 43, 0, 63, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-layer-group', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (45, N'/DMS/Product/Index', N'Product Entry',N'SetUp', N'Product', 43, 43, 0, 64, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-box', 1)
GO
------------------------------- -------------------------------------
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (46, N'/SetUp/CompanyProfile/Index', N'Company Profile Entry',N'SetUp', N'CompanyProfile', 30, 0, 30, 65, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-building', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (47, N'/DMS/Areas/Index', N'Area Entry',N'SetUp', N'Areas', 30, 0, 30, 66, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-globe', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (48, N'/DMS/Location/Index', N'Location Entry',N'SetUp', N'Location', 30, 0, 30, 67, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-map-marker-alt', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (49, N'/DMS/Route/Index', N'Route Entry',N'SetUp', N'Route', 30, 0, 30, 68, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-road', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (50, N'/DMS/ContactPerson/Index', N'Contact Person Entry',N'SetUp', N'ContactPerson', 30, 0, 30, 69, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-phone', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (51, N'/DMS/DeliveryPerson/Index', N'Delivery Person Entry',N'SetUp', N'DeliveryPerson', 30, 0, 30, 70, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-bicycle', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (52, N'/DMS/PaymentType/Index', N'Payment Type Entry',N'SetUp', N'PaymentType', 30, 0, 30, 71, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-credit-card', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (53, N'/DMS/BusinessType/Index', N'Business Type Entry',N'SetUp', N'BusinessType', 30, 0, 30, 72, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-briefcase', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (54, N'/DMS/Currencie/Index', N'Currency Entry',N'SetUp', N'Currencie', 30, 0, 30, 73, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-dollar-sign', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (55, N'/DMS/UOM/Index', N'UOM Entry',N'SetUp', N'UOM', 30, 0, 30, 74, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-balance-scale', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (56, N'/SetUp/UserProfile/Index', N'User Profile',N'SetUp', N'UserProfile', 30, 0, 30, 75, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-user-circle', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (57, N'/SetUp/Settings/Index', N'Settings',N'SetUp', N'Settings', 30, 0, 30, 76, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-cog', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (58, N'/SetUp/Settings/DbUpdate', N'DbUpdate',N'SetUp', N'Settings', 30, 0, 30, 77, N'ERP',GETDATE(), N'::1', N'ERP', GETDATE(), N'::1', N'nav-icon fas fa-sync', 1)
GO

SET IDENTITY_INSERT [dbo].[Menu] OFF
GO
ALTER TABLE [dbo].[Menu] ADD  CONSTRAINT [DF__Menu__IsActive__4850AF91]  DEFAULT ((1)) FOR [IsActive]
GO
