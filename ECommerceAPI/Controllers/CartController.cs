using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
  private readonly AppDbContext _context;

  public CartController(AppDbContext context)
  {
    _context = context;
  }

  [HttpGet("{userId}")]
  public async Task<IActionResult> GetCart(int userId)
  {
    var items = await _context.CartItems
        .Where(c => c.UserId == userId)
        .Include(c => c.Product)
        .ToListAsync();

    return Ok(items);
  }


  [HttpPost("add")]
  public async Task<IActionResult> AddToCart([FromBody] CartItem item)
  {

    //Console.WriteLine($"Received ProductId: {item.ProductId}");
    //Console.WriteLine($"Received UserId: {item.UserId}");
    //Console.WriteLine($"Quantity: {item.Quantity}");

    if (item.UserId <= 0 || item.ProductId <= 0)
      return BadRequest("Invalid UserId or ProductId");

    var product = await _context.Products.FindAsync(item.ProductId);
    if (product == null)
      return BadRequest("Product does not exist");

    var existing = await _context.CartItems
        .FirstOrDefaultAsync(c =>
            c.UserId == item.UserId &&
            c.ProductId == item.ProductId);

    if (existing != null)
    {
      existing.Quantity += item.Quantity;
    }
    else
    {
      _context.CartItems.Add(item);
    }

    await _context.SaveChangesAsync();
    return Ok(item); // return the item for confirmation
  }


  [HttpDelete("{productId}/{userId}")]
  public async Task<IActionResult> RemoveCartItem(int productId, int userId)
  {
    var item = await _context.CartItems
        .FirstOrDefaultAsync(c => c.ProductId == productId && c.UserId == userId);
    if (item == null) return NotFound();

    _context.CartItems.Remove(item);
    await _context.SaveChangesAsync();

    return Ok();
  }


  [HttpDelete("clear/{userId}")]
  public async Task<IActionResult> ClearCart(int userId)
  {
    var items = _context.CartItems.Where(c => c.UserId == userId);
    _context.CartItems.RemoveRange(items);
    await _context.SaveChangesAsync();

    return Ok();
  }

  [HttpPut("update")]
  public async Task<IActionResult> UpdateCartItem([FromBody] CartItem updatedItem)
  {
    var item = await _context.CartItems
        .FirstOrDefaultAsync(c => c.UserId == updatedItem.UserId && c.ProductId == updatedItem.ProductId);

    if (item == null)
      return NotFound("Cart item not found");

    item.Quantity = updatedItem.Quantity;
    await _context.SaveChangesAsync();

    return Ok(item);
  }



  //[HttpPost("add")]
  //public async Task<IActionResult> AddToCart(CartItem item)
  //{
  //  var existing = await _context.CartItems
  //      .FirstOrDefaultAsync(c =>
  //          c.UserId == item.UserId &&
  //          c.ProductId == item.ProductId);

  //  if (existing != null)
  //  {
  //    existing.Quantity += item.Quantity;
  //  }
  //  else
  //  {
  //    _context.CartItems.Add(item);
  //  }

  //  await _context.SaveChangesAsync();
  //  return Ok();
  //}
}
