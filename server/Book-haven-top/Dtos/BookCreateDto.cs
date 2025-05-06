using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Book_haven_top.Dtos
{
    public class BookCreateDto
    {
        [Required]
        public string Title { get; set; }
        public string Author { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public IFormFile Image { get; set; }
        public List<string> Genre { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Publisher { get; set; }
        public string ISBN { get; set; }
        public DateTime? PublicationDate { get; set; }
        public double? Ratings { get; set; }
        public int? RatingsCount { get; set; }
        public bool IsPhysicalAvailable { get; set; }
        public int? SoldCount { get; set; }

        // Discount fields
        public decimal? DiscountPrice { get; set; }
        public DateTime? DiscountStart { get; set; }
        public DateTime? DiscountEnd { get; set; }
        public bool IsOnSale { get; set; }
    }
    public class BookUpdateDto
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public string? Image { get; set; }
        public List<string>? Genre { get; set; }
        public string? Language { get; set; }
        public string? Format { get; set; }
        public string? Publisher { get; set; }
        public string? ISBN { get; set; }
        public DateTime? PublicationDate { get; set; }
        public double? Ratings { get; set; }
        public int? RatingsCount { get; set; }
        public bool? IsPhysicalAvailable { get; set; }
        public int? SoldCount { get; set; }
        // Discount fields
        public decimal? DiscountPrice { get; set; }
        public DateTime? DiscountStart { get; set; }
        public DateTime? DiscountEnd { get; set; }
        public bool? IsOnSale { get; set; }
    }
}
