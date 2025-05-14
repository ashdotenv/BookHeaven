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
using System.Text;
using BookHavenTop.Models;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize(Roles = "Admin,User")]
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
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return BadRequest("User email not found in token");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return BadRequest("User not found");

            order.UserId = user.Id;

            int successfulOrders = await _context.Orders.CountAsync(o => o.UserId == order.UserId && o.Status == "Completed");

            decimal discount = 0m;
            int totalBooks = order.Items.Sum(i => i.Quantity);
            if (totalBooks >= 5) discount += 0.05m;
            if (successfulOrders > 0 && successfulOrders % 10 == 0) discount += 0.10m;

            decimal total = 0m;
            foreach (var item in order.Items)
            {
                var book = await _context.Books.FindAsync(item.BookId);
                if (book == null) return BadRequest($"Book with ID {item.BookId} not found");
                total += book.Price * item.Quantity;
            }
            if (discount > 0) total *= (1 - discount);

            order.TotalAmount = total;
            order.Status = "Pending";
            order.CreatedAt = DateTime.UtcNow;
            order.ClaimCode = GenerateClaimCode();

            _context.Orders.Add(order);

            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == order.UserId);
            if (cart != null && cart.BookIds != null)
            {
                var orderedBookIds = order.Items.Select(i => i.BookId).ToList();
                cart.BookIds = cart.BookIds.Except(orderedBookIds).ToList();
                _context.Carts.Update(cart);
            }

            await _context.SaveChangesAsync();


            // Send message to SSE
           

            string subject = "Order Confirmation - Book Haven";
            string body = $@"
    <div style='font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 24px; background: #fafafa;'>
        <h2 style='color: #2d7a2d;'>Thank you for your order!</h2>
        <p>Your order has been placed successfully. Please use the following claim code to pick up your order in-store:</p>
        <div style='margin: 24px 0; text-align: center;'>
            <span style='display: inline-block; font-size: 2em; letter-spacing: 4px; background: #e6ffe6; color: #2d7a2d; padding: 12px 32px; border-radius: 8px; border: 2px dashed #2d7a2d;'>
                {order.ClaimCode}
            </span>
        </div>
        <p><strong>Bill:</strong> {order.TotalAmount:C}</p>
        <p><strong>Order ID:</strong> {order.Id}</p>
        <p>Present your membership ID and claim code at the store for pickup.</p>
        <hr style='margin: 32px 0;'>
        <p style='font-size: 0.9em; color: #888;'>If you have any questions, contact us at support@bookhaven.com.</p>
    </div>";


            await _emailService.SendEmailAsync(email, subject, body);
            // await HttpContext.Response.WriteAsync($"data: {message}\n\n");
            // await HttpContext.Response.Body.FlushAsync();
            // Ensure the request ends only after returning Ok
            return Ok(new { order, claimCode = order.ClaimCode });
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
        [Authorize(Roles = "Admin")]
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
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return BadRequest("User ID not found in token");

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest("Invalid user ID in token");

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.UserId == dto.UserId && o.ClaimCode == dto.ClaimCode && o.Status == "Pending");

            if (order == null)
                return NotFound("Order not found or already processed.");

            order.Status = "Completed";
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpGet("all-orders")]
        public async Task<IActionResult> GetOrdersWithBooks()
        {
            var orders = await _context.Orders
                .Select(order => new
                {
                    order.Id,
                    order.CreatedAt,
                    order.TotalAmount,
                    order.Status,
                    order.ShippingAddress,
                    order.PaymentMethod,
                    Items = order.Items.Select(item => new
                    {
                        item.BookId,
                        item.Quantity,
                        Book = _context.Books
                            .Where(b => b.Id == item.BookId)
                            .Select(b => new
                            {
                                b.Title,
                                b.Author
                            })
                            .FirstOrDefault()
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPost("{orderId}/review")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddReview(int orderId, [FromBody] ReviewDto reviewDto)
        {
            if (reviewDto == null || reviewDto.Rating < 1 || reviewDto.Rating > 5)
                return BadRequest("Invalid review data. Rating must be between 1 and 5.");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token.");

            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Invalid user ID in token.");

            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId && o.Status == "Completed");

            if (order == null)
                return BadRequest("Order not found, not completed, or does not belong to the user.");

            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.OrderId == orderId && r.UserId == userId);

            if (existingReview != null)
                return BadRequest("A review for this order already exists.");

            var review = new Review
            {
                UserId = userId,
                OrderId = orderId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Review added successfully", Review = review });
        }

        // Remove duplicate AddReview method
        
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

