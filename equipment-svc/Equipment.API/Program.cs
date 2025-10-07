using Equipment.API.Extensions;
using Equipment.Data.Context;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Connect to SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Register controller (Web API)
builder.Services.AddControllers();

// Allowing API documentation and testing via Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme).AddNegotiate();

builder.Services.AddAuthorization(options =>
{
    // By default, all incoming requests will be authorized according to the default policy.
    options.FallbackPolicy = options.DefaultPolicy;
});

builder.Services.AddDependencyInjection();

builder.Services.AddHttpContextAccessor();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "Equipment.Service.Api",
            Description = "Equipment Service API",
            Version = "v1",
        }
    );
});

builder.Services.AddCors(p =>
    p.AddPolicy(
        "MasterKey",
        b =>
        {
            // allow all, may be set access domain
            b.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
        }
    )
);

var app = builder.Build();

app.UseCors("MasterKey");
app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Equipment.Service.Api v1");
    c.RoutePrefix = "equipment";
});

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
