using System.Security.Claims;
using System.Text;
using Ecomm.Api.Hubs;
using Ecomm.Api.MIddleware;
using Ecomm.Api.RealTime;
using Ecomm.Application;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Infrastructure;
using Ecomm.Infrastructure.Persistence;
using Ecomm.Infrastructure.Service;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
    };
});

// serilog config
builder.Host.UseSerilog((ctx, lc) =>
    lc.ReadFrom.Configuration(ctx.Configuration));

// Validation Exception Handler always before Global Exception Handler
builder.Services.AddExceptionHandler<ValidationExceptionHandler>();

// Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionMiddleware>();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<IRealtimeNotifier, SignalRRealtimeNotifier>();
builder.Services.AddSignalR();



// Swagger + JWT
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PosSystem API",
        Version = "v1"
    });

    // 🔐 Define Bearer Auth
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });
});

builder.Services.AddHttpContextAccessor();
// test otp
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));

// Custom layers
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

// JWT Config
    var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()
              ?? throw new InvalidOperationException("JwtSettings not configured.");

    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwt.Issuer,
                ValidateAudience = true,
                ValidAudience = jwt.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SecretKey)),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async ctx =>
                {
                    var userId = ctx.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var pwdChangedClaim = ctx.Principal?.FindFirst("pwd_changed")?.Value;

                    if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(pwdChangedClaim))
                    {
                        ctx.Fail("Invalid token.");
                        return;
                    }

                    var db = ctx.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                    var user = await db.Users.FindAsync(Guid.Parse(userId));

                    if (user == null)
                    {
                        ctx.Fail("User not found.");
                        return;
                    }

                    var tokenChangedAt = DateTime.Parse(pwdChangedClaim);
                    if (user.PasswordChangedAtUtc > tokenChangedAt)
                    {
                        ctx.Fail("Token expired due to password change.");
                    }
                }
            };
            
        });

    var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("FrontendPolicy", policy =>
        {
            policy.WithOrigins(corsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
             .AllowCredentials(); 
        });
    });

    builder.Services.AddAuthorization();

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    app.MapHub<NotificationsHub>("/hubs/notifications");
    app.MapHub<ProductsHub>("/hubs/products");



    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("FrontendPolicy");

    app.UseAuthentication(); // MUST be before Authorization
    app.UseAuthorization();

    app.MapControllers();
    await DbSeeder.SeedAsync(app.Services);
    app.Run();

