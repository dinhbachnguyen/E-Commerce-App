using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
  private readonly AppDbContext _context;
  public UserController(AppDbContext context) => _context = context;

  // Protected route — only accessible if JWT token is valid
  [Authorize]
  [HttpGet("profile")]
  public IActionResult GetProfile()
  {
    // Get user ID from JWT claims
    var userId = User.FindFirst("id")?.Value;

    // Optionally fetch user info from database
    var user = _context.Users.FirstOrDefault(u => u.Id.ToString() == userId);
    if (user == null) return NotFound("User not found");

    return Ok(new
    {
      Id = user.Id,
      Email = user.Email
    });
  }
}
