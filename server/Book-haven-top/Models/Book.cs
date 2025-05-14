    using System.ComponentModel.DataAnnotations;
    using System.Collections.Generic;
    using BookHavenTop.Models;

    namespace Book_haven_top.Models
    {
        public class Book
        {
            public int Id { get; set; } 

            [Required]
            public string Title { get; set; }

            public string Author { get; set; } = "Unknown";

            public string Description { get; set; } = "";

            public string Image { get; set; } = "";

            public List<string> Genre { get; set; } = new List<string> { "Others" };

            public string Language { get; set; } = "";

            public string Format { get; set; } = "";

            public string Publisher { get; set; } = "";

            public string ISBN { get; set; } = "";

            public decimal Price { get; set; }

            public int Stock { get; set; } // Number of books available in stock

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


            public DateTime? PublicationDate { get; set; }

            public double? Ratings { get; set; } // Average rating

            public int? RatingsCount { get; set; } // Number of ratings

            public bool IsPhysicalAvailable { get; set; } // For physical library access

            public int? SoldCount { get; set; } // For popularity (most sold)

            // Discount fields
            public decimal? DiscountPrice { get; set; } // Discounted price if on sale
            public DateTime? DiscountStart { get; set; } // Discount start time
            public DateTime? DiscountEnd { get; set; } // Discount end time
            public bool IsOnSale { get; set; } // Whether the book is currently on sa

        }
    }