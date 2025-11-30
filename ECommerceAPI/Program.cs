using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=ecommerce.db"));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// CORS
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngularApp", policy =>
  {
    policy.WithOrigins("http://localhost:4200", "https://ecommerce-app.bachnguyen.website")
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
              Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
      };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();



//using (var scope = app.Services.CreateScope())
//{
//  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//  if (!db.Products.Any())
//  {
//    db.Products.AddRange(
//        new Product { Name = "Laptop", Description = "Gaming Laptop", Price = 1299.99M },
//        new Product { Name = "Headphones", Description = "Wireless Headphones", Price = 199.99M }
//    );
//    db.SaveChanges();
//  }
//}
