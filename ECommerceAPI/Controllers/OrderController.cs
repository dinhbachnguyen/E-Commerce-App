//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims; 

//[ApiController]
//[Route("api/[controller]")]
//[Authorize]
//public class OrderController : ControllerBase
//{
//  private readonly AppDbContext _context;
//  public OrderController(AppDbContext context) => _context = context;

//  [HttpPost]
//  public IActionResult CreateOrder([FromBody] OrderRequest request)
//  {
//    if (request.Items == null || !request.Items.Any())
//      return BadRequest("Order items are required.");

//    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

//    var order = new Order
//    {
//      UserId = userId,
//      OrderDate = DateTime.UtcNow,
//      Items = request.Items.Select(i => new OrderItem
//      {
//        ProductId = i.productId,
//        Quantity = i.quantity
//      }).ToList()
//    };

//    _context.Orders.Add(order);
//    _context.SaveChanges();

//    return Ok(new { message = "Order placed successfully", orderId = order.Id });
//  }
//}

//public class OrderRequest
//{
//  public List<CartItemDto> Items { get; set; } = new();
//}

//public class CartItemDto
//{
//  public int productId { get; set; }
//  public int quantity { get; set; }
//}
