using System;
using System.ComponentModel.DataAnnotations;

namespace Book_haven_top.Models
{
    public class Payment
    {
        public int Id { get; set; }
        [Required]
        public string ClaimCode { get; set; }
        [Required]
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}