using System.ComponentModel.DataAnnotations;

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
    }
    public class BookUpdateDto : BookCreateDto
    {
        public int Id { get; set; }
    }


}
