using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/books")] // Public route
    public class PublicBookController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicBookController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Get all books
        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _context.Books
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(books);
        }

        // 2. Get single book by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { Message = "Book not found" });

            return Ok(book);
        }
    }

}
