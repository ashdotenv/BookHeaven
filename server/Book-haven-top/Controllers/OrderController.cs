using Book_haven_top.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Book_haven_top.Services;
using System.Security.Cryptography;
using System.Security.Claims;
using Book_haven_top.Dtos;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize(Roles = "User")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly SmtpEmailService _emailService;
        public OrderController(AppDbContext context, SmtpEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            // Get user email from token
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return BadRequest("User email not found in token");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return BadRequest("User not found");
            order.UserId = user.Id;
            // Count user's successful orders
            int successfulOrders = await _context.Orders.CountAsync(o => o.UserId == order.UserId && o.Status == "Completed");

            // Calculate discount
            decimal discount = 0m;
            int totalBooks = order.Items.Sum(i => i.Quantity);
            if (totalBooks >= 5)
                discount += 0.05m;
            if (successfulOrders > 0 && successfulOrders % 10 == 0)
                discount += 0.10m;

            // Calculate total price
            decimal total = 0m;
            foreach (var item in order.Items)
            {
                var book = await _context.Books.FindAsync(item.BookId);
                if (book == null) return BadRequest($"Book with ID {item.BookId} not found");
                total += book.Price * item.Quantity;
            }
            if (discount > 0)
                total = total * (1 - discount);
            order.TotalAmount = total;
            order.Status = "Pending";
            order.CreatedAt = DateTime.UtcNow;
            // Generate claim code
            string claimCode = GenerateClaimCode();
            order.ClaimCode = claimCode;
            _context.Orders.Add(order);
            // Remove ordered items from user's cart
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == order.UserId);
            if (cart != null && cart.BookIds != null)
            {
                var orderedBookIds = order.Items.Select(i => i.BookId).ToList();
                cart.BookIds = cart.BookIds.Except(orderedBookIds).ToList();
                _context.Carts.Update(cart);
            }
            // After saving order
            await _context.SaveChangesAsync();
            
            // Broadcast order books to WebSocket clients
            var orderedBooks = order.Items.Select(i => new { i.BookId, i.Quantity }).ToList();
            var broadcastMessage = new {
                Message = $"A new order was placed! Books: {string.Join(", ", orderedBooks.Select(b => $"ID {b.BookId} x{b.Quantity}"))}",
                Books = orderedBooks,
                Timestamp = DateTime.UtcNow
            };
            await OrderWebSocketBroadcaster.BroadcastOrderAsync(broadcastMessage);

            // Send confirmation email
            string subject = "Order Confirmation - Book Haven";
            string body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 24px; background: #fafafa;'>
                    <h2 style='color: #2d7a2d;'>Thank you for your order!</h2>
                    <p>Your order has been placed successfully. Please use the following claim code to pick up your order in-store:</p>
                    <div style='margin: 24px 0; text-align: center;'>
                        <span style='display: inline-block; font-size: 2em; letter-spacing: 4px; background: #e6ffe6; color: #2d7a2d; padding: 12px 32px; border-radius: 8px; border: 2px dashed #2d7a2d;'>
                            {claimCode}
                        </span>
                    </div>
                    <p><strong>Bill:</strong> {order.TotalAmount:C}</p>
                    <p>Present your membership ID and claim code at the store for pickup.</p>
                    <hr style='margin: 32px 0;'>
                    <p style='font-size: 0.9em; color: #888;'>If you have any questions, contact us at support@bookhaven.com.</p>
                </div>";
            await _emailService.SendEmailAsync(email, subject, body);
            return Ok(new { order, claimCode });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var orders = await _context.Orders.Where(o => o.UserId == userId).ToListAsync();
            return Ok(orders);
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return BadRequest("User email not found in token");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return BadRequest("User not found");
            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == user.Id)
                .ToListAsync();
            return Ok(orders);
        }
        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();
            order.Status = status;
            await _context.SaveChangesAsync();
            return Ok(order);
        }
        [HttpPut("{orderId}/cancel")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();
            if (order.Status == "Completed" || order.Status == "Cancelled")
                return BadRequest("Order cannot be cancelled.");
            order.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return Ok(order);
        }
        [HttpPut("{orderId}/purchase")]
        public async Task<IActionResult> PurchaseOrder(int orderId, [FromBody] string claimCode)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();
            if (order.Status != "Pending") return BadRequest("Order is not pending or already completed.");
            if (order.ClaimCode != claimCode) return BadRequest("Invalid claim code.");
            order.Status = "Completed";
            await _context.SaveChangesAsync();
            return Ok(order);
        }
        [HttpPut("staff/process-purchase")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> StaffProcessPurchase([FromBody] ProcessPurchaseDto dto)
        {
            // Extract userId from token
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return BadRequest("User ID not found in token");
            int userId;
            if (!int.TryParse(userIdClaim, out userId))
                return BadRequest("Invalid user ID in token");
            // Find order by userId and claim code
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.UserId == dto.UserId && o.ClaimCode == dto.ClaimCode && o.Status == "Pending");
            if (order == null) return NotFound("Order not found or already processed.");
            order.Status = "Completed";
            await _context.SaveChangesAsync();
            return Ok(order);
        }
        private string GenerateClaimCode()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                var bytes = new byte[6];
                rng.GetBytes(bytes);
                return BitConverter.ToString(bytes).Replace("-", "");
            }
        }
    }
}