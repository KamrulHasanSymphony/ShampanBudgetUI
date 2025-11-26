
--	CREATE DATABASE [ShampanSample_DB]

USE [ShampanSample_DB]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](300) NOT NULL,
	[BranchId] [int] NOT NULL,
	[Address] [nvarchar](500) NULL,
	[City] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[TINNo] [nvarchar](50) NULL,
	[Comments] [nvarchar](50) NULL,
	[IsArchive] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](120) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[CustomerBalanceView]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[CustomerBalanceView] AS
SELECT
    SL, 
    a.Code, 
    InvoiceDateTime, 
    CustomerId, 
    c.Code AS CustomerCode, 
    c.Name AS CustomerName, 
    c.Address AS CustomerAddress, 
    ISNULL(a.Opening, 0) AS Opening, 
    DrAmount, 
    SUM(ISNULL(a.Opening, 0) + ISNULL(DrAmount, 0) - ISNULL(CrAmount, 0))
        OVER(PARTITION BY a.CustomerId ORDER BY a.InvoiceDateTime, a.Code, SL 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS CurrentBalance, 
    Remarks
FROM (
    SELECT 'D' AS SL, Code, InvoiceDateTime, CustomerId, 0 AS Opening, 0 AS DrAmount,
        GrandTotalAmount AS CrAmount, 'Sales' AS Remarks
    FROM SaleDeleveries

    UNION ALL

    SELECT 'B' AS SL, ISNULL(s.Code, 0) AS Code, NULL AS InvoiceDateTime,
        ISNULL(s.CustomerId, 0) AS CustomerId, 0 AS Opening, 
        b.Amount AS DrAmount, 0 AS CrAmount, 
        b.ModeOfPayment + '~ ' + '~ ' AS Remarks
    FROM CustomerPaymentCollection b
    LEFT JOIN SaleDeleveries s ON b.CustomerId = s.CustomerId
) AS a
LEFT JOIN Customers c ON a.CustomerId = c.Id
WHERE c.IsActive = 1;
GO
/****** Object:  Table [dbo].[BranchProfiles]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BranchProfiles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[BanglaName] [nvarchar](150) NULL,
	[TelephoneNo] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[VATRegistrationNo] [nvarchar](50) NULL,
	[BIN] [nvarchar](50) NULL,
	[TINNO] [nvarchar](50) NULL,
	[Address] [nvarchar](max) NULL,
	[Comments] [varchar](200) NULL,
	[IsArchive] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](120) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
 CONSTRAINT [PK_BranchProfiles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CodeGenerations]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CodeGenerations](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CurrentYear] [varchar](4) NULL,
	[BranchId] [int] NULL,
	[Prefix] [varchar](5) NULL,
	[LastId] [int] NULL,
 CONSTRAINT [PK_CodeGenerations] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Codes]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Codes](
	[CodeId] [int] IDENTITY(1,1) NOT NULL,
	[CodeGroup] [varchar](120) NULL,
	[CodeName] [varchar](120) NULL,
	[prefix] [varchar](120) NULL,
	[Lenth] [varchar](120) NULL,
	[ActiveStatus] [varchar](1) NOT NULL,
	[CreatedBy] [varchar](120) NULL,
	[CreatedOn] [datetime] NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastId] [int] NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
 CONSTRAINT [PK_Codes] PRIMARY KEY CLUSTERED 
(
	[CodeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CompanyProfiles]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompanyProfiles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[CompanyName] [nvarchar](200) NOT NULL,
	[CompanyBanglaName] [nvarchar](200) NULL,
	[CompanyLegalName] [nvarchar](200) NULL,
	[Address1] [nvarchar](200) NULL,
	[Address2] [nvarchar](200) NULL,
	[Address3] [nvarchar](200) NULL,
	[City] [nvarchar](50) NULL,
	[ZipCode] [nvarchar](50) NULL,
	[TelephoneNo] [nvarchar](50) NULL,
	[FaxNo] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[ContactPerson] [nvarchar](150) NULL,
	[ContactPersonDesignation] [nvarchar](150) NULL,
	[ContactPersonTelephone] [nvarchar](50) NULL,
	[ContactPersonEmail] [nvarchar](50) NULL,
	[TINNo] [nvarchar](50) NULL,
	[VatRegistrationNo] [nvarchar](50) NULL,
	[Comments] [nvarchar](200) NULL,
	[IsArchive] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [nvarchar](50) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedFrom] [nvarchar](50) NOT NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
	[FYearStart] [datetime] NULL,
	[FYearEnd] [datetime] NULL,
	[BusinessNature] [nvarchar](100) NULL,
	[AccountingNature] [nvarchar](100) NULL,
	[CompanyTypeId] [int] NULL,
	[Section] [nvarchar](100) NULL,
	[BIN] [nvarchar](50) NULL,
	[IsVDSWithHolder] [bit] NULL,
	[AppVersion] [nvarchar](50) NULL,
	[License] [nvarchar](200) NULL,
 CONSTRAINT [PK_CompanyProfile] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EnumTypes]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EnumTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[EnumType] [nvarchar](50) NULL,
	[CreatedBy] [varchar](120) NULL,
	[CreatedOn] [datetime] NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](50) NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
 CONSTRAINT [PK_BranchTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FiscalYearDetails]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FiscalYearDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FiscalYearId] [int] NOT NULL,
	[Year] [int] NOT NULL,
	[Remarks] [nvarchar](500) NULL,
	[MonthId] [int] NOT NULL,
	[MonthStart] [nvarchar](20) NOT NULL,
	[MonthEnd] [nvarchar](20) NOT NULL,
	[MonthName] [varchar](50) NOT NULL,
	[MonthLock] [bit] NOT NULL,
	[CreatedBy] [varchar](120) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
 CONSTRAINT [PK_FiscalYearDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FiscalYears]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FiscalYears](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Year] [int] NOT NULL,
	[YearStart] [datetime] NOT NULL,
	[YearEnd] [datetime] NOT NULL,
	[YearLock] [bit] NOT NULL,
	[Remarks] [nvarchar](500) NULL,
	[CreatedBy] [varchar](120) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
 CONSTRAINT [PK_FiscalYears] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Menu]    Script Date: 2025-04-27 5:33:22 PM ******/
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
/****** Object:  Table [dbo].[Products]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[IsArchive] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](120) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](50) NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleMenu]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleMenu](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NULL,
	[UserGroupId] [int] NULL,
	[MenuId] [int] NULL,
	[List] [bit] NULL,
	[Insert] [bit] NULL,
	[Delete] [bit] NULL,
	[Post] [bit] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](50) NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
 CONSTRAINT [PK_RoleMenu] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SaleOrderDetails]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SaleOrderDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SaleOrderId] [int] NOT NULL,
	[BranchId] [int] NOT NULL,
	[Line] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [decimal](25, 9) NOT NULL,
	[UnitRate] [decimal](25, 9) NOT NULL,
	[SubTotal] [decimal](25, 9) NOT NULL,
	[VATRate] [decimal](25, 9) NOT NULL,
	[VATAmount] [decimal](25, 9) NOT NULL,
	[LineTotal] [decimal](25, 9) NOT NULL,
	[Comments] [varchar](2000) NOT NULL,
 CONSTRAINT [PK_SaleOrderDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SaleOrders]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SaleOrders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NOT NULL,
	[BranchId] [int] NOT NULL,
	[CustomerId] [int] NOT NULL,
	[DeliveryAddress] [nvarchar](max) NULL,
	[InvoiceDateTime] [datetime] NULL,
	[GrandTotalAmount] [decimal](25, 9) NOT NULL,
	[GrandTotalVATAmount] [decimal](25, 9) NOT NULL,
	[Comments] [nvarchar](max) NULL,
	[TransactionType] [varchar](50) NULL,
	[IsPost] [bit] NULL,
	[CreatedBy] [varchar](120) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedFrom] [nvarchar](64) NULL,
	[LastModifiedBy] [varchar](120) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](64) NULL,
	[PostedBy] [nvarchar](64) NULL,
	[PostedOn] [datetime] NULL,
	[PostedFrom] [nvarchar](64) NULL,
 CONSTRAINT [PK_SaleOrders] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Settings]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Settings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SettingGroup] [nvarchar](120) NULL,
	[SettingName] [nvarchar](120) NULL,
	[SettingValue] [nvarchar](500) NULL,
	[SettingType] [nvarchar](120) NULL,
	[Remarks] [nvarchar](500) NULL,
	[IsActive] [bit] NOT NULL,
	[IsArchive] [bit] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedFrom] [nvarchar](50) NOT NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
 CONSTRAINT [PK__Settings__3214EC078E014A33] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserBranchMap]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserBranchMap](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NULL,
	[BranchId] [int] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](50) NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
 CONSTRAINT [PK_UserBranchMap] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserMenu]    Script Date: 2025-04-27 5:33:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserMenu](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](256) NULL,
	[RoleId] [int] NULL,
	[MenuId] [int] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedFrom] [nvarchar](50) NULL,
	[LastModifiedBy] [nvarchar](50) NULL,
	[LastModifiedOn] [datetime] NULL,
	[LastUpdateFrom] [nvarchar](50) NULL,
	[List] [bit] NULL,
	[Insert] [bit] NULL,
	[Delete] [bit] NULL,
	[Post] [bit] NULL,
 CONSTRAINT [PK_UserMenu] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[BranchProfiles] ON 
GO
INSERT [dbo].[BranchProfiles] ([Id], [Code], [Name], [BanglaName], [TelephoneNo], [Email], [VATRegistrationNo], [BIN], [TINNO], [Address], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (0, N'N/A', N'N/A', NULL, N'-', N'-', N'-', N'-', N'-', NULL, N'-', 1, 0, N'r', CAST(N'2024-01-01T00:00:00.000' AS DateTime), N'erp', CAST(N'2025-01-12T15:52:52.440' AS DateTime), NULL, N'192.168.15.48')
GO
INSERT [dbo].[BranchProfiles] ([Id], [Code], [Name], [BanglaName], [TelephoneNo], [Email], [VATRegistrationNo], [BIN], [TINNO], [Address], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (1, N'BP-00001', N'Branch 01', N'শাখা 01', N'-', N'mahabub.hossan@symphonysoftt.com', N'2342', N'32423', N'423423', N'Kolabagan, Dhanmondi , Dhaka 1205', N'sdfsd', 0, 1, N'ERP', CAST(N'2025-01-09T14:47:04.960' AS DateTime), N'ERP', CAST(N'2025-01-09T14:47:23.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[BranchProfiles] ([Id], [Code], [Name], [BanglaName], [TelephoneNo], [Email], [VATRegistrationNo], [BIN], [TINNO], [Address], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (2, N'BP-00002', N'Branch 02', N'শাখা 02', N'-', N'mahabub.hossan@symphonysoftt.com', N'1231', N'2131', N'123', N'Kolabagan, Dhanmondi , Dhaka 1205', N'123', 0, 1, N'ERP', CAST(N'2025-01-09T15:59:32.247' AS DateTime), NULL, CAST(N'2025-01-09T15:59:32.257' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[BranchProfiles] ([Id], [Code], [Name], [BanglaName], [TelephoneNo], [Email], [VATRegistrationNo], [BIN], [TINNO], [Address], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (18, N'BP-00003', N'Branch 03', NULL, N'01710101010', N'frfinaosongo@gmail.com', N'000000000', N'000000000', N'000000000', NULL, N'Comments', 0, 1, N'ERP', CAST(N'2025-04-24T11:38:06.157' AS DateTime), N'ERP', CAST(N'2025-04-27T11:22:22.000' AS DateTime), NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[BranchProfiles] OFF
GO
SET IDENTITY_INSERT [dbo].[CodeGenerations] ON 
GO
INSERT [dbo].[CodeGenerations] ([Id], [CurrentYear], [BranchId], [Prefix], [LastId]) VALUES (2, N'2025', 0, N'P', 38)
GO
INSERT [dbo].[CodeGenerations] ([Id], [CurrentYear], [BranchId], [Prefix], [LastId]) VALUES (5, N'2025', 0, N'BP', 3)
GO
INSERT [dbo].[CodeGenerations] ([Id], [CurrentYear], [BranchId], [Prefix], [LastId]) VALUES (1058, N'2025', 0, N'CUS', 5)
GO
INSERT [dbo].[CodeGenerations] ([Id], [CurrentYear], [BranchId], [Prefix], [LastId]) VALUES (2009, N'2025', 0, N'COM', 1)
GO
INSERT [dbo].[CodeGenerations] ([Id], [CurrentYear], [BranchId], [Prefix], [LastId]) VALUES (3011, N'2025', 1, N'SOI', 4)
GO
SET IDENTITY_INSERT [dbo].[CodeGenerations] OFF
GO
SET IDENTITY_INSERT [dbo].[Codes] ON 
GO
INSERT [dbo].[Codes] ([CodeId], [CodeGroup], [CodeName], [prefix], [Lenth], [ActiveStatus], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [LastId], [CreatedFrom], [LastUpdateFrom]) VALUES (1002, N'Product', N'Product', N'P', N'5', N'1', N'ERP', CAST(N'2024-01-01T03:54:00.000' AS DateTime), N'ERP', CAST(N'2024-01-01T03:54:00.000' AS DateTime), 0, NULL, NULL)
GO
INSERT [dbo].[Codes] ([CodeId], [CodeGroup], [CodeName], [prefix], [Lenth], [ActiveStatus], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [LastId], [CreatedFrom], [LastUpdateFrom]) VALUES (1004, N'BranchProfile', N'BranchProfile', N'BP', N'5', N'1', N'ERP', CAST(N'2025-01-01T00:00:00.000' AS DateTime), N'ERP', NULL, 0, NULL, NULL)
GO
INSERT [dbo].[Codes] ([CodeId], [CodeGroup], [CodeName], [prefix], [Lenth], [ActiveStatus], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [LastId], [CreatedFrom], [LastUpdateFrom]) VALUES (1010, N'SaleOrder', N'SaleOrder', N'SOI', N'5', N'1', N'ERP', NULL, NULL, NULL, 0, NULL, NULL)
GO
INSERT [dbo].[Codes] ([CodeId], [CodeGroup], [CodeName], [prefix], [Lenth], [ActiveStatus], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [LastId], [CreatedFrom], [LastUpdateFrom]) VALUES (1029, N'Customer', N'Customer', N'CUS', N'5', N'1', N'ERP', NULL, NULL, NULL, 0, NULL, NULL)
GO
INSERT [dbo].[Codes] ([CodeId], [CodeGroup], [CodeName], [prefix], [Lenth], [ActiveStatus], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [LastId], [CreatedFrom], [LastUpdateFrom]) VALUES (2008, N'CompanyProfile', N'CompanyProfile', N'COM', N'5', N'1', N'ERP', NULL, NULL, NULL, 0, NULL, NULL)
GO
INSERT [dbo].[Codes] ([CodeId], [CodeGroup], [CodeName], [prefix], [Lenth], [ActiveStatus], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [LastId], [CreatedFrom], [LastUpdateFrom]) VALUES (2015, N'ProductGroup', N'ProductGroup', N'PG', N'5', N'1', N'ERP', CAST(N'2025-04-27T11:12:39.823' AS DateTime), N'ERP', CAST(N'2025-04-27T11:12:39.823' AS DateTime), 0, N'192.168.15.71', N'192.168.15.71')
GO
SET IDENTITY_INSERT [dbo].[Codes] OFF
GO
SET IDENTITY_INSERT [dbo].[CompanyProfiles] ON 
GO
INSERT [dbo].[CompanyProfiles] ([Id], [Code], [CompanyName], [CompanyBanglaName], [CompanyLegalName], [Address1], [Address2], [Address3], [City], [ZipCode], [TelephoneNo], [FaxNo], [Email], [ContactPerson], [ContactPersonDesignation], [ContactPersonTelephone], [ContactPersonEmail], [TINNo], [VatRegistrationNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [FYearStart], [FYearEnd], [BusinessNature], [AccountingNature], [CompanyTypeId], [Section], [BIN], [IsVDSWithHolder], [AppVersion], [License]) VALUES (1, N'COM-00001', N'Symphony Softtech Ltd.', N'সিম্ফনি সফটটেক লিমিটেড', N'Symphony Softtech Ltd.', N'Test', N'Test', N'Test', N'Test', N'Test', N'000000000000', N'000000000000', N'frfinaosongo@gmail.com', N'Test', N'Test', NULL, N'Test', N'0000000000000000', N'0000000000000000', N'Comments', 0, 1, N'ERP', CAST(N'2025-01-18T17:29:21.510' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-04-27T11:15:40.420' AS DateTime), N'192.168.15.71', CAST(N'2023-07-01T00:00:00.000' AS DateTime), CAST(N'2025-12-31T00:00:00.000' AS DateTime), N'Distributor', N'Test', 2017, N'Test', N'0000000000000000', 0, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[CompanyProfiles] OFF
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 
GO
INSERT [dbo].[Customers] ([Id], [Code], [Name], [BranchId], [Address], [City], [Email], [TINNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (0, N'ALL', N'ALL', 1, N'-f', N'-f', N'abc@abc.com', N'-', N'-', 1, 1, N'-', CAST(N'2024-12-01T00:00:00.000' AS DateTime), N'erp', CAST(N'2025-01-15T16:07:22.107' AS DateTime), NULL, N'192.168.15.54', NULL)
GO
INSERT [dbo].[Customers] ([Id], [Code], [Name], [BranchId], [Address], [City], [Email], [TINNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2009, N'CUS-00001', N'Riyaz', 1, N'Badda', N'Dhaka', N'mahabub.hossan@symphonysoftt.com', N'10120012', N'client', 0, 1, N'erp', CAST(N'2025-01-23T10:28:47.820' AS DateTime), N'erp', CAST(N'2025-02-26T12:29:00.083' AS DateTime), NULL, N'192.168.15.37', NULL)
GO
INSERT [dbo].[Customers] ([Id], [Code], [Name], [BranchId], [Address], [City], [Email], [TINNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2010, N'CUS-00002', N'Nahid Store', 2, N'Nahid Store', N'Dhaka', N'mahabub.hossan@symphonysoftt.com', N'01522122', N'Client', 0, 1, N'erp', CAST(N'2025-01-23T10:29:53.880' AS DateTime), NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [Code], [Name], [BranchId], [Address], [City], [Email], [TINNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2011, N'CUS-00003', N'Hasan Brothers', 2, N'dhaka', N'dhaka', N'Symphony@2025', N'435689', NULL, 0, 1, N'erp', CAST(N'2025-01-23T15:25:02.307' AS DateTime), NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [Code], [Name], [BranchId], [Address], [City], [Email], [TINNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2012, N'CUS-00004', N'Customer 04', 2, N'kolabagan', N'Dhaka', N'mahabub.hossan@symphonysoftt.com', N'65656', N' আলামিন', 0, 1, N'erp', CAST(N'2025-01-26T11:22:41.357' AS DateTime), NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Customers] ([Id], [Code], [Name], [BranchId], [Address], [City], [Email], [TINNo], [Comments], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2038, N'CUS-00005', N'Customer 05', 1, N'ssc', N'-', N'atiqur.rahman@symphonysoftt.com', N'15959', N'wdf4', 0, 1, N'erp', CAST(N'2025-02-10T14:41:58.190' AS DateTime), N'erp', CAST(N'2025-02-26T12:55:46.493' AS DateTime), NULL, N'192.168.15.37', N'/Content/Customers/9557ab0a-54fc-4406-b282-9dd4204436bf.png')
GO
SET IDENTITY_INSERT [dbo].[Customers] OFF
GO
SET IDENTITY_INSERT [dbo].[EnumTypes] ON 
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (1, N'Distributor', N'Branch', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (2, N'Dealer', N'Branch', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (3, N'Retailer', N'Branch', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (4, N'Trader', N'Branch', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (5, N'Country', N'Location', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (6, N'Division', N'Location', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (7, N'District', N'Location', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (8, N'Thana', N'Location', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (9, N'ZonalManager', N'SalesPerson', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (10, N'AreaManager', N'SalesPerson', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (11, N'TreatorryManager', N'SalesPerson', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (12, N'Sales Representative', N'SalesPerson', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (14, N'DeliveryPerson', N'DeliveryPerson', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (15, N'DeliveryDriver', N'DriverPerson', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (16, N'Delivery ', N'CustomerAdvanceReceiptBy', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (17, N'DeliveryPerson', N'CustomerAdvanceReceiptBy', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (18, N'SalePerson', N'CustomerAdvanceReceiptBy', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (19, N'Cash', N'PaymentType', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (20, N'Cheque', N'PaymentType', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (21, N'TT', N'PaymentType', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (22, N'Bkash', N'PaymentType', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (23, N'DD', N'PaymentType', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (24, N'CampaignByInvoiceValue', N'Campaign', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (25, N'CampaignByProductQuantity', N'Campaign', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (26, N'CampaignByProductValue', N'Campaign', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[EnumTypes] ([Id], [Name], [EnumType], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (27, N'CampaignByProductTotalValue', N'Campaign', NULL, NULL, NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[EnumTypes] OFF
GO
SET IDENTITY_INSERT [dbo].[FiscalYears] ON 
GO
INSERT [dbo].[FiscalYears] ([Id], [Year], [YearStart], [YearEnd], [YearLock], [Remarks], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom]) VALUES (1050, 2025, CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2025-12-31T00:00:00.000' AS DateTime), 0, NULL, N'erp', CAST(N'2025-03-12T10:37:21.120' AS DateTime), NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[FiscalYears] OFF
GO
SET IDENTITY_INSERT [dbo].[Menu] ON 
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (1, N'/Common/Home?branchChange=False', N'Dashboard', N'Common', N'Home', 0, 0, 0, 1, N'ERP', CAST(N'2025-02-04T14:15:02.520' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.520' AS DateTime), N'::1', N'nav-icon fas fa-tachometer-alt', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (2, N'/Login/LogOff', N'User Logout', NULL, N'Login', 0, 0, 0, 9999, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-sign-out-alt', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (3, NULL, N'Menu Authorization', N'MenuAuthorization', NULL, 0, 0, 0, 8000, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-cog', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (4, N'/SetUp/MenuAuthorization/Role', N'Role', N'MenuAuthorization', N'MenuAuthorization', 3, 3, 0, 8001, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-circle', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (6, N'/SetUp/MenuAuthorization/RoleMenu', N'Role Menu Assign', N'MenuAuthorization', N'MenuAuthorization', 3, 3, 0, 8003, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-user-shield', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (7, N'/SetUp/MenuAuthorization/UserMenu', N'User Menu Assign', N'MenuAuthorization', N'MenuAuthorization', 3, 3, 0, 8004, N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'ERP', CAST(N'2024-11-18T10:00:45.403' AS DateTime), N'::1', N'nav-icon fas fa-address-book', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (13, NULL, N'Sale', N'DMS', NULL, 61, 61, 0, 10, N'ERP', CAST(N'2025-02-04T14:15:02.537' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.537' AS DateTime), N'::1', N'nav-icon fas fa-cart-plus', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (14, N'/DMS/SaleOrder/Index', N'Sale Order Entry', N'DMS', N'SaleOrder', 13, 13, 0, 11, N'ERP', CAST(N'2025-02-04T14:15:02.540' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.540' AS DateTime), N'::1', N'nav-icon fas fa-clipboard-list', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (30, NULL, N'Set Up', N'SetUp', NULL, 0, 0, 0, 50, N'ERP', CAST(N'2025-02-04T14:15:02.557' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.557' AS DateTime), N'::1', N'nav-icon fas fa-cog', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (31, NULL, N'Branch', N'SetUp', NULL, 30, 30, 0, 51, N'ERP', CAST(N'2025-02-04T14:15:02.557' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.557' AS DateTime), N'::1', N'nav-icon fas fa-code-branch', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (32, N'/DMS/BranchProfile/Index', N'Branch Profile Entry', N'SetUp', N'BranchProfile', 31, 31, 0, 52, N'ERP', CAST(N'2025-02-04T14:15:02.557' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.557' AS DateTime), N'::1', N'nav-icon fas fa-sitemap', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (34, NULL, N'Fiscal Year', N'SetUp', NULL, 30, 30, 0, 54, N'ERP', CAST(N'2025-02-04T14:15:02.560' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.560' AS DateTime), N'::1', N'nav-icon fas fa-calendar-alt', 0)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (35, N'/DMS/FiscalYear/Index', N'Fiscal Year Entry', N'SetUp', N'FiscalYear', 34, 34, 0, 55, N'ERP', CAST(N'2025-02-04T14:15:02.560' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.560' AS DateTime), N'::1', N'nav-icon fas fa-calendar-alt', 0)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (43, NULL, N'Product', N'SetUp', NULL, 30, 30, 0, 62, N'ERP', CAST(N'2025-02-04T14:15:02.570' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.570' AS DateTime), N'::1', N'nav-icon fas fa-box', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (45, N'/DMS/Product/Index', N'Product Entry', N'SetUp', N'Product', 43, 43, 0, 65, N'ERP', CAST(N'2025-02-04T14:15:02.570' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.570' AS DateTime), N'::1', N'nav-icon fas fa-box', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (46, N'/SetUp/CompanyProfile/Index', N'Company Profile Entry', N'SetUp', N'CompanyProfile', 30, 0, 30, 66, N'ERP', CAST(N'2025-02-04T14:15:02.570' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.570' AS DateTime), N'::1', N'nav-icon fas fa-building', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (56, N'/SetUp/UserProfile/Index', N'User Profile', N'SetUp', N'UserProfile', 30, 0, 30, 75, N'ERP', CAST(N'2025-02-04T14:15:02.583' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.583' AS DateTime), N'::1', N'nav-icon fas fa-user-circle', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (57, N'/SetUp/Settings/Index', N'Settings', N'SetUp', N'Settings', 30, 0, 30, 76, N'ERP', CAST(N'2025-02-04T14:15:02.583' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.583' AS DateTime), N'::1', N'nav-icon fas fa-cog', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (58, N'/SetUp/Settings/DbUpdate', N'DbUpdate', N'SetUp', N'Settings', 30, 0, 30, 77, N'ERP', CAST(N'2025-02-04T14:15:02.583' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.583' AS DateTime), N'::1', N'nav-icon fas fa-sync', 1)
GO
INSERT [dbo].[Menu] ([Id], [Url], [Name], [Module], [Controller], [ParentId], [SubParentId], [SubChildId], [DisplayOrder], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [IconClass], [IsActive]) VALUES (61, NULL, N'Transaction', N'Transaction', NULL, 0, 0, 0, 2, N'ERP', CAST(N'2025-02-04T14:15:02.530' AS DateTime), N'::1', N'ERP', CAST(N'2025-02-04T14:15:02.530' AS DateTime), N'::1', N'nav-icon fas fa-warehouse', 1)
GO
SET IDENTITY_INSERT [dbo].[Menu] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (0, N'N/A', N'N/A', N'N/A', 1, 0, N'ERP', CAST(N'2025-01-29T12:28:49.250' AS DateTime), N'ERP', CAST(N'2025-01-29T12:28:51.283' AS DateTime), N'192.168.15.60', N'192.168.15.60', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2, N'P-00001', N'Phone', N'Description', 1, 0, N'r', CAST(N'2024-06-01T00:00:00.000' AS DateTime), N'admin', CAST(N'2025-04-21T10:27:03.977' AS DateTime), NULL, N'localhost', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1002, N'P-00004', N'Desktop', N'Product Entry', 0, 1, N'ERP', CAST(N'2025-01-08T11:29:01.923' AS DateTime), N'ERP', CAST(N'2025-01-13T15:52:57.460' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1003, N'P-00005', N'Light', N'Description', 0, 1, N'ERP', CAST(N'2025-01-11T12:49:51.430' AS DateTime), N'ERP', CAST(N'2025-01-13T15:52:46.487' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1004, N'P-00006', N'Nutella (Spread)', N'Description', 0, 1, N'ERP', CAST(N'2025-01-12T10:30:05.687' AS DateTime), N'ERP', CAST(N'2025-01-13T15:52:32.097' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1005, N'P-00007', N'Zara Dresses (Clothing)', N'Description', 0, 1, N'ERP', CAST(N'2025-01-12T11:06:00.057' AS DateTime), N'erp', CAST(N'2025-02-01T16:08:55.543' AS DateTime), NULL, N'192.168.15.8', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1006, N'P-00008', N'Coca-Cola (Soda)', N'1', 0, 1, N'erp', CAST(N'2025-01-12T12:35:31.030' AS DateTime), N'erp', CAST(N'2025-01-12T12:35:39.910' AS DateTime), NULL, N'192.168.15.48', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1007, N'P-00009', N'Laptop', N'Description', 0, 1, N'ERP', CAST(N'2025-01-13T10:50:38.263' AS DateTime), N'ERP', CAST(N'2025-01-13T15:52:22.680' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1008, N'P-00010', N'Atta', N'Description Atta', 1, 0, N'ERP', CAST(N'2025-01-13T11:08:09.200' AS DateTime), N'erp', CAST(N'2025-03-06T14:31:00.213' AS DateTime), NULL, N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (1010, N'P-00012', N'PowerBar (Energy Bar)', N'Test Product Group', 0, 1, N'ERP', CAST(N'2025-01-15T18:37:20.720' AS DateTime), N'ERP', CAST(N'2025-04-24T12:51:18.920' AS DateTime), N'192.168.15.60', N'192.168.15.71', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2006, N'P-00013', N'Pen       ', N'Pen', 0, 1, N'erp', CAST(N'2025-01-23T16:10:50.230' AS DateTime), N'ERP', CAST(N'2025-01-26T12:49:26.763' AS DateTime), N'192.168.15.46', N'192.168.15.60', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2007, N'P-00014', N'Cake', N'Cake Cake', 0, 1, N'ERP', CAST(N'2025-01-26T17:17:03.420' AS DateTime), N'ERP', CAST(N'2025-02-01T18:34:19.220' AS DateTime), N'192.168.15.60', N'192.168.15.60', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2008, N'P-00015', N'Table', N'Cake Cake', 0, 1, N'ERP', CAST(N'2025-01-26T17:17:03.420' AS DateTime), N'ERP', CAST(N'2025-02-01T18:34:19.220' AS DateTime), N'192.168.15.60', N'192.168.15.60', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2009, N'P-00016', N'test  1', N'-', 1, 0, N'erp', CAST(N'2025-02-10T18:25:01.813' AS DateTime), N'erp', CAST(N'2025-02-26T16:20:05.293' AS DateTime), N'192.168.15.84', N'192.168.15.37', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2010, N'P-00017', N'Test 3', N'-', 1, 0, N'erp', CAST(N'2025-02-11T10:11:02.507' AS DateTime), N'erp', CAST(N'2025-02-26T16:20:05.293' AS DateTime), N'192.168.15.84', N'192.168.15.37', N'/Content/Customers/3034a4b0-a56b-46c6-ad8a-3da4b7b39bf4.png')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2011, N'P-00018', N'sdfx', N'-', 1, 0, N'erp', CAST(N'2025-02-11T10:36:13.980' AS DateTime), N'erp', CAST(N'2025-03-06T12:09:45.267' AS DateTime), N'192.168.15.84', N'192.168.15.53', N'/Content/Customers/ed97c65b-7102-41a0-aca9-2b8c0b4c2ce5.png')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2012, N'P-00019', N'dfgrsdgsdf', N'-', 1, 0, N'erp', CAST(N'2025-02-11T11:04:03.290' AS DateTime), N'erp', CAST(N'2025-03-04T16:16:39.937' AS DateTime), N'192.168.15.84', N'192.168.15.53', N'/Content/Products/8c58c564-6e88-427a-9c0e-f7bef13be26a.jpg')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2013, N'P-00020', N'testtttt', N'hthhtyyr', 1, 0, N'erp', CAST(N'2025-02-11T11:33:56.103' AS DateTime), N'erp', CAST(N'2025-03-03T11:11:07.903' AS DateTime), N'192.168.15.84', N'192.168.15.37', N'/Content/Products/75fe4bf8-8dd8-4f24-8048-1f3a875f49bc.jpg')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2014, N'P-00021', N'etrtfygt', N'hhhh', 1, 0, N'erp', CAST(N'2025-02-26T16:09:13.760' AS DateTime), N'erp', CAST(N'2025-02-26T16:11:40.883' AS DateTime), N'192.168.15.37', N'192.168.15.37', N'/Content/Products/be5b8260-bd4b-4728-80a8-f471c17b4a73.jpg')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2015, N'P-00022', N'drfg', NULL, 1, 0, N'erp', CAST(N'2025-02-27T11:21:07.257' AS DateTime), N'erp', CAST(N'2025-03-04T14:10:42.353' AS DateTime), N'192.168.15.37', N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2016, N'P-00023', N'Choi', NULL, 1, 0, N'erp', CAST(N'2025-03-04T13:55:05.013' AS DateTime), N'erp', CAST(N'2025-03-04T14:17:25.370' AS DateTime), N'192.168.15.53', N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2017, N'P-00024', N'Riyaj', NULL, 1, 0, N'erp', CAST(N'2025-03-04T14:08:09.790' AS DateTime), N'erp', CAST(N'2025-03-04T14:37:12.090' AS DateTime), N'192.168.15.53', N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2018, N'P-00025', N'Poco x3', N'Nai', 1, 0, N'erp', CAST(N'2025-03-05T16:04:00.227' AS DateTime), N'erp', CAST(N'2025-03-06T12:10:00.447' AS DateTime), N'192.168.15.251', N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2019, N'P-00026', N'Arave', N'ddddddddddddddd', 1, 0, N'erp', CAST(N'2025-03-06T12:07:12.343' AS DateTime), N'erp', CAST(N'2025-03-06T12:09:53.103' AS DateTime), N'192.168.15.53', N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2020, N'P-00027', N'Electric Cooker', N'Test two', 0, 1, N'erp', CAST(N'2025-03-11T11:13:05.380' AS DateTime), N'erp', CAST(N'2025-03-11T11:14:26.237' AS DateTime), N'192.168.15.251', N'192.168.15.251', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2021, N'P-00028', N'frghht', N'Test', 0, 1, N'erp', CAST(N'2025-03-11T14:47:36.580' AS DateTime), N'erp', CAST(N'2025-03-11T14:47:51.127' AS DateTime), N'192.168.15.53', N'192.168.15.53', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2022, N'P-00029', N'jiji', N'sdfsdf', 1, 0, N'erp', CAST(N'2025-03-15T16:25:39.047' AS DateTime), N'erp', CAST(N'2025-03-16T11:51:58.217' AS DateTime), N'192.168.15.37', N'192.168.15.48', N'/Content/Products/c3c9cd03-1533-4fd8-b4bb-0fa478ff13cc.png')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2023, N'P-00030', N'Abir', N'fettuhkw', 1, 0, N'erp', CAST(N'2025-03-16T11:53:38.783' AS DateTime), N'ERP', CAST(N'2025-04-24T12:51:39.393' AS DateTime), N'192.168.15.48', N'192.168.15.71', NULL)
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2024, N'P-00031', N'Optical Mouse OP-720', N'That''s From A4Tech', 0, 1, N'erp', CAST(N'2025-03-18T10:02:35.583' AS DateTime), N'erp', CAST(N'2025-03-18T14:12:28.993' AS DateTime), N'192.168.15.18', N'192.168.15.18', N'/Content/Products/9b82669a-597a-4296-8a5e-c284edcd4797.png')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2025, N'P-00032', N'test Data 5', N'Des 3', 0, 1, N'erp', CAST(N'2025-03-19T11:43:16.217' AS DateTime), N'ERP', CAST(N'2025-04-24T12:55:16.247' AS DateTime), N'172.21.0.1', N'192.168.15.71', N'/Content/Products/d5aa3f09-7cae-4848-b875-b148c432a7cd.png')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2026, N'P-00033', N'string', N'string', 1, 1, N'string', CAST(N'2025-04-16T09:22:06.690' AS DateTime), NULL, NULL, N'string', NULL, N'string')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2027, N'P-00034', N'Bela', N'string', 1, 1, N'string', CAST(N'2025-04-16T15:41:46.747' AS DateTime), NULL, NULL, N'string', NULL, N'string')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2028, N'P-00035', N'Rose', N'string', 1, 1, N'string', CAST(N'2025-04-17T09:39:47.800' AS DateTime), NULL, NULL, N'string', NULL, N'string')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2029, N'P-00036', N'Pencil', N'asdf', 0, 1, N'erp', CAST(N'2025-04-17T11:13:56.730' AS DateTime), N'ERP', CAST(N'2025-04-27T11:20:46.143' AS DateTime), N'192.168.15.24', N'192.168.15.71', N'/Content/Products/9f9a6d42-c6e7-4f09-9c34-45f1cbc68d55.jpg')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2030, N'string', N'Biscuit', N'string', 1, 1, N'string', CAST(N'2025-04-17T12:20:14.147' AS DateTime), N'string', CAST(N'2025-04-17T12:21:32.423' AS DateTime), N'string', N'string', N'string')
GO
INSERT [dbo].[Products] ([Id], [Code], [Name], [Description], [IsArchive], [IsActive], [CreatedBy], [CreatedOn], [LastModifiedBy], [LastModifiedOn], [CreatedFrom], [LastUpdateFrom], [ImagePath]) VALUES (2031, N'P-00038', N'Bangladesh', N'Description of Ros-Malai', 0, 1, N'ERP', CAST(N'2025-04-27T11:21:36.397' AS DateTime), N'ERP', CAST(N'2025-04-27T11:22:05.767' AS DateTime), N'192.168.15.71', N'192.168.15.71', N'/Content/Products/b28aa298-cf10-4b38-ad88-b097fd1970cf.png')
GO
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Role] ON 
GO
INSERT [dbo].[Role] ([Id], [Name], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (1, N'Admin', N'ERP', CAST(N'2025-01-07T10:31:12.420' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-04-24T15:16:01.970' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[Role] ([Id], [Name], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (2, N'User', N'ERP', CAST(N'2025-01-07T10:38:02.337' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-04-27T11:11:55.663' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[Role] ([Id], [Name], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (1001, N'General', N'ERP', CAST(N'2025-01-19T11:32:49.407' AS DateTime), N'::1', N'ERP', CAST(N'2025-04-24T12:06:39.310' AS DateTime), N'192.168.15.71')
GO
SET IDENTITY_INSERT [dbo].[Role] OFF
GO
SET IDENTITY_INSERT [dbo].[RoleMenu] ON 
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (1, 1, 0, 1, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.453' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.453' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (2, 1, 0, 61, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.587' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.587' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (3, 1, 0, 13, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.633' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.633' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (4, 1, 0, 14, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.677' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.677' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (5, 1, 0, 30, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.723' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.723' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (6, 1, 0, 31, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.763' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.763' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (7, 1, 0, 32, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.793' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.793' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (8, 1, 0, 43, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.833' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.833' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (9, 1, 0, 44, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.880' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.880' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (10, 1, 0, 45, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.920' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.920' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (11, 1, 0, 46, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.960' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.960' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (12, 1, 0, 56, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:58.997' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:58.997' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (13, 1, 0, 57, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.037' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.037' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (14, 1, 0, 58, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.077' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.077' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (15, 1, 0, 3, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.117' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.117' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (16, 1, 0, 4, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.157' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.157' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (17, 1, 0, 6, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.193' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.193' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (18, 1, 0, 7, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.260' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.260' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (19, 1, 0, 2, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:33:59.300' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:33:59.300' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (20, 2, 0, 1, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.320' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.320' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (21, 2, 0, 61, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.320' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.320' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (22, 2, 0, 13, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.320' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.320' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (23, 2, 0, 14, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (24, 2, 0, 30, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (25, 2, 0, 31, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (26, 2, 0, 32, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.323' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (27, 2, 0, 43, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (28, 2, 0, 44, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (29, 2, 0, 45, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (30, 2, 0, 46, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (31, 2, 0, 56, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (32, 2, 0, 2, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-24T12:34:14.327' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (46, 1001, 0, 1, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.470' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.470' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (47, 1001, 0, 61, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.473' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.473' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (48, 1001, 0, 13, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.473' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.473' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (49, 1001, 0, 14, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (50, 1001, 0, 30, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (51, 1001, 0, 31, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (52, 1001, 0, 32, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.477' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (53, 1001, 0, 43, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (54, 1001, 0, 44, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (55, 1001, 0, 45, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (56, 1001, 0, 46, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (57, 1001, 0, 56, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[RoleMenu] ([Id], [RoleId], [UserGroupId], [MenuId], [List], [Insert], [Delete], [Post], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (58, 1001, 0, 2, NULL, NULL, NULL, NULL, N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:04.480' AS DateTime), N'192.168.15.71')
GO
SET IDENTITY_INSERT [dbo].[RoleMenu] OFF
GO
SET IDENTITY_INSERT [dbo].[SaleOrderDetails] ON 
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (3, 2, 1, 1, 1002, CAST(60.000000000 AS Decimal(25, 9)), CAST(150.000000000 AS Decimal(25, 9)), CAST(9000.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(9000.000000000 AS Decimal(25, 9)), N'fff')
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (9, 5, 1, 1, 1002, CAST(15.000000000 AS Decimal(25, 9)), CAST(100.000000000 AS Decimal(25, 9)), CAST(1500.000000000 AS Decimal(25, 9)), CAST(6.000000000 AS Decimal(25, 9)), CAST(90.000000000 AS Decimal(25, 9)), CAST(1590.000000000 AS Decimal(25, 9)), N'fghfg')
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (10, 5, 1, 2, 2008, CAST(477.000000000 AS Decimal(25, 9)), CAST(450.000000000 AS Decimal(25, 9)), CAST(214650.000000000 AS Decimal(25, 9)), CAST(7.000000000 AS Decimal(25, 9)), CAST(15025.500000000 AS Decimal(25, 9)), CAST(229675.500000000 AS Decimal(25, 9)), N'fff')
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (12, 6, 1, 1, 1010, CAST(77.000000000 AS Decimal(25, 9)), CAST(444.000000000 AS Decimal(25, 9)), CAST(34188.000000000 AS Decimal(25, 9)), CAST(9.000000000 AS Decimal(25, 9)), CAST(3076.920000000 AS Decimal(25, 9)), CAST(37264.920000000 AS Decimal(25, 9)), N'f')
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (13, 7, 1, 1, 1004, CAST(55.000000000 AS Decimal(25, 9)), CAST(100.000000000 AS Decimal(25, 9)), CAST(5500.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(5500.000000000 AS Decimal(25, 9)), N'-')
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (14, 7, 1, 2, 1010, CAST(88.000000000 AS Decimal(25, 9)), CAST(7777.000000000 AS Decimal(25, 9)), CAST(684376.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(684376.000000000 AS Decimal(25, 9)), N'-')
GO
INSERT [dbo].[SaleOrderDetails] ([Id], [SaleOrderId], [BranchId], [Line], [ProductId], [Quantity], [UnitRate], [SubTotal], [VATRate], [VATAmount], [LineTotal], [Comments]) VALUES (15, 7, 1, 3, 2008, CAST(7.000000000 AS Decimal(25, 9)), CAST(9999.000000000 AS Decimal(25, 9)), CAST(69993.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), CAST(69993.000000000 AS Decimal(25, 9)), N'-')
GO
SET IDENTITY_INSERT [dbo].[SaleOrderDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[SaleOrders] ON 
GO
INSERT [dbo].[SaleOrders] ([Id], [Code], [BranchId], [CustomerId], [DeliveryAddress], [InvoiceDateTime], [GrandTotalAmount], [GrandTotalVATAmount], [Comments], [TransactionType], [IsPost], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [PostedBy], [PostedOn], [PostedFrom]) VALUES (2, N'SOI-BP-00001/00001/0425', 1, 2011, N'trtr', CAST(N'2025-04-24T00:00:00.000' AS DateTime), CAST(9000.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), N'nbnb', N'SaleOrder', 1, N'ERP', CAST(N'2025-04-24T15:13:17.943' AS DateTime), NULL, N'ERP', CAST(N'2025-04-24T15:17:03.017' AS DateTime), NULL, N'ERP', CAST(N'2025-04-27T16:51:07.933' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[SaleOrders] ([Id], [Code], [BranchId], [CustomerId], [DeliveryAddress], [InvoiceDateTime], [GrandTotalAmount], [GrandTotalVATAmount], [Comments], [TransactionType], [IsPost], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [PostedBy], [PostedOn], [PostedFrom]) VALUES (5, N'SOI-BP-00001/00002/0425', 1, 2011, N'dfg', CAST(N'2025-04-27T00:00:00.000' AS DateTime), CAST(216150.000000000 AS Decimal(25, 9)), CAST(15115.500000000 AS Decimal(25, 9)), N'dfg', N'SaleOrder', 0, N'ERP', CAST(N'2025-04-27T12:40:44.057' AS DateTime), NULL, N'ERP', CAST(N'2025-04-27T12:43:27.900' AS DateTime), NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[SaleOrders] ([Id], [Code], [BranchId], [CustomerId], [DeliveryAddress], [InvoiceDateTime], [GrandTotalAmount], [GrandTotalVATAmount], [Comments], [TransactionType], [IsPost], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [PostedBy], [PostedOn], [PostedFrom]) VALUES (6, N'SOI-BP-00001/00003/0425', 1, 2012, N'ff', CAST(N'2025-04-27T00:00:00.000' AS DateTime), CAST(34188.000000000 AS Decimal(25, 9)), CAST(3076.920000000 AS Decimal(25, 9)), N'dddd', N'SaleOrder', 0, N'ERP', CAST(N'2025-04-27T12:45:43.117' AS DateTime), NULL, N'ERP', CAST(N'2025-04-27T13:00:25.177' AS DateTime), NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[SaleOrders] ([Id], [Code], [BranchId], [CustomerId], [DeliveryAddress], [InvoiceDateTime], [GrandTotalAmount], [GrandTotalVATAmount], [Comments], [TransactionType], [IsPost], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [PostedBy], [PostedOn], [PostedFrom]) VALUES (7, N'SOI-BP-00001/00004/0425', 1, 2012, N'f', CAST(N'2025-04-27T00:00:00.000' AS DateTime), CAST(759869.000000000 AS Decimal(25, 9)), CAST(0.000000000 AS Decimal(25, 9)), N'ff', N'SaleOrder', 0, N'ERP', CAST(N'2025-04-27T13:01:03.870' AS DateTime), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[SaleOrders] OFF
GO
SET IDENTITY_INSERT [dbo].[Settings] ON 
GO
INSERT [dbo].[Settings] ([Id], [SettingGroup], [SettingName], [SettingValue], [SettingType], [Remarks], [IsActive], [IsArchive], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (1, N'DMSApiUrl', N'DMSApiUrl', N'http://dev-sage:8011/', N'String', N'-', 1, 0, N'ERP', CAST(N'2025-01-25T18:19:22.020' AS DateTime), N'::1', N'ERP', CAST(N'2025-04-27T14:36:43.427' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[Settings] ([Id], [SettingGroup], [SettingName], [SettingValue], [SettingType], [Remarks], [IsActive], [IsArchive], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (2, N'DMSReportUrl', N'DMSReportUrl', N'http://dev-sage:8013/', N'String', N'-', 1, 0, N'ERP', CAST(N'2025-01-26T11:30:41.860' AS DateTime), N'::1', N'ERP', CAST(N'2025-04-27T14:36:56.173' AS DateTime), N'192.168.15.71')
GO
INSERT [dbo].[Settings] ([Id], [SettingGroup], [SettingName], [SettingValue], [SettingType], [Remarks], [IsActive], [IsArchive], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (3, N'DecimalPlace', N'DecimalPlace', N'2', N'String', N'-', 1, 0, N'ERP', CAST(N'2025-02-05T14:06:46.767' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-02-05T15:51:49.797' AS DateTime), N'192.168.15.60')
GO
INSERT [dbo].[Settings] ([Id], [SettingGroup], [SettingName], [SettingValue], [SettingType], [Remarks], [IsActive], [IsArchive], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (4, N'SaleDecimalPlace', N'SaleDecimalPlace', N'2', N'String', N'-', 1, 0, N'ERP', CAST(N'2025-02-05T14:06:46.773' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-02-05T15:51:53.260' AS DateTime), N'192.168.15.60')
GO
INSERT [dbo].[Settings] ([Id], [SettingGroup], [SettingName], [SettingValue], [SettingType], [Remarks], [IsActive], [IsArchive], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (6, N'PurchaseDecimalPlace', N'PurchaseDecimalPlace', N'-', N'String', N'-', 1, 0, N'ERP', CAST(N'2025-04-27T11:12:39.840' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:39.840' AS DateTime), N'192.168.15.71')
GO
SET IDENTITY_INSERT [dbo].[Settings] OFF
GO
SET IDENTITY_INSERT [dbo].[UserBranchMap] ON 
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (1, N'de2984f9-52f7-49a6-b4b0-3eb719ee0e35', 1, N'ERP', CAST(N'2025-01-25T11:53:29.250' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-01-25T11:53:36.683' AS DateTime), N'192.168.15.60')
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (2, N'de2984f9-52f7-49a6-b4b0-3eb719ee0e35', 2, N'ERP', CAST(N'2025-01-25T11:53:29.253' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-01-25T11:55:50.160' AS DateTime), N'192.168.15.60')
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (3, N'de2984f9-52f7-49a6-b4b0-3eb719ee0e35', 3, N'ERP', CAST(N'2025-01-25T11:53:29.260' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-01-26T16:03:13.493' AS DateTime), N'192.168.15.60')
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (4, N'bdafc2df-b84f-4366-add3-b40953b26a8c', 7, N'ERP', CAST(N'2025-01-26T15:52:13.080' AS DateTime), N'192.168.15.60', N'ERP', CAST(N'2025-01-26T16:03:22.523' AS DateTime), N'192.168.15.60')
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (5, N'bdafc2df-b84f-4366-add3-b40953b26a8c', 8, N'ERP', CAST(N'2025-01-26T15:52:13.090' AS DateTime), N'192.168.15.60', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (6, N'bdafc2df-b84f-4366-add3-b40953b26a8c', 9, N'ERP', CAST(N'2025-01-26T15:52:13.097' AS DateTime), N'192.168.15.60', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (7, N'20f0dc9f-8b9a-41ed-95b5-454b265ee52f', 1, N'ERP', CAST(N'2025-02-08T15:11:08.340' AS DateTime), N'192.168.15.60', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (8, N'20f0dc9f-8b9a-41ed-95b5-454b265ee52f', 2, N'ERP', CAST(N'2025-02-08T15:11:08.350' AS DateTime), N'192.168.15.60', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (9, N'20f0dc9f-8b9a-41ed-95b5-454b265ee52f', 3, N'ERP', CAST(N'2025-02-08T15:11:08.353' AS DateTime), N'192.168.15.60', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (10, N'20f0dc9f-8b9a-41ed-95b5-454b265ee52f', 10, N'ERP', CAST(N'2025-03-02T17:38:54.930' AS DateTime), N'192.168.15.37', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (11, N'f239c548-6b1a-437d-84bf-59a40e2ef783', 1, N'erp', CAST(N'2025-03-16T12:58:21.513' AS DateTime), N'192.168.15.37', NULL, NULL, NULL)
GO
INSERT [dbo].[UserBranchMap] ([Id], [UserId], [BranchId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom]) VALUES (12, N'f239c548-6b1a-437d-84bf-59a40e2ef783', 4, N'erp', CAST(N'2025-03-16T12:58:50.860' AS DateTime), N'192.168.15.37', NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[UserBranchMap] OFF
GO
SET IDENTITY_INSERT [dbo].[UserMenu] ON 
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (20, N'erp', 1, 1, N'ERP', CAST(N'2025-04-27T11:12:16.763' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.763' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (21, N'erp', 1, 61, N'ERP', CAST(N'2025-04-27T11:12:16.763' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.763' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (22, N'erp', 1, 13, N'ERP', CAST(N'2025-04-27T11:12:16.767' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.767' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (23, N'erp', 1, 14, N'ERP', CAST(N'2025-04-27T11:12:16.767' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.767' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (24, N'erp', 1, 30, N'ERP', CAST(N'2025-04-27T11:12:16.767' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.767' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (25, N'erp', 1, 31, N'ERP', CAST(N'2025-04-27T11:12:16.770' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.770' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (26, N'erp', 1, 32, N'ERP', CAST(N'2025-04-27T11:12:16.770' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.770' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (27, N'erp', 1, 43, N'ERP', CAST(N'2025-04-27T11:12:16.770' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.770' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (28, N'erp', 1, 44, N'ERP', CAST(N'2025-04-27T11:12:16.773' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.773' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (29, N'erp', 1, 45, N'ERP', CAST(N'2025-04-27T11:12:16.773' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.773' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (30, N'erp', 1, 46, N'ERP', CAST(N'2025-04-27T11:12:16.773' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.773' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (31, N'erp', 1, 56, N'ERP', CAST(N'2025-04-27T11:12:16.777' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.777' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (32, N'erp', 1, 57, N'ERP', CAST(N'2025-04-27T11:12:16.777' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.777' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (33, N'erp', 1, 58, N'ERP', CAST(N'2025-04-27T11:12:16.777' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.777' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (34, N'erp', 1, 3, N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (35, N'erp', 1, 4, N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (36, N'erp', 1, 6, N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (37, N'erp', 1, 7, N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[UserMenu] ([Id], [UserId], [RoleId], [MenuId], [CreatedBy], [CreatedOn], [CreatedFrom], [LastModifiedBy], [LastModifiedOn], [LastUpdateFrom], [List], [Insert], [Delete], [Post]) VALUES (38, N'erp', 1, 2, N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', N'ERP', CAST(N'2025-04-27T11:12:16.780' AS DateTime), N'192.168.15.71', NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[UserMenu] OFF
GO
ALTER TABLE [dbo].[Menu] ADD  CONSTRAINT [DF__Menu__IsActive__4850AF91]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[RoleMenu] ADD  CONSTRAINT [DF_RoleMenu_RoleId]  DEFAULT ((0)) FOR [RoleId]
GO
ALTER TABLE [dbo].[RoleMenu] ADD  CONSTRAINT [DF_RoleMenu_UserGroupId]  DEFAULT ((0)) FOR [UserGroupId]
GO
/****** Object:  StoredProcedure [dbo].[SalePersonMonthlyAchievementProcess]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Delete]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE [dbo].[sp_Delete]  '1','',''
--			EXECUTE [dbo].[sp_Delete]  '','ERP',''
--			EXECUTE [dbo].[sp_Delete]  '','','1'
 

CREATE PROCEDURE [dbo].[sp_Delete]	
	@RoleId nvarchar(64) = NULL,
	@UserId nvarchar(64) = NULL,
	@UserGroupId nvarchar(64) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;

		IF(@RoleId !='')
		BEGIN
			DELETE FROM RoleMenu WHERE RoleId = @RoleId
			SELECT 'RoleMenu' RoleMenu;
		END		
		ELSE IF(@UserId !='')
		BEGIN
			DELETE FROM UserMenu WHERE UserId = @UserId  
			SELECT 'UserMenu' UserMenu;
		END
		ELSE IF(@UserGroupId !='')
		BEGIN
			DELETE FROM RoleMenu WHERE UserGroupId = @UserGroupId
			SELECT 'RoleMenu' RoleMenu;
		END
		

        COMMIT TRANSACTION ProcessCommit;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        DECLARE @ERRORMESSAGE NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ERRORMESSAGE = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
        RAISERROR(@ERRORMESSAGE, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAreaList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetAreaList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetAreaList]
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
		 ISNULL(H.Id,0)Id
			,ISNULL(H.Code,'''') Code
			 
			,ISNULL(H.Name,'''') Name
		    ,ISNULL(H.BanglaName,'''') BanglaName
			
		
			FROM Areas H ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetAssignedMenuList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetAssignedMenuList 'get_List', 'ERP', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetAssignedMenuList]
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
		DECLARE @params NVARCHAR(MAX) = N'@Desc1 VARCHAR(200)';

		 SET @sql = N'
SELECT 
UM.MenuId,
M.[Url],
M.[Name] AS MenuName,M.IconClass,
M.Controller,
ISNULL(M.ParentId,0) ParentId,
ISNULL(M.SubParentId,0) SubParentId,
ISNULL(M.SubChildId,0) SubChildId,
ISNULL(M.DisplayOrder,0) DisplayOrder,
(SELECT COUNT(ParentId) 
FROM [dbo].[Menu] 
LEFT OUTER JOIN  
[dbo].[UserMenu] ON Menu.Id = UserMenu.MenuId
WHERE Menu.IsActive = 1 AND ParentId = M.Id 
AND UserMenu.UserId = @Desc1
) AS TotalChild
FROM 
UserMenu UM
LEFT OUTER JOIN  
[dbo].[RoleMenu] RM ON UM.MenuId = RM.Id
LEFT OUTER JOIN  
[dbo].[Menu] M ON UM.MenuId = M.Id
LEFT OUTER JOIN  
[dbo].[Role] R ON UM.RoleId = R.Id
LEFT OUTER JOIN  
[AuthDMS].[dbo].[AspNetUsers] U ON UM.UserId = U.UserName
WHERE M.IsActive = 1 AND UM.UserId = @Desc1
GROUP BY 
    UM.MenuId,
    M.[Url],
    M.[Name],
    M.IconClass,
    M.Controller,
    M.ParentId,
    M.SubParentId,
    M.SubChildId,
    M.DisplayOrder,
    M.Id
ORDER BY 
    M.DisplayOrder
';

			EXEC sp_executesql @sql, @params, @Desc1;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetBranchList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetBranchList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetBranchList]
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
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.DistributorCode,'''')	DistributorCode
			,ISNULL(H.Comments,'''') Comments
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM BranchProfiles H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetBranchProfileList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


	--EXECUTE sp_GetBranchProfileList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetBranchProfileList]
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

			 ISNULL(H.Id,0)	 EnumTypeId
			,ISNULL(H.Name,'''') EnumName
	
			
		
			FROM EnumTypes H ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetCurrencieList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetCurrencieList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetCurrencieList]
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
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name

			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM Currencies H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetCustomerList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetCustomerList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetCustomerList]
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
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.BanglaName,'''')	BanglaName
			,ISNULL(H.Comments,'''') Comments
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM Customers H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEnumTypesList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetEnumTypesList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetEnumTypesList]
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

			 ISNULL(H.Id,0)	EnumTypeId
			,ISNULL(H.Name,'''') EnumName
		
			
		
			FROM EnumTypes H ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetMenuAccessData]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetMenuAccessData '1'
 
 
CREATE PROCEDURE [dbo].[sp_GetMenuAccessData]
    @Id INT = 0
AS
BEGIN
    BEGIN   	


WITH MenuHierarchy AS (
    SELECT 
        Id, 
        [Name], 
        ParentId, 
        CAST([Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu
    WHERE  
         IsActive = 1 AND ParentId = 0 -- Start with top-level menus (where ParentId is NULL)
    UNION ALL
    SELECT 
        m.Id, 
        m.[Name], 
        m.ParentId, 
        CAST(mc.MenuName + ' > ' + m.[Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu m    
    INNER JOIN 
        MenuHierarchy mc ON m.ParentId = mc.Id
    WHERE  
         m.IsActive = 1 
),
MenuData AS (
    SELECT 
        1 AS IsChecked,
        RM.RoleId,
        RM.MenuId,
        RM.List,
        RM.[Insert],
        RM.[Delete],
        RM.Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        RoleMenu RM
    LEFT OUTER JOIN  
        [dbo].[Menu] M ON RM.MenuId = M.Id
    JOIN
        MenuHierarchy MH ON RM.MenuId = MH.Id
    WHERE 
        M.IsActive = 1 AND RM.RoleId = @Id

    UNION ALL

    SELECT 
        0 AS IsChecked,
        0 AS RoleId,
        M.Id AS MenuId,
        0 AS List,
        0 AS [Insert],
        0 AS [Delete],
        0 AS Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        [dbo].[Menu] M
    JOIN
        MenuHierarchy MH ON M.Id = MH.Id
    WHERE 
        M.IsActive = 1 AND M.Id NOT IN (SELECT MenuId FROM RoleMenu WHERE RoleId = @Id)
)

SELECT DISTINCT
    MenuId Id,
    IsChecked,
    RoleId,
	'0' UserGroupId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder,
    MAX(List) AS List,
    MAX([Insert]) AS [Insert],
    MAX([Delete]) AS [Delete],
    MAX(Post) AS Post
FROM 
    MenuData
GROUP BY 
    IsChecked,
    RoleId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder
ORDER BY 
    DisplayOrder;

    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetParentList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetParentList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetParentList]
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
			ISNULL(H.Code,'''') Code
			 ,ISNULL(H.Id,0) ParentId
			,ISNULL(H.Name,'''') Name
		    ,ISNULL(H.Email,'''') Email
			
		
			FROM BranchProfiles H ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetPaymentEnumTypeList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetPaymentEnumTypeList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetPaymentEnumTypeList]
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
			
			 WHERE H.EnumType = ''PaymentType''  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetProductGroupList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetProductGroupList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetProductGroupList]
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
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.Description,'''')	Description
			,ISNULL(H.Comments,'''') Comments
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM ProductGroups H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetProductList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetProductList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetProductList]
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
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.Description,'''') Description
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM Products H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetReceiveByDeliveryPersonList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetReceiveByDeliveryPersonList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetReceiveByDeliveryPersonList]
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
			
			 WHERE H.EnumType = ''DeliveryPerson''  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetReceiveByEnumTypeList]    Script Date: 2025-04-27 5:33:24 PM ******/
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
GO
/****** Object:  StoredProcedure [dbo].[sp_GetRoleData]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetRoleData 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetRoleData]
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
		DECLARE @params NVARCHAR(MAX) = N'@Desc1 VARCHAR(200)';

		 SET @sql = N'
					 SELECT Id, Name RoleName FROM [dbo].[Role] WHERE 1 = 1 ';

			EXEC sp_executesql @sql, @params, @Desc1;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetRouteList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetRouteList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetRouteList]
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
			
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.Address,'''')	Address
			,ISNULL(H.BanglaName,'''') BanglaName
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM SalesPersons H
			
			WHERE 1 = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSalePersonList]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetSalePersonList 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetSalePersonList]
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
			,ISNULL(H.Code,'''') Code
			,ISNULL(H.Name,'''') Name
			,ISNULL(H.BanglaName,'''') BanglaName
			,ISNULL(H.Address,'''')	Address
			,ISNULL(H.Mobile,'''') Mobile
			,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
		
			FROM SalesPersons H
			
			WHERE H.IsActive = 1  ';

			EXEC sp_executesql @sql;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUOMList]    Script Date: 2025-04-27 5:33:24 PM ******/
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
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserGroupData]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUserGroupData 'get_List', '', '', '', '', '', '', '', '', '', '';
 
 
CREATE PROCEDURE [dbo].[sp_GetUserGroupData]
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
		DECLARE @params NVARCHAR(MAX) = N'@Desc1 VARCHAR(200)';

		 SET @sql = N'
					 SELECT Id, Name GroupName FROM [dbo].[UserGroup] WHERE 1 = 1 ';

			EXEC sp_executesql @sql, @params, @Desc1;

    END
        ELSE
    BEGIN
        RAISERROR(@calltype, 16, 1);
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserGroupWiseMenuAccessData]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUserGroupWiseMenuAccessData '1'
 
 
CREATE PROCEDURE [dbo].[sp_GetUserGroupWiseMenuAccessData]
    @Id INT = 0
