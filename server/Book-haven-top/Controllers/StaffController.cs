using Book_haven_top.Models;
using Book_haven_top.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Web;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/staff")]
    [Authorize(Roles = "Admin,Staff")]
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _context;
        public StaffController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders.Where(o => o.Status != "Approved").ToListAsync();
            var encodedOrders = orders.Select(order => new {
                order,
                approveUrl = $"/api/staff/approve-purchase?orderId={HttpUtility.UrlEncode(order.Id.ToString())}",
                rejectUrl = $"/api/staff/reject-purchase?orderId={HttpUtility.UrlEncode(order.Id.ToString())}"
            });
            return Ok(encodedOrders);
        }

        [HttpPut("approve-purchase")]
        public async Task<IActionResult> ApprovePurchase([FromQuery] string orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id.ToString() == orderId);
            if (order == null) return NotFound("Order not found.");
            if (order.Status != "Pending") return BadRequest("Order is not pending or already processed.");
            order.Status = "Approved";
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPut("reject-purchase")]
        public async Task<IActionResult> RejectPurchase([FromQuery] string orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id.ToString() == orderId);
            if (order == null) return NotFound("Order not found.");
            if (order.Status != "Pending") return BadRequest("Order is not pending or already processed.");
            order.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPut("verify-purchase")]
        public async Task<IActionResult> VerifyPurchase([FromBody] ProcessPurchaseDto dto)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.UserId == dto.UserId && o.ClaimCode == dto.ClaimCode && o.Status == "Pending");
            if (order == null) return NotFound("Order not found or already processed.");
            order.Status = "Completed";
            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}