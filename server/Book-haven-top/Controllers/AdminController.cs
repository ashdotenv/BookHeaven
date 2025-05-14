using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")] // Optional: Restrict to admin role
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts()
        {
            var userCount = await _context.Users.CountAsync();
            var bookCount = await _context.Books.CountAsync();
            var orderCount = await _context.Orders.CountAsync();

            return Ok(new
            {
                users = userCount,
                books = bookCount,
                orders = orderCount
            });
        }
    }
}
