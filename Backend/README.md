# E-Commerce Backend API

A comprehensive e-commerce backend API built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and modern .NET technologies. This project provides a scalable, maintainable platform for managing products, categories, orders, users, and real-time notifications.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Authentication & Authorization](#authentication--authorization)
- [Real-Time Features](#real-time-features)
- [Error Handling & Logging](#error-handling--logging)
- [Development Workflow](#development-workflow)

---

## 📌 Project Overview

This is a multi-layered e-commerce backend system designed to manage:
- **User Management** - Registration, authentication, email verification, password reset
- **Product Management** - Create, read, update, delete products with images
- **Categories** - Organize products into categories
- **Shopping Cart** - Add/remove items from cart with real-time updates
- **Orders** - Place orders, track order status, manage payments
- **Addresses** - Manage customer shipping addresses
- **Admin Analytics** - Track sales, revenue, and user activity
- **Real-Time Notifications** - Live order updates via SignalR

---

## 🏗️ Architecture

### Clean Architecture with Domain-Driven Design

The project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Ecomm.Api (Presentation Layer)      │
│  Controllers, Hubs, Middleware, DTOs        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      Ecomm.Application (Application Layer)  │
│  Services, Validators, Mappings, Interfaces│
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│   Ecomm.Infrastructure (Infrastructure)    │
│  EF Core, Repositories, UnitOfWork, Auth   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│       Ecomm.Domain (Domain Layer/Core)      │
│  Entities, Enums, Common, Business Logic    │
└─────────────────────────────────────────────┘
```

### Design Principles Applied

- **SOLID Principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Repository Pattern** - Abstraction of data access layer
- **Unit of Work Pattern** - Managing transactions across multiple repositories
- **Dependency Injection** - Loose coupling and testability
- **Fluent Validation** - Declarative validation rules
- **Mapper Pattern** - AutoMapper-like entity to DTO transformations

---

## 🛠️ Technology Stack

### Backend Framework
- **.NET 10.0** - Latest LTS framework
- **ASP.NET Core 10.0** - Web API framework

### Database & ORM
- **Microsoft SQL Server** - Relational database
- **Entity Framework Core 10.0.7** - ORM with migrations support
- **SQL Server EF Provider** - Native SQL Server integration

### Authentication & Security
- **JWT (JSON Web Tokens)** - Token-based authentication
- **BCrypt.Net-Next 4.1.0** - Password hashing and verification
- **System.IdentityModel.Tokens.Jwt 8.17.0** - JWT creation and validation
- **Microsoft.AspNetCore.Authentication.JwtBearer 10.0.7** - JWT authentication middleware

### Real-Time Communication
- **SignalR 10.0.7** - Real-time push notifications
- **SignalR Hubs** - Bi-directional communication channels

### File Storage & Media
- **Cloudinary 1.28.0** - Cloud-based image hosting and CDN
- **CloudinaryDotNet** - .NET SDK for Cloudinary

### Email & Communication
- **MailKit 4.16.0** - SMTP email client
- **MimeKit 4.16.0** - MIME message creation and parsing
- **SMTP Gmail Integration** - Email verification and password reset notifications

### Validation & Mapping
- **FluentValidation 12.1.1** - Fluent validation library
- **FluentValidation.DependencyInjectionExtensions 12.1.1** - DI integration

### Logging & Monitoring
- **Serilog 10.0.0** - Structured logging framework
- **Serilog.AspNetCore** - ASP.NET Core integration
- **Serilog.Sinks.Console** - Console output sink
- **Serilog.Sinks.File 8.0.0** - File-based logging with rolling intervals
- **Serilog.Enrichers.Environment** - Environment context enrichment
- **Serilog.Settings.Configuration** - Configuration-driven setup

### API Documentation
- **Swagger/OpenAPI** - API specification and interactive documentation
- **Scalar 2.14.8** - Beautiful Scalar UI for API exploration

### Additional Libraries
- **Microsoft.AspNetCore.Http** - HTTP context utilities
- **Microsoft.Extensions.Configuration** - Configuration management
- **Microsoft.Extensions.DependencyInjection** - Service container
- **Microsoft.Extensions.Logging** - Logging abstractions
- **Microsoft.Extensions.Options** - Configuration options pattern

---

## 📁 Project Structure

### Ecomm.Domain (Core Business Logic)
```
Ecomm.Domain/
├── Common/
│   └── BaseEntity.cs              # Base class for all entities
├── Entities/
│   ├── User.cs                    # User/Customer entity
│   ├── Product.cs                 # Product entity
│   ├── Category.cs                # Product category
│   ├── Order.cs                   # Customer order
│   ├── OrderItem.cs               # Order line items
│   ├── Cart.cs                    # Shopping cart
│   ├── CartItem.cs                # Cart items
│   ├── Address.cs                 # Shipping address
│   ├── ProductImage.cs            # Product images
│   └── RefreshToken.cs            # JWT refresh tokens
└── Enums/
    ├── UserRole.cs                # Admin, Customer roles
    ├── OrderStatus.cs             # Pending, Shipped, Delivered
    ├── PaymentStatus.cs           # Pending, Completed, Failed
    └── PaymentMethod.cs           # COD, Card, etc.
```

### Ecomm.Application (Business Logic Layer)
```
Ecomm.Application/
├── Services/
│   ├── AuthService.cs             # Authentication & registration
│   ├── UserService.cs             # User management
│   ├── ProductService.cs          # Product CRUD operations
│   ├── ProductImageService.cs     # Image management
│   ├── CategoryService.cs         # Category management
│   ├── CartService.cs             # Shopping cart operations
│   ├── OrderService.cs            # Order processing
│   ├── AddressService.cs          # Address management
│   ├── AdminOrderService.cs       # Admin order functions
│   ├── AdminAnalyticsService.cs   # Sales analytics
│   ├── AdminUserAnalyticsService.cs # User analytics
│   └── CurrentUserService.cs      # Get current authenticated user
├── Interfaces/
│   ├── Services/                  # Service contracts
│   └── Repositories/              # Repository contracts
├── DTOs/
│   ├── Auth/                      # Request/Response DTOs
│   ├── Product/
│   ├── Category/
│   ├── Order/
│   ├── Cart/
│   ├── User/
│   ├── Address/
│   └── Admin/
├── Validators/                    # FluentValidation rules
├── Mappings/                      # Entity-to-DTO mappings
└── Common/
    ├── ApiResponse.cs             # Standard API response format
    ├── BadRequestException.cs      # Custom exceptions
    ├── NotFoundException.cs
    ├── UnauthorizedException.cs
    └── PagedResult.cs             # Pagination support
```

### Ecomm.Infrastructure (Data Access & External Services)
```
Ecomm.Infrastructure/
├── Persistence/
│   ├── AppDbContext.cs            # EF Core DbContext
│   └── DbSeeder.cs                # Database seeding
├── Repositories/
│   ├── Repository.cs              # Generic repository
│   ├── UserRepository.cs          # User-specific queries
│   ├── ProductRepository.cs       # Product-specific queries
│   ├── CategoryRepository.cs
│   ├── OrderRepository.cs
│   ├── CartRepository.cs
│   ├── AddressRepository.cs
│   ├── RefreshTokenRepository.cs
│   └── UnitOfWork.cs              # Transaction management
├── Service/
│   ├── PasswordHasher.cs          # BCrypt password hashing
│   ├── TokenService.cs            # JWT token generation
│   ├── JwtSettings.cs             # JWT configuration
│   ├── EmailSender.cs             # SMTP email service
│   ├── EmailOtpService.cs         # OTP generation & validation
│   ├── CloudinaryFileStorageService.cs # Image upload service
│   ├── CloudinarySettings.cs
│   └── SmtpSettings.cs
├── Configurations/                # EF Core entity configurations
└── Migrations/                    # Database migrations
```

### Ecomm.Api (Presentation/API Layer)
```
Ecomm.Api/
├── Controllers/
│   ├── AuthController.cs          # Auth endpoints
│   ├── UserController.cs          # User profile endpoints
│   ├── ProductController.cs       # Product endpoints
│   ├── CategoriesController.cs    # Category endpoints
│   ├── CartController.cs          # Cart endpoints
│   ├── OrdersController.cs        # Order endpoints
│   ├── AddressesController.cs     # Address endpoints
│   ├── AdminOrdersController.cs   # Admin order management
│   ├── AdminAnalyticsController.cs # Analytics endpoints
│   ├── AdminProductImagesController.cs # Image management
│   └── AdminUserAnalyticsController.cs # User analytics
├── Hubs/
│   ├── NotificationsHub.cs        # Admin notifications
│   └── ProductsHub.cs             # Product updates
├── Middleware/
│   ├── GlobalExceptionMiddleware.cs # Exception handling
│   └── ValidationExceptionHandler.cs # Validation error handling
├── Extensions/
│   └── ClaimsPrincipleExtensions.cs # Claims helpers
├── RealTime/
│   └── SignalRRealtimeNotifier.cs # Real-time notification service
├── Program.cs                     # Application startup config
├── appsettings.json               # Configuration
└── appsettings.Development.json   # Development settings
```

---

## ⭐ Key Features

### Authentication & Security
- ✅ **JWT-based Authentication** - Secure token-based identity
- ✅ **Email Verification** - OTP-based email verification
- ✅ **Password Reset** - Secure password reset with email links
- ✅ **Refresh Token Strategy** - Token rotation for security
- ✅ **Password Hashing** - BCrypt encryption for passwords
- ✅ **Role-Based Access Control** - Admin and Customer roles
- ✅ **Token Revocation** - Invalidate tokens on password change

### User Management
- ✅ **User Registration** - New account creation with validation
- ✅ **User Profile** - Manage user information
- ✅ **Multiple Addresses** - Support for multiple shipping addresses
- ✅ **Order History** - View user's past orders

### Product Management
- ✅ **Product CRUD** - Create, read, update, delete products
- ✅ **Product Images** - Multiple images per product with Cloudinary CDN
- ✅ **Categories** - Organize products by categories
- ✅ **Stock Management** - Track inventory and reorder levels
- ✅ **Pricing** - Regular and discount pricing support
- ✅ **Product Filtering** - Search and filter by category

### Shopping Cart
- ✅ **Add/Remove Items** - Manage cart items
- ✅ **Real-Time Updates** - Live cart syncing via SignalR
- ✅ **Quantity Management** - Adjust item quantities
- ✅ **Persistent Cart** - Save cart state per user

### Order Management
- ✅ **Create Orders** - Place orders from cart
- ✅ **Order Tracking** - Track order status (Pending, Shipped, Delivered)
- ✅ **Payment Methods** - Support COD and card payments
- ✅ **Shipping Address Snapshot** - Store order-time address
- ✅ **Order Items** - Detailed line items with pricing

### Admin Features
- ✅ **Order Management** - View, update, and manage all orders
- ✅ **Sales Analytics** - Track revenue and order metrics
- ✅ **User Analytics** - Monitor user registration and activity
- ✅ **Product Management** - Admin-only product operations
- ✅ **Image Upload** - Direct Cloudinary integration

### Real-Time Features
- ✅ **SignalR Hubs** - Real-time bidirectional communication
- ✅ **Order Notifications** - Live order status updates
- ✅ **Product Updates** - Real-time inventory changes
- ✅ **Admin Notifications** - Real-time admin alerts

### API Features
- ✅ **Pagination** - Paginated list responses
- ✅ **Error Handling** - Centralized exception handling
- ✅ **Validation** - FluentValidation with detailed error messages
- ✅ **Logging** - Structured logging with Serilog
- ✅ **CORS** - Configurable cross-origin policies
- ✅ **API Documentation** - Swagger/OpenAPI with Scalar UI

---

## 💾 Database Schema

### Core Entities

#### User
- **Properties**: Id, FullName, Email, PasswordHash, Role, IsActive, IsEmailVerified, PasswordChangedAtUtc
- **OTP Verification**: EmailOtpHash, EmailOtpExpiresAtUtc, EmailOtpAttempts
- **Password Reset**: PasswordResetTokenHash, PasswordResetTokenExpiresAtUtc, PasswordResetAttempts
- **Relations**: HasMany RefreshTokens, HasMany Addresses, HasOne Cart, HasMany Orders

#### Product
- **Properties**: Id, Name, SKU, Description, Price, DiscountPrice, QuantityInStock, ReorderLevel, IsActive
- **Relations**: HasOne Category, HasMany ProductImages, HasMany CartItems, HasMany OrderItems

#### Category
- **Properties**: Id, Name, Description, IsActive
- **Relations**: HasMany Products

#### Order
- **Properties**: Id, OrderNumber, UserId, AddressId, Subtotal, DiscountAmount, ShippingFee, TotalAmount, PaymentMethod, PaymentStatus, OrderStatus
- **Shipping Details**: ShippingFullName, ShippingPhoneNumber, ShippingLine1/2, ShippingCity/State/PostalCode/Country (snapshot)
- **Relations**: BelongsTo User, BelongsTo Address, HasMany OrderItems

#### Cart
- **Properties**: Id, UserId
- **Relations**: BelongsTo User, HasMany CartItems

#### Address
- **Properties**: Id, UserId, FullName, PhoneNumber, Line1, Line2, City, State, PostalCode, Country, IsDefault
- **Relations**: BelongsTo User, HasMany Orders

#### ProductImage
- **Properties**: Id, ProductId, ImageUrl, PublicId (Cloudinary), AltText
- **Relations**: BelongsTo Product

#### RefreshToken
- **Properties**: Id, UserId, Token, ExpirationDateUtc, IsRevoked
- **Relations**: BelongsTo User

### Enums

- **UserRole**: Admin, Customer
- **OrderStatus**: Pending, Processing, Shipped, Delivered, Cancelled
- **PaymentStatus**: Pending, Completed, Failed
- **PaymentMethod**: COD (Cash on Delivery), Card, Others

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - User login
POST   /api/auth/refresh-token         - Refresh access token
POST   /api/auth/verify-email-otp      - Verify OTP
POST   /api/auth/resend-email-otp      - Resend OTP
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password        - Reset password
```

### User Endpoints
```
GET    /api/users/profile              - Get current user profile
PUT    /api/users/profile              - Update user profile
GET    /api/users/                     - Get all users (Admin)
PUT    /api/users/{id}/role            - Update user role (Admin)
```

### Product Endpoints
```
GET    /api/products                   - Get all products (paginated)
POST   /api/products                   - Create product (Admin)
GET    /api/products/{id}              - Get product details
PUT    /api/products/{id}              - Update product (Admin)
DELETE /api/products/{id}              - Delete product (Admin)
GET    /api/products/category/{categoryId} - Get products by category
```

### Category Endpoints
```
GET    /api/categories                 - Get all categories
POST   /api/categories                 - Create category (Admin)
GET    /api/categories/{id}            - Get category details
PUT    /api/categories/{id}            - Update category (Admin)
DELETE /api/categories/{id}            - Delete category (Admin)
```

### Cart Endpoints
```
GET    /api/cart                       - Get user's cart
POST   /api/cart/items                 - Add item to cart
PUT    /api/cart/items/{itemId}        - Update cart item quantity
DELETE /api/cart/items/{itemId}        - Remove item from cart
DELETE /api/cart                       - Clear entire cart
```

### Order Endpoints
```
POST   /api/orders                     - Create/place order
GET    /api/orders                     - Get user's orders
GET    /api/orders/{id}                - Get order details
PUT    /api/orders/{id}/status         - Update order status (Admin)
```

### Address Endpoints
```
GET    /api/addresses                  - Get user's addresses
POST   /api/addresses                  - Create new address
PUT    /api/addresses/{id}             - Update address
DELETE /api/addresses/{id}             - Delete address
```

### Admin Endpoints
```
GET    /api/admin/orders               - Get all orders
PUT    /api/admin/orders/{id}          - Manage order status
GET    /api/admin/analytics/sales      - Sales analytics
GET    /api/admin/analytics/users      - User analytics
POST   /api/admin/products/{id}/images - Upload product images
DELETE /api/admin/products/{id}/images/{imageId} - Delete image
```

### SignalR Hubs
```
/hubs/notifications                    - Admin notifications
/hubs/products                         - Product updates
```

---

## 🚀 Setup & Installation

### Prerequisites
- **.NET 10.0 SDK** - Download from [microsoft.com](https://dotnet.microsoft.com/download)
- **SQL Server 2022** or later - Download from [microsoft.com](https://www.microsoft.com/en-us/sql-server/sql-server-2022)
- **Visual Studio 2022** or **JetBrains Rider** - Recommended IDEs
- **Git** - For version control

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Backend
```

### Step 2: Install Dependencies
```bash
# Navigate to API project
cd Ecomm.Api

# Restore NuGet packages
dotnet restore
```

### Step 3: Database Setup

#### Create Database
```bash
# Apply migrations to create database
dotnet ef database update --project ../Ecomm.Infrastructure --startup-project .
```

#### Or Create Manually in SQL Server
```sql
CREATE DATABASE PosSystemDb;
GO
USE PosSystemDb;
GO
-- Tables will be created by Entity Framework migrations
```

### Step 4: Configure Application Settings
Edit `appsettings.json` with your settings (see Configuration section below).

### Step 5: Run Application
```bash
# Run the API
dotnet run

# API will be available at:
# https://localhost:7291
# Swagger UI: https://localhost:7291/openapi/v1.json
# Scalar UI: https://localhost:7291/scalar/v1
```

---

## ⚙️ Configuration

### appsettings.json Configuration

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=PosSystemDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "Issuer": "PosSystem.Api",
    "Audience": "PosSystem.Client",
    "SecretKey": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "AccessTokenExpiryMinutes": 30,
    "RefreshTokenExpiryDays": 7
  },
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret",
    "Folder": "ecomm/products"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  },
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password",
    "FromEmail": "noreply@ecommerce.com",
    "FromName": "E-Commerce",
    "EnableSsl": true
  },
  "Serilog": {
    "MinimumLevel": { "Default": "Information" },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "Logs/log-.txt",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 14
        }
      }
    ]
  }
}
```

### Environment Variables

Set these environment variables for security:
```bash
# JWT
JWT_SECRET_KEY=your-secret-key-min-32-chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_PASSWORD=your-app-password

# Database
DB_CONNECTION_STRING=Server=.;Database=PosSystemDb;...
```

### Key Configuration Points

| Setting | Description | Example |
|---------|-------------|---------|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string | `Server=.;Database=PosSystemDb;` |
| `JwtSettings:SecretKey` | JWT signing key (min 32 chars) | Long random string |
| `JwtSettings:AccessTokenExpiryMinutes` | Token expiration time | 30 (minutes) |
| `JwtSettings:RefreshTokenExpiryDays` | Refresh token validity | 7 (days) |
| `Cloudinary:*` | Image hosting credentials | Cloudinary account details |
| `Cors:AllowedOrigins` | Frontend URLs allowed | Frontend URLs |
| `Smtp:*` | Email configuration | Gmail SMTP settings |

---

## 🔐 Authentication & Authorization

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "Customer",
  "pwd_changed": "2026-04-30T10:00:00Z",
  "iat": 1704067200,
  "exp": 1704068800
}
```

### Token Flow

1. **Login** → Generate Access Token (30 min) + Refresh Token (7 days)
2. **Authenticated Request** → Include `Authorization: Bearer <token>`
3. **Token Expiry** → Use Refresh Token to get new Access Token
4. **Password Change** → All tokens invalidated, must re-login

### Role-Based Access Control

```csharp
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase { }

[Authorize(Roles = "Customer")]
public class CartController : ControllerBase { }

[AllowAnonymous]
public class AuthController : ControllerBase { }
```

### Token Validation Features

- ✅ Signature verification
- ✅ Expiration check
- ✅ Issuer validation
- ✅ Audience validation
- ✅ Password change validation (token revocation)

---

## 📡 Real-Time Features

### SignalR Implementation

#### NotificationsHub
- **Route**: `/hubs/notifications`
- **Authorization**: Admin only
- **Purpose**: Admin notifications and alerts

#### ProductsHub
- **Route**: `/hubs/products`
- **Public**: Open to all users
- **Purpose**: Real-time product updates and inventory changes

### Real-Time Notifications
```csharp
// Server-side: Send notification
await _realtimeNotifier.NotifyOrderStatusChangedAsync(orderId, newStatus);

// Client-side: Receive notification
connection.on("orderStatusChanged", (orderId, status) => {
    console.log(`Order ${orderId} status: ${status}`);
});
```

### Connection Management
- Auto-reconnection on disconnect
- User identification via JWT in SignalR
- Role-based access to hubs
- Graceful shutdown handling

---

## ⚠️ Error Handling & Logging

### Built-in Exception Handlers

**Global Exception Middleware:**
- Catches all unhandled exceptions
- Returns standardized error responses
- Includes request trace ID

**Validation Exception Handler:**
- Handles FluentValidation errors
- Returns detailed validation messages
- Prioritized before global handler

### Custom Exceptions

```csharp
// BadRequestException
throw new BadRequestException("Invalid input");

// NotFoundException
throw new NotFoundException("Product not found");

// UnauthorizedException
throw new UnauthorizedException("Invalid credentials");
```

### Logging with Serilog

**Configuration:**
- Console output in development
- File-based rolling logs (daily)
- Structured logging with context enrichment
- Environment and thread ID tracking

**Log Levels:**
- `Information` - General application flow
- `Warning` - Potentially harmful situations
- `Error` - Error events of considerable importance
- `Fatal` - Very severe error events

**Log Location:**
```
Logs/log-YYYYMMDD.txt
```

### Standard API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* entity data */ },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "email": ["Email is required"]
  }
}
```

---

## 🔄 Development Workflow

### Project Development Cycle

#### 1. **Design Phase**
- Define entities in `Ecomm.Domain/Entities`
- Create enums in `Ecomm.Domain/Enums`

#### 2. **Data Access Layer**
- Create repository interfaces in `Ecomm.Application/Interfaces/Repositories`
- Implement repositories in `Ecomm.Infrastructure/Repositories`
- Add EF Core configurations in `Ecomm.Infrastructure/Configurations`

#### 3. **Business Logic Layer**
- Create service interfaces in `Ecomm.Application/Interfaces/Services`
- Implement services in `Ecomm.Application/Services`
- Add validators in `Ecomm.Application/Validators`
- Create DTOs in `Ecomm.Application/DTOs`

#### 4. **Presentation Layer**
- Create controllers in `Ecomm.Api/Controllers`
- Add endpoints following REST conventions
- Implement error handling

#### 5. **Database Migration**
```bash
# Add migration
dotnet ef migrations add MigrationName --project ../Ecomm.Infrastructure --startup-project .

# Update database
dotnet ef database update --project ../Ecomm.Infrastructure --startup-project .
```

### Directory Naming Conventions

| Layer | Convention | Example |
|-------|-----------|---------|
| Controllers | `{Feature}Controller.cs` | `ProductController.cs` |
| Services | `{Feature}Service.cs` | `ProductService.cs` |
| Repositories | `{Feature}Repository.cs` | `ProductRepository.cs` |
| Validators | `{Feature}Validator.cs` | `CreateProductValidator.cs` |
| DTOs | `{Feature}DTO.cs` | `CreateProductDTO.cs` |
| Entities | `{Feature}.cs` | `Product.cs` |

### Dependency Injection Registration

**Application Layer** (`Ecomm.Application/DependencyInjection.cs`):
```csharp
services.AddScoped<IProductService, ProductService>();
services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
```

**Infrastructure Layer** (`Ecomm.Infrastructure/DependencyInjection.cs`):
```csharp
services.AddScoped<IProductRepository, ProductRepository>();
services.AddScoped<IPasswordHasher, PasswordHasher>();
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
```

**API Layer** (`Ecomm.Api/Program.cs`):
```csharp
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
```

---

## 🔧 Common Tasks

### Adding a New Feature

1. **Create Entity** in `Ecomm.Domain/Entities/MyFeature.cs`
2. **Add DbSet** in `Ecomm.Infrastructure/Persistence/AppDbContext.cs`
3. **Create Migration**: `dotnet ef migrations add AddMyFeature`
4. **Create Repository** in `Ecomm.Infrastructure/Repositories/MyFeatureRepository.cs`
5. **Create Service** in `Ecomm.Application/Services/MyFeatureService.cs`
6. **Create DTOs** in `Ecomm.Application/DTOs/MyFeature/`
7. **Create Validators** in `Ecomm.Application/Validators/`
8. **Create Controller** in `Ecomm.Api/Controllers/MyFeatureController.cs`
9. **Register DI** in respective DependencyInjection.cs files

### Upload Product Images to Cloudinary

```csharp
var service = serviceProvider.GetRequiredService<IFileStorageService>();
var result = await service.UploadImageAsync(imageStream, "folder/subfolder");
// Returns: { PublicId, SecureUrl }
```

### Send Email Notifications

```csharp
var emailSender = serviceProvider.GetRequiredService<IEmailSender>();
await emailSender.SendEmailAsync(
    to: "user@example.com",
    subject: "Order Confirmation",
    htmlContent: "<h1>Order placed successfully</h1>"
);
```

### Generate JWT Tokens

```csharp
var tokenService = serviceProvider.GetRequiredService<ITokenService>();
var token = tokenService.GenerateAccessToken(user);
var refreshToken = tokenService.GenerateRefreshToken();
```

---

## 📊 Database Migrations

### View Migration History
```bash
dotnet ef migrations list --project ../Ecomm.Infrastructure --startup-project .
```

### Revert to Previous Migration
```bash
dotnet ef database update PreviousMigrationName --project ../Ecomm.Infrastructure --startup-project .
```

### Remove Last Migration
```bash
dotnet ef migrations remove --project ../Ecomm.Infrastructure --startup-project .
```

### Generate SQL Script
```bash
dotnet ef migrations script FromMigration ToMigration --output migration.sql --project ../Ecomm.Infrastructure --startup-project .
```

---

## 🧪 Testing Endpoints

### Using cURL

**Register User:**
```bash
curl -X POST https://localhost:7291/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**
```bash
curl -X POST https://localhost:7291/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Get Protected Resource:**
```bash
curl -X GET https://localhost:7291/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman
1. Import Swagger spec: `https://localhost:7291/openapi/v1.json`
2. Create environment with `baseUrl` variable
3. Use `{{baseUrl}}/api/...` in requests
4. Set Bearer token in Authorization tab

### Using Swagger UI
1. Navigate to `https://localhost:7291/swagger`
2. Authorize with JWT token
3. Try out endpoints directly in browser

---

## 📈 Performance Considerations

### Database Optimization
- ✅ Indexed queries on frequently searched columns
- ✅ Eager loading with `.Include()` to avoid N+1 queries
- ✅ Pagination for list endpoints (default 10 items/page)
- ✅ Query optimization in repository implementations

### Caching Strategies
- Consider Redis for product catalog caching
- Cache frequently accessed categories
- Implement SignalR for real-time cache invalidation

### Async/Await
- All I/O operations are asynchronous
- Prevents thread pool starvation
- Better scalability under load

### File Storage
- Cloudinary CDN for global distribution
- Automatic image optimization
- Reduced server storage needs

---

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: Could not open a connection to database server
Solution: Check SQL Server is running, verify ConnectionString in appsettings.json
```

### JWT Token Validation Fails
```
Error: Token validation failed
Solutions:
- Verify SecretKey matches in issuer and validator
- Check token hasn't expired
- Ensure user account still exists
- Verify password hasn't changed
```

### Cloudinary Upload Fails
```
Error: Cloudinary upload error
Solutions:
- Verify CloudName, ApiKey, ApiSecret
- Check image file size (max 100MB)
- Ensure folder exists in Cloudinary console
```

### Email Not Sending
```
Error: SMTP authentication failed
Solutions:
- Use Gmail App Password (not regular password)
- Enable Less Secure Apps in Gmail
- Verify SMTP host and port
- Check firewall/antivirus blocking outbound SMTP
```

---

## 📞 Support & Contact

For issues or questions:
- Review API Swagger documentation at `/swagger`
- Check Serilog logs in `Logs/` directory
- Examine exception details in global exception handler
- Verify configuration in `appsettings.json`

---

## 📝 License

This project is part of the 7th Semester E-Commerce Course Project.

---

## 🎯 Summary

This e-commerce backend provides a robust, scalable foundation for modern e-commerce applications. Built with industry best practices, Clean Architecture, and Domain-Driven Design, it offers:

- **Security** - JWT authentication with refresh tokens
- **Real-time** - SignalR for live updates
- **Scalability** - Layered architecture supporting growth
- **Maintainability** - Clear separation of concerns
- **Quality** - Comprehensive error handling and logging
- **Documentation** - Swagger/OpenAPI specifications

Start building your e-commerce platform today! 🚀

