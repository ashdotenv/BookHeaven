using Book_haven_top.Models;
using Book_haven_top.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("make-payment")]
        public async Task<IActionResult> MakePayment([FromBody] PaymentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ClaimCode) || dto.Amount <= 0)
                return BadRequest("Invalid claim code or amount");

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.ClaimCode == dto.ClaimCode);
            if (order == null)
                return NotFound("Order with provided claim code not found");

            var payment = new Payment
            {
                ClaimCode = dto.ClaimCode,
                Amount = dto.Amount
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            order.Status = "Paid";
            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Payment successful",
                paymentId = payment.Id,
                claimCode = payment.ClaimCode,
                amount = payment.Amount,
                orderId = order.Id,
                orderStatus = order.Status
            });
        }
    }
}