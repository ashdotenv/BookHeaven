using Book_haven_top.Models;
using Book_haven_top.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/purchase")]
    [Authorize(Roles = "User")]
    public class PurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PurchaseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPut("verify-purchase")]
        public async Task<IActionResult> VerifyPurchase([FromBody] ProcessPurchaseDto dto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return BadRequest("User ID not found in token");
            int userId;
            if (!int.TryParse(userIdClaim, out userId))
                return BadRequest("Invalid user ID in token");
            if (userId != dto.UserId)
                return Forbid();
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.UserId == dto.UserId && o.ClaimCode == dto.ClaimCode && o.Status == "Pending");
            if (order == null) return NotFound("Order not found or already processed.");
            order.Status = "Completed";
            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}