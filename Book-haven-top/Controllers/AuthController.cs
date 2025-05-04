using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return BadRequest(new { Errors = errors });
        }

        // Check if username or email already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == registrationDto.Username || u.Email == registrationDto.Email);
        if (existingUser != null)
        {
            return BadRequest(new { Message = "Username or Email already exists" });
        }

        // Implement registration logic here
        var user = new User
        {
            Username = registrationDto.Username,
            PasswordHash = HashPassword(registrationDto.Password), // Implement password hashing
            Email = registrationDto.Email,
            Role = registrationDto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "User registered successfully" });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return BadRequest(new { Errors = errors });
        }

        // Implement login logic here
        return Ok(new { Token = "your_jwt_token_here" });
    }

    private string HashPassword(string password)
    {
        // Implement password hashing logic
        return password; // Placeholder
    }
}