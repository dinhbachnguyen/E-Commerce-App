using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public AuthController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpPost("register")]
  public IActionResult Register(RegisterDto dto)
  {
    var userExists = _context.Users.Any(u => u.Email == dto.Email);
    if (userExists) return BadRequest("Email already taken");

    var user = new User
    {
      Email = dto.Email,
      Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
    };

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok("User created");
  }

  [HttpPost("login")]
  public IActionResult Login(LoginDto dto)
  {
    var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
    if (user == null) return Unauthorized("User not found");

    if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
      return Unauthorized("Invalid password");

    var token = GenerateJwtToken(user);
    return Ok(new { token });
  }

  private string GenerateJwtToken(User user)
  {
    var claims = new[]
    {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim("id", user.Id.ToString())
        };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}


//[HttpPost("login")]
//public IActionResult Login([FromBody] LoginRequest request)
//{
//  var user = _context.Users.SingleOrDefault(u => u.Email == request.Email);
//  if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
//    return Unauthorized();

//  var tokenHandler = new JwtSecurityTokenHandler();
//  var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);
//  var tokenDescriptor = new SecurityTokenDescriptor
//  {
//    Subject = new ClaimsIdentity(new Claim[]
//      {
//              new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//              new Claim(ClaimTypes.Email, user.Email)
//      }),
//    Expires = DateTime.UtcNow.AddHours(2),
//    SigningCredentials = new SigningCredentials(
//          new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
//  };

//  var token = tokenHandler.CreateToken(tokenDescriptor);
//  return Ok(new { token = tokenHandler.WriteToken(token) });
//}


//public class LoginRequest
//{
//  public string Email { get; set; } = string.Empty;
//  public string Password { get; set; } = string.Empty;
//}
