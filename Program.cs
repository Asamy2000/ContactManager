using ContactsSystem.Core.Interfaces.Iservice;
using ContactsSystem.Core.Validators;
using ContactsSystem.Infrastructure.Data;
using ContactsSystem.Infrastructure.Services;
using ContactsSystem.Hubs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//  Add Services
ConfigureServices(builder.Services, builder.Configuration);

//  Build app
var app = builder.Build();

//  Configure Middleware
ConfigureMiddleware(app);

//  Run app
app.Run();


// ========== CONFIGURATION METHODS ==========

void ConfigureServices(IServiceCollection services, IConfiguration config)
{
    // Validation
    services.AddValidatorsFromAssemblyContaining<ContactValidator>();

    // Controllers + Auth Filter
    services.AddControllersWithViews(options =>
    {
        options.Filters.Add(new AuthorizeFilter("AuthenticatedUser"));
    });

    // Database
    services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(
            config.GetConnectionString("DefaultConnection"),
            sqlOptions => sqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)
        )
    );

    // Authentication
    services.AddAuthentication("HardcodedAuth")
        .AddCookie("HardcodedAuth", options =>
        {
            options.Cookie.Name = "ContactsSystem.Auth";
            options.LoginPath = "/Account/Login";
            options.AccessDeniedPath = "/Account/AccessDenied";
            options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
            options.SlidingExpiration = true;
        });

    // Authorization
    services.AddAuthorizationBuilder()
        .AddPolicy("AuthenticatedUser", policy =>
            policy.RequireAuthenticatedUser());

    // SignalR
    services.AddSignalR();

    // Dependency Injection
    services.AddScoped<IAuthService, HardcodedAuthService>();
    services.AddScoped<IContactService, ContactService>();
}

void ConfigureMiddleware(WebApplication app)
{
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    // Static Files
    app.MapStaticAssets();

    // MVC Routing
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}"
    ).WithStaticAssets();

    // SignalR
    app.MapHub<ContactHub>("/contactHub");
}
