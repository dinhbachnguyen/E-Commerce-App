using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<User> Users { get; set; } = null!;
  public DbSet<Product> Products { get; set; } = null!;
  public DbSet<CartItem> CartItems { get; set; } = null!;
  //public DbSet<OrderItem> OrderItems { get; set; } = null!;

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    // Seed sample products
    modelBuilder.Entity<Product>().HasData(
        new Product
        {
          Id = 1,
          Name = "Gaming Laptop",
          Description = "High performance laptop with RTX graphics and 16GB RAM.",
          Price = 1299.99M,
          ImageUrl = "gaming-laptop.jpg"
        },
        new Product
        {
          Id = 2,
          Name = "Wireless Headphones",
          Description = "Noise-cancelling over-ear headphones with long battery life.",
          Price = 199.99M,
          ImageUrl = "wireless-headphones.jpg"
        },
        new Product
        {
          Id = 3,
          Name = "Smartphone",
          Description = "Latest model smartphone with OLED display and 128GB storage.",
          Price = 899.99M,
          ImageUrl = "smartphone.jpg"
        },
        new Product
        {
          Id = 4,
          Name = "Mechanical Keyboard",
          Description = "RGB backlit mechanical keyboard with customizable keys.",
          Price = 129.99M,
          ImageUrl = "mechanical-keyboard.jpg"
        },
        new Product
        {
          Id = 5,
          Name = "Smartwatch",
          Description = "Modern smartwatch with notifications and tracking.",
          Price = 249.99M,
          ImageUrl = "smartwatch.jpg"
        },
        new Product
        {
          Id = 6,
          Name = "4K Monitor",
          Description = "Ultra HD 27-inch monitor with vibrant colors and slim design.",
          Price = 399.99M,
          ImageUrl = "4k-monitor.jpg"
        }
    );

    //modelBuilder.Entity<CartItem>()
    //.HasOne(c => c.Product)
    //.WithMany()
    //.HasForeignKey(c => c.ProductId);

    // Configure decimal precision for Price
    //modelBuilder.Entity<Product>()
    //    .Property(p => p.Price)
    //    .HasPrecision(18, 2);

    base.OnModelCreating(modelBuilder);
  }
}