AS
BEGIN
    BEGIN   	


WITH MenuHierarchy AS (
    SELECT 
        Id, 
        [Name], 
        ParentId, 
        CAST([Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu
    WHERE  
         IsActive = 1 AND ParentId = 0 -- Start with top-level menus (where ParentId is NULL)
    UNION ALL
    SELECT 
        m.Id, 
        m.[Name], 
        m.ParentId, 
        CAST(mc.MenuName + ' > ' + m.[Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu m    
    INNER JOIN 
        MenuHierarchy mc ON m.ParentId = mc.Id
    WHERE  
         m.IsActive = 1 
),
MenuData AS (
    SELECT 
        1 AS IsChecked,
        RM.RoleId,
        RM.UserGroupId,
        RM.MenuId,
        RM.List,
        RM.[Insert],
        RM.[Delete],
        RM.Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        RoleMenu RM
    LEFT OUTER JOIN  
        [dbo].[Menu] M ON RM.MenuId = M.Id
    JOIN
        MenuHierarchy MH ON RM.MenuId = MH.Id
    WHERE 
        M.IsActive = 1 AND RM.UserGroupId = @Id

    UNION ALL

    SELECT 
        0 AS IsChecked,
        0 AS RoleId,
        0 AS UserGroupId,
        M.Id AS MenuId,
        0 AS List,
        0 AS [Insert],
        0 AS [Delete],
        0 AS Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        [dbo].[Menu] M
    JOIN
        MenuHierarchy MH ON M.Id = MH.Id
    WHERE 
        M.IsActive = 1 AND M.Id NOT IN (SELECT MenuId FROM RoleMenu WHERE UserGroupId = @Id)
)

SELECT DISTINCT
    MenuId Id,
    IsChecked,
    RoleId,
    UserGroupId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder,
    MAX(List) AS List,
    MAX([Insert]) AS [Insert],
    MAX([Delete]) AS [Delete],
    MAX(Post) AS Post
FROM 
    MenuData
GROUP BY 
    IsChecked,
    RoleId,
    UserGroupId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder
ORDER BY 
    DisplayOrder;

    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserMenuAccessData]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUserMenuAccessData '1','ERP'
 
 
CREATE PROCEDURE [dbo].[sp_GetUserMenuAccessData]
    @Id INT = 0,
    @UserId NVARCHAR(50) = '0'
AS
BEGIN
    BEGIN   	


-- DECLARE @RoleId INT = 1, @UserId NVARCHAR(10) = 'ERP';

WITH MenuHierarchy AS (
    SELECT 
        Id, 
        [Name], 
        ParentId, 
        CAST([Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu
    WHERE  
        IsActive = 1 AND ParentId = 0 -- Start with top-level menus (where ParentId is NULL)
    UNION ALL
    SELECT 
        m.Id, 
        m.[Name], 
        m.ParentId, 
        CAST(mc.MenuName + ' > ' + m.[Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu m
    INNER JOIN 
        MenuHierarchy mc ON m.ParentId = mc.Id
    WHERE 
        M.IsActive = 1 
),
MenuData AS (
    SELECT 
        CAST(1 AS BIT) AS IsChecked,
        UM.RoleId,
        UM.MenuId,
        M.ParentId,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller,
        M.DisplayOrder,
        UM.List,
        UM.[Insert],
        UM.[Delete],
        UM.Post
    FROM 
        UserMenu UM   
    LEFT OUTER JOIN  
        [dbo].[Menu] M ON UM.MenuId = M.Id
    LEFT OUTER JOIN  
        [dbo].[Role] R ON UM.RoleId = R.Id
    LEFT OUTER JOIN  
        [AuthDMS_DEMO].[dbo].[AspNetUsers] U ON UM.UserId = U.UserName
    JOIN
        MenuHierarchy MH ON UM.MenuId = MH.Id
    WHERE 
        M.IsActive = 1 AND UM.RoleId = @Id AND UM.UserId = @UserId 

    UNION ALL

    SELECT 
        0 AS IsChecked,
        0 AS RoleId,
        M.Id AS MenuId,
        M.ParentId,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller,
        M.DisplayOrder,
        0 AS List,
        0 AS [Insert],
        0 AS [Delete],
        0 AS Post
    FROM 
        [dbo].[Menu] M
    JOIN
        MenuHierarchy MH ON M.Id = MH.Id
    WHERE 
        M.IsActive = 1 AND M.Id NOT IN (SELECT MenuId FROM UserMenu WHERE RoleId = @Id AND UserId = @UserId)
)

SELECT DISTINCT
    MenuId Id,
    IsChecked,
    RoleId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder,
    MAX(List) AS List,
    MAX([Insert]) AS [Insert],
    MAX([Delete]) AS [Delete],
    MAX(Post) AS Post
FROM 
    MenuData
GROUP BY 
    IsChecked,
    RoleId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder
ORDER BY 
    DisplayOrder;

    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserRoleWiseMenuAccessData]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_GetUserRoleWiseMenuAccessData '1'
 
 
CREATE PROCEDURE [dbo].[sp_GetUserRoleWiseMenuAccessData]
    @Id INT = 0
AS
BEGIN
    BEGIN   	

-- DECLARE @RoleId INT = 2;

WITH MenuHierarchy AS (
    SELECT 
        Id, 
        [Name], 
        ParentId, 
        CAST([Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu
    WHERE  
        IsActive = 1 AND ParentId = 0 -- Start with top-level menus (where ParentId is NULL)
    UNION ALL
    SELECT 
        m.Id, 
        m.[Name], 
        m.ParentId, 
        CAST(mc.MenuName + ' > ' + m.[Name] AS NVARCHAR(MAX)) AS MenuName
    FROM 
        Menu m
    INNER JOIN 
        MenuHierarchy mc ON m.ParentId = mc.Id

    WHERE M.IsActive = 1
),
MenuData AS (
    SELECT 
        1 AS IsChecked,
        RM.RoleId,
        RM.MenuId,
        RM.List,
        RM.[Insert],
        RM.[Delete],
        RM.Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        RoleMenu RM
    LEFT OUTER JOIN  
        [dbo].[Menu] M ON RM.MenuId = M.Id
    JOIN
        MenuHierarchy MH ON RM.MenuId = MH.Id
    WHERE 
        M.IsActive = 1 AND RM.RoleId = @Id

    UNION ALL

    SELECT 
        0 AS IsChecked,
        0 AS RoleId,
        M.Id AS MenuId,
        0 AS List,
        0 AS [Insert],
        0 AS [Delete],
        0 AS Post,
        M.ParentId,
        M.DisplayOrder,
        ISNULL(M.[Url],'') AS [Url],
        MH.MenuName,
        ISNULL(M.Controller,'') AS Controller
    FROM 
        [dbo].[Menu] M
    JOIN
        MenuHierarchy MH ON M.Id = MH.Id
    WHERE 
        M.IsActive = 1 AND M.Id NOT IN (SELECT MenuId FROM UserMenu WHERE RoleId = @Id)
        AND M.Id NOT IN (SELECT DISTINCT MenuId FROM RoleMenu WHERE RoleId = @Id)
)

SELECT DISTINCT
    MenuId Id,
    IsChecked,
    RoleId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder,
    MAX(List) AS List,
    MAX([Insert]) AS [Insert],
    MAX([Delete]) AS [Delete],
    MAX(Post) AS Post
FROM 
    MenuData
GROUP BY 
    IsChecked,
    RoleId,
    MenuId,
    ParentId,
    Url,
    MenuName,
    Controller,
    DisplayOrder
ORDER BY 
    DisplayOrder;

    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_RoleCreateEdit]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_RoleCreateEdit]  0,'Admin','ERP','::1','add'
--			EXECUTE [dbo].[sp_RoleCreateEdit]  1,'Admin','ERP','::1','update'
--			EXECUTE [dbo].[sp_RoleCreateEdit]  2,'User','ERP','::1','add'
--			EXECUTE [dbo].[sp_RoleCreateEdit]  2,'User','ERP','::1','update'
 

CREATE PROCEDURE [dbo].[sp_RoleCreateEdit]
	
	@Id INT = 0,
	@Name		 nvarchar(50) = NULL,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL,
	@Operation	 nvarchar(20) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;
        
		IF NOT EXISTS (SELECT 1 FROM [dbo].[Role] WHERE Name = @Name AND Id != @Id)
			BEGIN
			IF(@Operation = 'add')
			BEGIN
				INSERT INTO [dbo].[Role] 
			(
				 Name
				,CreatedBy
				,CreatedOn
				,CreatedFrom
			) 
			VALUES
			(
				 @Name
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
			)
			END
			ELSE
			BEGIN
				 UPDATE [dbo].[Role] SET  
				 Name=@Name
				,LastModifiedBy=@CreatedBy
				,LastModifiedOn=GETDATE()
				,LastUpdateFrom=@CreatedFrom
                       
				WHERE  Id = @Id
			END
			END
		ELSE
		BEGIN
			RAISERROR('[%s] Data Already Exist!', 16, 1, @Name);
		END		

		SET @TotalRowsAffected = @@ROWCOUNT;

        IF (@TotalRowsAffected = 0)
        BEGIN
            RAISERROR('Failed!', 16, 1);
        END
        ELSE
        BEGIN
           SELECT ISNULL(SCOPE_IDENTITY(),@Id);
        END

        COMMIT TRANSACTION ProcessCommit;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        DECLARE @ERRORMESSAGE NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ERRORMESSAGE = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
        RAISERROR(@ERRORMESSAGE, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_RoleMenuCreateEdit]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_RoleMenuCreateEdit]  1,0,1,'ERP','::1'
--			EXECUTE [dbo].[sp_RoleMenuCreateEdit]  0,1,1,'ERP','::1'
 

CREATE PROCEDURE [dbo].[sp_RoleMenuCreateEdit]	
	@RoleId INT = 0,
	@UserGroupId INT = 0,
	@MenuId INT = 0,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;

		--DELETE FROM RoleMenu WHERE RoleId = @RoleId
        
		
		INSERT INTO [dbo].[RoleMenu] 
			(
				 RoleId
				,UserGroupId
				,MenuId
				,CreatedBy
				,CreatedOn
				,CreatedFrom
				,LastModifiedBy
				,LastModifiedOn
				,LastUpdateFrom
			) 
			VALUES
			(
				 @RoleId
				,@UserGroupId
				,@MenuId
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
			)		

		SET @TotalRowsAffected = @@ROWCOUNT;

        IF (@TotalRowsAffected = 0)
        BEGIN
            RAISERROR('Failed!', 16, 1);
        END
        ELSE
        BEGIN
           SELECT SCOPE_IDENTITY();
        END

        COMMIT TRANSACTION ProcessCommit;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        DECLARE @ERRORMESSAGE NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ERRORMESSAGE = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
        RAISERROR(@ERRORMESSAGE, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_SalePersonCampaignAchivementProcess]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[SP_SalePersonMonthlyAchievements]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		 SP_SalePersonMonthlyAchievements 3


CREATE PROCEDURE [dbo].[SP_SalePersonMonthlyAchievements]  
(
    @Id INT
)
AS
BEGIN    
    
	CREATE TABLE #TempResults
	(
		Id INT,
		Name NVARCHAR(255),
		TotalSale DECIMAL(18, 2),
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
	WHERE ParentId = @Id


	INSERT INTO #TempResults(Id,Name,TotalSale,SelfSaleCommissionRate,BonusAmount,OtherSaleCommissionRate,OtherCommissionBonus) 
	SELECT DISTINCT 
		ISNULL(E.Id,0) Id,
		ISNULL(E.Name,'') Name,
		ISNULL(CT.TotalSale,0) TotalSale,
		ISNULL(CT.SelfSaleCommissionRate,0) SelfSaleCommissionRate,		
		((ISNULL(CT.TotalSale,0) * ISNULL(CT.SelfSaleCommissionRate,0)) / 100) AS BonusAmount,
		ISNULL(CT.OtherSaleCommissionRate,0) OtherSaleCommissionRate,
		ISNULL(CASE
			WHEN E.Id = @Id THEN
				((SELECT SUM(ISNULL(CT2.TotalSale,0)) FROM SalePersonCampaignTargets CT2 WHERE CT2.Id IN (SELECT SalePersonId FROM #Temp)) * ISNULL(CT.OtherSaleCommissionRate,0) / 100)
			ELSE 0
		END,0) AS OtherCommissionBonus
	FROM SalesPersons E
	LEFT OUTER JOIN SalePersonCampaignTargets CT ON E.Id = CT.SalePersonId
	WHERE E.Id IN (@Id)

	UNION ALL

	SELECT DISTINCT 
		ISNULL(E.Id,0) Id,
		ISNULL(E.Name,'') Name,
		ISNULL(CT.TotalSale,0) TotalSale,
		ISNULL(CT.SelfSaleCommissionRate,0) SelfSaleCommissionRate,	
		((ISNULL(CT.TotalSale,0) * ISNULL(CT.SelfSaleCommissionRate,0)) / 100) AS BonusAmount,
		ISNULL(CT.OtherSaleCommissionRate,0) OtherSaleCommissionRate,
		0 AS OtherCommissionBonus
	FROM SalesPersons E
	LEFT OUTER JOIN SalePersonCampaignTargets CT ON E.Id = CT.SalePersonId
	WHERE E.Id IN (SELECT SalePersonId FROM #Temp WHERE SalePersonId !=@Id );

	CREATE TABLE #Circles 
	(
		Id INT IDENTITY(1,1),
		MappingId INT
	);

	INSERT INTO #Circles(MappingId)
	SELECT            
	Id
	FROM SalesPersons
	WHERE Id NOT IN (SELECT Id FROM SalesPersons)

	DECLARE @CircleCount INT;
	DECLARE @CurrentIndex INT = 1;
	DECLARE @SalePersonId INT;

	SELECT @CircleCount = COUNT(*) FROM #Circles;

WHILE @CurrentIndex <= @CircleCount
BEGIN

	SELECT @SalePersonId = MappingId 
	FROM #Circles 
	WHERE Id = @CurrentIndex;
	PRINT @SalePersonId;

	CREATE TABLE #Temp2 
	(
		Id INT IDENTITY(1,1),
		SalePersonId INT
	);
	

	INSERT INTO #Temp2(SalePersonId)
	SELECT Id
	FROM SalesPersons        
	WHERE ParentId = @SalePersonId

	UPDATE #TempResults SET OtherCommissionBonus = 
						ISNULL(CASE
						WHEN E.Id = @SalePersonId THEN
						((SELECT SUM(ISNULL(E2.TotalSale,0)) FROM #TempResults E2 WHERE E2.Id IN (SELECT SalePersonId FROM #Temp2)) * ISNULL(E.OtherSaleCommissionRate,0) / 100)
						ELSE 0
						END,0)
						FROM #TempResults E
						WHERE E.Id IN (@SalePersonId)

	SET @CurrentIndex = @CurrentIndex + 1;
	DROP TABLE #Temp2;
END

		SELECT *,(ISNULL(BonusAmount,0)+ISNULL(OtherCommissionBonus,0)) TotalBonus FROM #TempResults;

		DROP TABLE #Temp;
		DROP TABLE #Circles;
		DROP TABLE #TempResults;
END

--		 SP_SalePersonMonthlyAchievements 3
GO
/****** Object:  StoredProcedure [dbo].[sp_Select_BranchCreditLimit_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_BranchCreditLimit_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_BranchCreditLimit_Grid]
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
					FROM BranchCreditLimits H 
					LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
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
				,ISNULL(H.SelfCreditLimit,0) SelfCreditLimit
				,ISNULL(H.OtherCreditLimit,0) OtherCreditLimit
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
		        ,ISNULL(H.BranchId,0) BranchId

				FROM BranchCreditLimits H 
				LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
				
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_BranchProfile_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_BranchProfile_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_BranchProfile_Grid]
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
					FROM BranchProfiles H 
					
					WHERE H.IsActive = 1 ';
			
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
				,ISNULL(H.Code,'''') Code
				,ISNULL(H.DistributorCode,'''') DistributorCode
				,ISNULL(H.Name,'''')	Name
				,ISNULL(H.ParentId,0)	ParentId
				,ISNULL(H.EnumTypeId,0) EnumTypeId
				,ISNULL(H.AreaId,0) AreaId
				,ISNULL(H.TelephoneNo,'''') TelephoneNo
				,ISNULL(H.Email,'''') Email
				,ISNULL(H.VATRegistrationNo,'''') VATRegistrationNo
				,ISNULL(H.BIN,'''') BIN
				,ISNULL(H.TINNO,'''') TINNO
				,ISNULL(H.Comments,'''') Comments
				,ISNULL(H.IsArchive,0)	IsArchive
				,ISNULL(H.IsActive,0)	IsActive
				,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn
				

				FROM BranchProfiles H 
				
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_BusinessType_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_BusinessType_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_BusinessType_Grid]
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
					FROM BusinessTypes H 
					
					WHERE H.IsActive = 1 ';
			
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
				,ISNULL(H.Code,'''') Code
				,ISNULL(H.Name,'''') Name
				,ISNULL(H.IsArchive,0)	IsArchive
				,ISNULL(H.IsActive,0)	IsActive
				,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn

				FROM BusinessTypes H 
				
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_Campaign_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_Campaign_Grid.sql]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_Campaign_Grid.sql 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_Campaign_Grid.sql]
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
				ROW_NUMBER() OVER(ORDER BY ' + @orderby + ') AS rowindex,
				    ISNULL(H.Id, 0) AS Id,
					ISNULL(H.Code, '''') AS Code,
					ISNULL(H.Name, '''') AS Name,
					ISNULL(H.Description, '''') AS Description,
					ISNULL(H.IsArchive, 0) AS IsArchive,
					ISNULL(H.IsActive, 0) AS IsActive,
					CASE WHEN ISNULL(H.IsActive, 0) = 1 THEN ''Active'' ELSE ''Inactive'' END AS Status,
					ISNULL(H.CreatedBy, '''') AS CreatedBy,
					ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy,
					ISNULL(FORMAT(H.CreatedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS CreatedOn,
					ISNULL(FORMAT(H.LastModifiedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS LastModifiedOn,
					ISNULL(H.BranchId, 0) AS BranchId
 
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_CustomerAdvance_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--		EXECUTE sp_Select_CustomerAdvance_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_CustomerAdvance_Grid]
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
					FROM CustomerAdvances H 
					LEFT OUTER JOIN Customers C ON H.CustomerId = C.Id 
					LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
												
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
				,ISNULL(FORMAT(H.AdvanceEntryDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') AdvanceEntryDate
				,ISNULL(H.AdvanceAmount,0) AdvanceAmount
				,ISNULL(FORMAT(H.PaymentDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') PaymentDate				 
				,ISNULL(H.DocumentNo,'''')	DocumentNo
				,ISNULL(H.BankName,'''')	BankName
				,ISNULL(H.BankBranchName,'''')	BankBranchName

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
		        ,ISNULL(H.PaymentEnumTypeId,0) PaymentEnumTypeId
		        ,ISNULL(H.ReceiveByDeliveryPersonId,0) ReceiveByDeliveryPersonId
		        ,ISNULL(H.ReceiveByEnumTypeId,0) ReceiveByEnumTypeId


				FROM CustomerAdvances H 
				LEFT OUTER JOIN Customers C ON H.CustomerId = C.Id 
				LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
				
				
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_CustomerCreditLimit_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_DeliveryPerson_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_DeliveryPerson_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_DeliveryPerson_Grid]
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
					 FROM DeliveryPersons H';
			
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
						,ISNULL(H.City, '''') AS City
						,ISNULL(H.Mobile, '''') AS Mobile
						,ISNULL(H.Mobile2, '''') AS Mobile2
						,ISNULL(H.Phone, '''') AS Phone
						,ISNULL(H.Phone2, '''') AS Phone2
						,ISNULL(H.EmailAddress, '''') AS EmailAddress
						,ISNULL(H.EmailAddress2, '''') AS EmailAddress2
						,ISNULL(H.Address, '''') AS Address
						,ISNULL(H.ZipCode, '''') AS ZipCode
						,ISNULL(H.NIDNo, '''') AS NIDNo
						,ISNULL(H.FaxNo, '''') AS FaxNo
						,ISNULL(H.Comments, '''') AS Comments
						,ISNULL(H.CreatedBy, '''') AS CreatedBy
						,ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy
						,ISNULL(FORMAT(H.CreatedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS CreatedOn
						,ISNULL(FORMAT(H.LastModifiedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS LastModifiedOn
						,ISNULL(H.CreatedFrom, '''') AS CreatedFrom
						,ISNULL(H.LastUpdateFrom, '''') AS LastUpdateFrom
					FROM DeliveryPersons H ';        
        
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_GetRoleAll]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_Select_GetRoleAll '3'
 
 
CREATE PROCEDURE [dbo].[sp_Select_GetRoleAll]
    @Id INT = 0
AS
BEGIN
    BEGIN
	   	
		SELECT
		 Id
		,ISNULL(Name,'') Name
		,ISNULL(CreatedBy,'')	CreatedBy	
		,ISNULL(CreatedFrom,'')	CreatedFrom	
		,ISNULL(LastUpdateFrom,'')LastUpdateFrom	
		,ISNULL(LastModifiedBy,'')LastModifiedBy	
		,Isnull(FORMAT(CreatedOn,'yyyy-MM-dd HH:mm:ss'),'1900-01-01') CreatedOn
		,Isnull(FORMAT(LastModifiedOn,'yyyy-MM-dd HH:mm:ss'),'1900-01-01') LastModifiedOn
		,LastUpdateFrom

		FROM [dbo].[Role] WHERE Id = @Id 

    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_Select_GetUserGroupAll]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--			EXECUTE sp_Select_GetUserGroupAll '1'
 
 
CREATE PROCEDURE [dbo].[sp_Select_GetUserGroupAll]
    @Id INT = 0
AS
BEGIN
    BEGIN
	   	
		SELECT
		 Id
		,ISNULL(Name,'') Name
		,ISNULL(CreatedBy,'')	CreatedBy	
		,ISNULL(CreatedFrom,'')	CreatedFrom	
		,ISNULL(LastUpdateFrom,'')LastUpdateFrom	
		,ISNULL(LastModifiedBy,'')LastModifiedBy	
		,Isnull(FORMAT(CreatedOn,'yyyy-MM-dd HH:mm:ss'),'1900-01-01') CreatedOn
		,Isnull(FORMAT(LastModifiedOn,'yyyy-MM-dd HH:mm:ss'),'1900-01-01') LastModifiedOn
		,LastUpdateFrom

		FROM [dbo].[UserGroup] WHERE Id = @Id 

    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_Select_Location_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_Location_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_Location_Grid]
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
						FROM Locations H					
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
				   ,ISNULL(H.Id,0)	Id
					,ISNULL(H.Code,'''') Code
					,ISNULL(H.Name,'''') Name				
					,ISNULL(H.IsArchive,0)	IsArchive
					,ISNULL(H.IsActive,0)	IsActive
					,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
					,ISNULL(H.CreatedBy,'''') CreatedBy
					,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
					,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
					,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn				

					FROM Locations H 

					WHERE H.IsActive = 1  ';        
        
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_PaymentType_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_PaymentType_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_PaymentType_Grid]
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
						FROM PaymentTypes H					
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
				    ,ISNULL(H.Id,0)	Id
					,ISNULL(H.Name,'''') Name				
					,ISNULL(H.IsArchive,0)	IsArchive
					,ISNULL(H.IsActive,0)	IsActive
					,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
					,ISNULL(H.CreatedBy,'''') CreatedBy
					,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
					,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
					,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn				

					FROM PaymentTypes H 

					WHERE H.IsActive = 1  ';        
        
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_Product_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_Product_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_Product_Grid]
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
					FROM Products H 
					LEFT OUTER JOIN ProductGroups PG ON H.ProductGroupId = PG.Id
					LEFT OUTER JOIN UOMs uom ON H.UOMId = uom.Id
					WHERE H.IsActive = 1 ';
			
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
				,ISNULL(H.Code,'''') Code
				,ISNULL(H.Name,'''') Name
				,ISNULL(H.Description,'''')	Description
				,ISNULL(H.IsArchive,0)	IsArchive
				,ISNULL(H.IsActive,0)	IsActive
				,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn
				,ISNULL(H.ProductGroupId,0)	ProductGroupId
				,ISNULL(PG.Name,'''') ProductGroupName
				,ISNULL(H.UOMId,0) UOMId
				,ISNULL(uom.Name,'''') UOMName

				FROM Products H 
				LEFT OUTER JOIN ProductGroups PG ON H.ProductGroupId = PG.Id
				LEFT OUTER JOIN UOMs uom ON H.UOMId = uom.Id
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_ProductBatchHistorie_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_ProductBatchHistorie_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_ProductBatchHistorie_Grid]
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
					FROM ProductBatchHistories H 
					LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
					LEFT OUTER JOIN Products P ON H.ProductId = P.Id			
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
				,ISNULL(FORMAT(H.EntryDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') EntryDate
				,ISNULL(H.BatchNo,0) BatchNo
				,ISNULL(FORMAT(H.MFGDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') MFGDate
				,ISNULL(FORMAT(H.EXPDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') EXPDate				
				,ISNULL(H.CostPrice,0) CostPrice
				,ISNULL(H.SalesPrice,0) SalesPrice
				,ISNULL(H.PurchasePrice,0) PurchasePrice

				
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(H.CreatedFrom,'''') CreatedFrom
				,ISNULL(H.LastUpdateFrom,'''') LastUpdateFrom		
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn
		        ,ISNULL(H.BranchId,0) BranchId
				 ,ISNULL(H.ProductId,0) ProductId

				FROM ProductBatchHistories H 
				LEFT OUTER JOIN BranchProfiles BF ON H.BranchId = BF.Id
				LEFT OUTER JOIN Products P ON H.ProductId = P.Id
				
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_ProductGroup_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_ProductGroup_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_ProductGroup_Grid]
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
					FROM ProductGroups H
					WHERE H.IsActive = 1 ';
			
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
				,ISNULL(H.Code,'''') Code
				,ISNULL(H.Name,'''') Name
				,ISNULL(H.Description,'''')	Description
				,ISNULL(H.Comments,'''') Comments
				,ISNULL(H.IsArchive,0)	IsArchive
				,ISNULL(H.IsActive,0)	IsActive
				,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn

				FROM ProductGroups H 
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_RoleIndex_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_RoleIndex_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_RoleIndex_Grid]
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
					FROM Role H
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
				,ISNULL(H.Name,'''') Name
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn

				FROM Role H 
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_Route_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_Route_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_Route_Grid]
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
					 FROM Routes H
					  LEFT OUTER JOIN Areas A ON H.AreaId = H.Id';
			
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
						,ISNULL(H.BanglaName, '''') AS BanglaName
						,ISNULL(A.Name, '''') AS AreaName
						,ISNULL(A.BanglaName, '''') AS AreaBanglaName
						,ISNULL(A.ZipCode, '''') AS AreaZipCode
						,ISNULL(H.BranchId, 0) AS BranchId
						,ISNULL(H.AreaId, 0) AS AreaId
						,ISNULL(H.Address, '''') AS Address
						,ISNULL(H.AddressBangla, '''') AS AddressBangla
						,ISNULL(H.IsArchive, 0) AS IsArchive
					    ,ISNULL(H.IsActive, 0) AS IsActive
						,CASE WHEN ISNULL(H.IsActive, 0) = 1 THEN ''Active'' ELSE ''Inactive'' END AS Status
						,ISNULL(H.CreatedBy, '''') AS CreatedBy
						,ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy
						,ISNULL(FORMAT(H.CreatedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS CreatedOn
						,ISNULL(FORMAT(H.LastModifiedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS LastModifiedOn
					FROM Routes H
					 LEFT OUTER JOIN Areas A ON H.AreaId = H.Id ';        
        
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_Sale_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_SaleDelivery_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_SaleOrder_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_SaleOrder_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_SaleOrder_Grid]
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
					FROM SaleOrders H 
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
				,ISNULL(FORMAT(H.InvoiceDateTime,''yyyy-MM-dd HH:mm''),''1900-01-01'') InvoiceDateTime
				,ISNULL(FORMAT(H.DeliveryDate,''yyyy-MM-dd HH:mm''),''1900-01-01'') DeliveryDate	
				,ISNULL(H.GrandTotalAmount,0) GrandTotalAmount
				,ISNULL(H.GrandTotalSDAmount,0) GrandTotalSDAmount
				,ISNULL(H.GrandTotalVATAmount,0) GrandTotalVATAmount
				,ISNULL(H.Comments,'''')	Comments	
				,ISNULL(H.TransactionType,'''')	TransactionType				
				,ISNULL(H.CurrencyRateFromBDT,0) CurrencyRateFromBDT
				
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
		

				FROM SaleOrders H 
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_SalePersonRoute_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_SalePersonRoute_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_SalePersonRoute_Grid]
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
					 FROM SalePersonRoutes H
					 LEFT OUTER JOIN Routes R ON H.RouteId = R.Id
					 LEFT OUTER JOIN BranchProfiles B ON H.BranchId = B.Id
					 LEFT OUTER JOIN SalesPersons SP ON H.SalePersonId = SP.Id';
			
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
							,ISNULL(H.SalePersonId, 0) AS SalePersonId
							,ISNULL(SP.Name, '''') AS SalePersonName
							,ISNULL(H.BranchId, 0) AS BranchId
							,ISNULL(B.Name, '''') AS BranchName
							,ISNULL(H.RouteId, 0) AS RouteId
							,ISNULL(R.Name, '''') AS RouteName
							,ISNULL(H.IsArchive, 0) AS IsArchive
							,ISNULL(H.IsActive, 0) AS IsActive
							,ISNULL(H.CreatedBy, '''') AS CreatedBy
							,ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy
							,ISNULL(FORMAT(H.CreatedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS CreatedOn
							,ISNULL(FORMAT(H.LastModifiedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS LastModifiedOn
						FROM SalePersonRoutes H
						LEFT OUTER JOIN Routes R ON H.RouteId = R.Id
						LEFT OUTER JOIN BranchProfiles B ON H.BranchId = B.Id
						LEFT OUTER JOIN SalesPersons SP ON H.SalePersonId = SP.Id ';        
        
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_SalesPerson_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_SalesPerson_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_SalesPerson_Grid]
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
							 FROM SalesPersons H';
			
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
								,ISNULL(H.BranchId, 0) AS BranchId
								,ISNULL(H.ParentId, 0) AS ParentId
								,ISNULL(H.EnumTypeId, 0) AS EnumTypeId
								,ISNULL(H.BanglaName, '''') AS BanglaName
								,ISNULL(H.Comments, '''') AS Comments
								,ISNULL(H.City, '''') AS City
								,ISNULL(H.FaxNo, '''') AS FaxNo
								,ISNULL(H.NIDNo, '''') AS NIDNo
								,ISNULL(H.Mobile, '''') AS Mobile
								,ISNULL(H.Mobile2, '''') AS Mobile2
								,ISNULL(H.Phone, '''') AS Phone
								,ISNULL(H.Phone2, '''') AS Phone2
								,ISNULL(H.EmailAddress, '''') AS EmailAddress
								,ISNULL(H.EmailAddress2, '''') AS EmailAddress2
								,ISNULL(H.Fax, '''') AS Fax
								,ISNULL(H.Address, '''') AS Address
								,ISNULL(H.ZipCode, '''') AS ZipCode
								,ISNULL(H.IsArchive, 0) AS IsArchive
								,ISNULL(H.IsActive, 0) AS IsActive
								,CASE WHEN ISNULL(H.IsActive, 0) = 1 THEN ''Active'' ELSE ''Inactive'' END AS Status
								,ISNULL(H.CreatedBy, '''') AS CreatedBy
								,ISNULL(FORMAT(H.CreatedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS CreatedOn
								,ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy
								,ISNULL(FORMAT(H.LastModifiedOn, ''yyyy-MM-dd HH:mm''), ''1900-01-01'') AS LastModifiedOn
								,ISNULL(H.CreatedFrom, '''') AS CreatedFrom
								,ISNULL(H.LastUpdateFrom, '''') AS LastUpdateFrom
							FROM SalesPersons H ';        
        
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_UOM_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_UOM_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_UOM_Grid]
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
							FROM UOMs H					
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
				               ,ISNULL(H.Id,0)	Id
								,ISNULL(H.Code,'''') Code	
								,ISNULL(H.Name,'''') Name				
								,ISNULL(H.IsArchive,0)	IsArchive
								,ISNULL(H.IsActive,0)	IsActive
								,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
								,ISNULL(H.CreatedBy,'''') CreatedBy
								,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
								,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
								,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn				

								FROM UOMs H 

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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_UOMConversation_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_UOMConversation_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_UOMConversation_Grid]
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
					FROM UOMConversations H 
					
					WHERE H.IsActive = 1 ';
			
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
				,ISNULL(H.FromId,0)	FromId
				,ISNULL(H.ToId,'''') ToId
				,ISNULL(H.ConversationFactor, 0)	ConversationFactor
				,ISNULL(H.IsArchive,0)	IsArchive
				,ISNULL(H.IsActive,0)	IsActive
				,CASE WHEN ISNULL(H.IsActive,0) = 1 THEN ''Active'' ELSE ''Inactive''	END Status
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn

				FROM UOMConversations H 
				
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_UserGroupIndex_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		EXECUTE sp_Select_UserGroupIndex_Grid 'get_summary',0,10,'','H.Id','','','','','','','','','',''
 
 
CREATE PROCEDURE [dbo].[sp_Select_UserGroupIndex_Grid]
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
					FROM UserGroup H
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
				,ISNULL(H.Name,'''') Name
				,ISNULL(H.CreatedBy,'''') CreatedBy
				,ISNULL(H.LastModifiedBy,'''') LastModifiedBy
				,ISNULL(FORMAT(H.CreatedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') CreatedOn
				,ISNULL(FORMAT(H.LastModifiedOn,''yyyy-MM-dd HH:mm''),''1900-01-01'') LastModifiedOn

				FROM UserGroup H 
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

GO
/****** Object:  StoredProcedure [dbo].[sp_Select_UserMenuIndex_Grid]    Script Date: 2025-04-27 5:33:24 PM ******/
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

GO
/****** Object:  StoredProcedure [dbo].[sp_UserGroupCreateEdit]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_UserGroupCreateEdit]  0,'Admin','ERP','::1','add'
--			EXECUTE [dbo].[sp_UserGroupCreateEdit]  1,'Admin','ERP','::1','update'
--			EXECUTE [dbo].[sp_UserGroupCreateEdit]  2,'User','ERP','::1','add'
--			EXECUTE [dbo].[sp_UserGroupCreateEdit]  2,'User','ERP','::1','update'
 

CREATE PROCEDURE [dbo].[sp_UserGroupCreateEdit]
	
	@Id INT = 0,
	@Name		 nvarchar(50) = NULL,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL,
	@Operation	 nvarchar(20) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;
        
		IF NOT EXISTS (SELECT 1 FROM [dbo].[UserGroup] WHERE Name = @Name AND Id != @Id)
			BEGIN
			IF(@Operation = 'add')
			BEGIN
				INSERT INTO [dbo].[UserGroup] 
			(
				 Name
				,CreatedBy
				,CreatedOn
				,CreatedFrom
			) 
			VALUES
			(
				 @Name
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
			)
			END
			ELSE
			BEGIN
				 UPDATE [dbo].[UserGroup] SET  
				 Name=@Name
				,LastModifiedBy=@CreatedBy
				,LastModifiedOn=GETDATE()
				,LastUpdateFrom=@CreatedFrom
                       
				WHERE  Id = @Id
			END
			END
		ELSE
		BEGIN
			RAISERROR('[%s] Data Already Exist!', 16, 1, @Name);
		END		

		SET @TotalRowsAffected = @@ROWCOUNT;

        IF (@TotalRowsAffected = 0)
        BEGIN
            RAISERROR('Failed!', 16, 1);
        END
        ELSE
        BEGIN
           SELECT ISNULL(SCOPE_IDENTITY(),@Id);
        END

        COMMIT TRANSACTION ProcessCommit;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        DECLARE @ERRORMESSAGE NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ERRORMESSAGE = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
        RAISERROR(@ERRORMESSAGE, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[sp_UserMenuCreateEdit]    Script Date: 2025-04-27 5:33:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--			EXECUTE [dbo].[sp_UserMenuCreateEdit]  'ERP',1,1,'ERP','::1'
 

CREATE PROCEDURE [dbo].[sp_UserMenuCreateEdit]	
	@UserId nvarchar(64) = NULL,
	@RoleId INT = 0,
	@MenuId INT = 0,
	@CreatedBy	 nvarchar(64) = NULL,
	@CreatedFrom nvarchar(64) = NULL
AS
BEGIN
    BEGIN TRANSACTION ProcessCommit;
    BEGIN TRY

		DECLARE @TotalRowsAffected INT = 0;

		--DELETE FROM UserMenu WHERE UserId = @UserId
        
		
		INSERT INTO [dbo].[UserMenu] 
			(
				 UserId
				,RoleId
				,MenuId
				,CreatedBy
				,CreatedOn
				,CreatedFrom
				,LastModifiedBy
				,LastModifiedOn
				,LastUpdateFrom
			) 
			VALUES
			(
				 @UserId
				,@RoleId
				,@MenuId
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
				,@CreatedBy
				,GETDATE()
				,@CreatedFrom
			)		

		SET @TotalRowsAffected = @@ROWCOUNT;

        IF (@TotalRowsAffected = 0)
        BEGIN
            RAISERROR('Failed!', 16, 1);
        END
        ELSE
        BEGIN
           SELECT SCOPE_IDENTITY();
        END

        COMMIT TRANSACTION ProcessCommit;
    END TRY
    BEGIN CATCH

        ROLLBACK TRANSACTION;
        DECLARE @ERRORMESSAGE NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ERRORMESSAGE = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();
        RAISERROR(@ERRORMESSAGE, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
USE [master]
GO
ALTER DATABASE [ShampanSample_DB] SET  READ_WRITE 
GO
