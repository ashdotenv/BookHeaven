using System.ComponentModel.DataAnnotations;

namespace Book_haven_top.Models
{
    public class Book
    {
        public int Id { get; set; } // Unique ID for each book

        [Required]
        public string Title { get; set; }

        public string Author { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int Stock { get; set; } // Number of books available in stock

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
