using Book_haven_top.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{userId}/cart/add/{bookId}")]
        public async Task<IActionResult> AddToCart(int userId, int bookId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { Message = "User not found" });

            var book = await _context.Books.FindAsync(bookId);
            if (book == null) return NotFound(new { Message = "Book not found" });

            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId, BookIds = new List<int>() };
                _context.Carts.Add(cart);
            }

            if (cart.BookIds.Contains(bookId))
                return BadRequest(new { Message = "Book already in cart" });

            cart.BookIds.Add(bookId);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Book added to cart", CartId = cart.Id });
        }


        [HttpDelete("{userId}/cart/remove/{bookId}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int bookId)
        {
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || cart.BookIds == null)
                return NotFound(new { Message = "Cart or products not found" });

            if (!cart.BookIds.Contains(bookId))
                return NotFound(new { Message = "Book not found in cart" });

            cart.BookIds.Remove(bookId);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Book removed from cart", CartId = cart.Id });
        }

        [HttpPost("{userId}/bookmark/add/{bookId}")]
        public async Task<IActionResult> AddToBookmark(int userId, int bookId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { Message = "User not found" });

            var book = await _context.Books.FindAsync(bookId);
            if (book == null) return NotFound(new { Message = "Book not found" });

            var bookmark = await _context.Bookmarks
                .Include(b => b.Books)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (bookmark == null)
            {
                bookmark = new Bookmark { UserId = userId, Books = new List<Book>() };
                _context.Bookmarks.Add(bookmark);
            }

            if (bookmark.Books.Any(b => b.Id == bookId))
                return BadRequest(new { Message = "Book already bookmarked" });

            bookmark.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Book added to bookmark", BookmarkId = bookmark.Id });
        }

        [HttpDelete("{userId}/bookmark/remove/{bookId}")]
        public async Task<IActionResult> RemoveFromBookmark(int userId, int bookId)
        {
            var bookmark = await _context.Bookmarks
                .Include(b => b.Books)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (bookmark == null || bookmark.Books == null)
                return NotFound(new { Message = "Bookmark or books not found" });

            var book = bookmark.Books.FirstOrDefault(b => b.Id == bookId);
            if (book == null)
                return NotFound(new { Message = "Book not found in bookmark" });

            bookmark.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Book removed from bookmark", BookmarkId = bookmark.Id });
        }

        [HttpGet("{userId}/cart")]
        public async Task<IActionResult> GetCartItems(int userId)
        {
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || cart.BookIds == null || !cart.BookIds.Any())
                return Ok(new { Message = "Cart is empty", Items = new List<Book>() });

            var items = cart.BookIds.Select(id => new { BookId = id });

            return Ok(items);
        }

        [HttpGet("{userId}/bookmark")]
        public async Task<IActionResult> GetBookmarks(int userId)
        {
            var bookmark = await _context.Bookmarks
                .Include(b => b.Books)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (bookmark == null || bookmark.Books == null || !bookmark.Books.Any())
                return Ok(new { Message = "No bookmarks found", Items = new List<Book>() });

            // Ensure all Book fields are included in the response
            var items = bookmark.Books.Select(b => new {
                b.Id,
                b.Title,
                b.Author,
                b.Description,
                b.Price,
                b.Stock,
                b.Image,
                b.Genre,
                b.Language,
                b.Format,
                b.Publisher,
                b.ISBN,
                b.PublicationDate,
                b.Ratings,
                b.RatingsCount,
                b.IsPhysicalAvailable,
                b.SoldCount,
                b.CreatedAt
            });

            return Ok(items);
        }

        [HttpGet("my-bookmarks")]
        public async Task<IActionResult> GetMyBookmarks()
        {
            // Attempt to get user ID from claims (adjust if your auth is different)
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId" || c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null)
                return Unauthorized(new { Message = "User ID not found in token." });
            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Invalid user ID in token." });

            var bookmark = await _context.Bookmarks
                .Include(b => b.Books)
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (bookmark == null || bookmark.Books == null || !bookmark.Books.Any())
                return Ok(new { Message = "No bookmarks found", Items = new List<Book>() });

            var items = bookmark.Books.Select(b => new {
                b.Id,
                b.Title,
                b.Author,
                b.Description,
                b.Price,
                b.Stock,
                b.Image,
                b.Genre,
                b.Language,
                b.Format,
                b.Publisher,
                b.ISBN,
                b.PublicationDate,
                b.Ratings,
                b.RatingsCount,
                b.IsPhysicalAvailable,
                b.SoldCount,
                b.CreatedAt
            });

            return Ok(items);
        }
    }
}