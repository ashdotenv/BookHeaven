using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Book_haven_top.Models;
using Microsoft.AspNetCore.Authorization;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/bookorderbroadcast")]
    public class BookOrderBroadcastController : ControllerBase
    {
        private readonly AppDbContext _context;
        public BookOrderBroadcastController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("top2")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTop2Orders()
        {
            var orders = await _context.Set<Order>()
                .OrderByDescending(o => o.CreatedAt)
                .Take(2)
                .Include(o => o.Items)
                .ToListAsync();

            var userIds = orders.Select(o => o.UserId).Distinct().ToList();
            var bookIds = orders.SelectMany(o => o.Items.Select(i => i.BookId)).Distinct().ToList();

            var users = await _context.Set<User>().Where(u => userIds.Contains(u.Id)).ToListAsync();
            var books = await _context.Set<Book>().Where(b => bookIds.Contains(b.Id)).ToListAsync();

            var result = orders.Select(order => new {
                OrderId = order.Id,
                UserId = order.UserId,
                UserFullName = users.FirstOrDefault(u => u.Id == order.UserId)?.FullName,
                Books = order.Items.Select(item => new {
                    BookId = item.BookId,
                    BookTitle = books.FirstOrDefault(b => b.Id == item.BookId)?.Title,
                    Quantity = item.Quantity
                })
            });

            return Ok(result);
        }
    }
}
