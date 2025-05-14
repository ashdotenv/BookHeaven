using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Book_haven_top.Models
{
    public class Order
    {
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        // Change BookIds to a list of OrderItem for quantity support
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending";
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public string? ClaimCode { get; set; }
    }

    public class OrderItem
    {
        public int Id { get; set; } // Primary key for EF Core
        public int BookId { get; set; }
        public int Quantity { get; set; }
    }
}
