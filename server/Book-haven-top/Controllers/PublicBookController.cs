﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Book_haven_top.Models;
using System.Linq;

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

        [HttpGet]
        public async Task<IActionResult> GetAllBooks(
     [FromQuery] string author = null,
     [FromQuery] List<string> genre = null,
     [FromQuery] string language = null,
     [FromQuery] string format = null,
     [FromQuery] string publisher = null,
     [FromQuery] string isbn = null,
     [FromQuery] string title = null,
     [FromQuery] string description = null,
     [FromQuery] decimal? minPrice = null,
     [FromQuery] decimal? maxPrice = null,
     [FromQuery] double? minRating = null,
     [FromQuery] double? maxRating = null,
     [FromQuery] bool? isPhysicalAvailable = null,
     [FromQuery] int? minStock = null,
     [FromQuery] int? maxStock = null,
     [FromQuery] string sortBy = null,
     [FromQuery] string sortOrder = "asc",
     [FromQuery] int page = 1,
     [FromQuery] int pageSize = 10
 )
        {
            var query = _context.Books.AsQueryable();

            // Filters
            if (!string.IsNullOrEmpty(author))
                query = query.Where(b => b.Author.ToLower().Contains(author.ToLower()));
            if (genre != null && genre.Any())
                query = query.Where(b => b.Genre.Any(g => genre.Contains(g)));
            if (!string.IsNullOrEmpty(language))
                query = query.Where(b => b.Language.ToLower().Contains(language.ToLower()));
            if (!string.IsNullOrEmpty(format))
                query = query.Where(b => b.Format.ToLower().Contains(format.ToLower()));
            if (!string.IsNullOrEmpty(publisher))
                query = query.Where(b => b.Publisher.ToLower().Contains(publisher.ToLower()));
            if (!string.IsNullOrEmpty(isbn))
                query = query.Where(b => b.ISBN.ToLower().Contains(isbn.ToLower()));
            if (!string.IsNullOrEmpty(title))
                query = query.Where(b => EF.Functions.Like(b.Title, title + "%") || EF.Functions.Like(b.Title, "%" + title + "%"));
            if (!string.IsNullOrEmpty(description))
                query = query.Where(b => EF.Functions.Like(b.Description, description + "%") || EF.Functions.Like(b.Description, "%" + description + "%"));
            if (minPrice.HasValue)
                query = query.Where(b => b.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(b => b.Price <= maxPrice.Value);
            if (minRating.HasValue)
                query = query.Where(b => b.Ratings >= minRating.Value);
            if (maxRating.HasValue)
                query = query.Where(b => b.Ratings <= maxRating.Value);
            if (isPhysicalAvailable.HasValue)
                query = query.Where(b => b.IsPhysicalAvailable == isPhysicalAvailable.Value);
            if (minStock.HasValue)
                query = query.Where(b => b.Stock >= minStock.Value);
            if (maxStock.HasValue)
                query = query.Where(b => b.Stock <= maxStock.Value);

            // Sorting
            switch (sortBy?.ToLower())
            {
                case "title":
                    query = sortOrder == "desc" ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
                    break;
                case "publicationdate":
                    query = sortOrder == "desc" ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate);
                    break;
                case "price":
                    query = sortOrder == "desc" ? query.OrderByDescending(b => b.Price) : query.OrderBy(b => b.Price);
                    break;
                case "popularity":
                    query = sortOrder == "desc" ? query.OrderByDescending(b => b.SoldCount) : query.OrderBy(b => b.SoldCount);
                    break;
                default:
                    query = query.OrderByDescending(b => b.CreatedAt);
                    break;
            }

            var totalCount = await query.CountAsync();
            var books = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            // Get all orders that include any of the current books
            var bookIds = books.Select(b => b.Id).ToList();

            var ordersWithBooks = await _context.Orders
                .Where(o => o.Items.Any(i => bookIds.Contains(i.BookId)))
                .Select(o => new
                {
                    o.Id,
                    o.Items,
                    Reviews = _context.Reviews
                        .Where(r => r.OrderId == o.Id)
                        .Select(r => new
                        {
                            r.Id,
                            r.UserId,
                            r.OrderId,
                            r.Rating,
                            r.Comment,
                            r.CreatedAt
                        }).ToList()
                })
                .ToListAsync();

            // Map reviews to books
            var bookReviewsMap = new Dictionary<int, List<object>>();

            foreach (var order in ordersWithBooks)
            {
                foreach (var item in order.Items)
                {
                    if (!bookReviewsMap.ContainsKey(item.BookId))
                        bookReviewsMap[item.BookId] = new List<object>();

                    bookReviewsMap[item.BookId].AddRange(order.Reviews);
                }
            }

            // Final projection
            var booksWithReviews = books.Select(book => new
            {
                book.Id,
                book.Title,
                book.Author,
                book.Description,
                book.Image,
                book.Genre,
                book.Language,
                book.Format,
                book.Publisher,
                book.ISBN,
                book.Price,
                book.Stock,
                book.CreatedAt,
                book.PublicationDate,
                book.Ratings,
                book.RatingsCount,
                book.IsPhysicalAvailable,
                book.SoldCount,
                book.DiscountPrice,
                book.DiscountStart,
                book.DiscountEnd,
                book.IsOnSale,
                Reviews = bookReviewsMap.ContainsKey(book.Id) ? bookReviewsMap[book.Id] : new List<object>()
            });

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                books = booksWithReviews
            });
        }

        // 2. Get single book by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound(new { Message = "Book not found" });

            return Ok(book);
        }


    }
}
