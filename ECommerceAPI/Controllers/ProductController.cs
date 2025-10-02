using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
  private readonly AppDbContext _context;
  public ProductController(AppDbContext context) => _context = context;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
      => await _context.Products.ToListAsync();

  [HttpGet("{id}")]
  public async Task<ActionResult<Product>> GetProduct(int id)
  {
    var product = await _context.Products.FindAsync(id);
    return product == null ? NotFound() : product;
  }
}
