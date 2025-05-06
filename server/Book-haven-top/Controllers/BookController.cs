using Book_haven_top.Dtos;
using Book_haven_top.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Book_haven_top.Controllers;
[ApiController]
[Route("api/admin/books")]
[Authorize(Roles = "Admin")] // Only Admins allowed
public class BookController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Get all books
    [HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        var books = await _context.Books.ToListAsync();
        return Ok(books);
    }

    // 2. Add a book
    [HttpPost]
    public async Task<IActionResult> CreateBook([FromForm] BookCreateDto dto, [FromForm] IFormFile image)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        string imagePath = null;
        if (image != null && image.Length > 0)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploads, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            imagePath = $"/images/{fileName}";
        }
        var book = new Book
        {
            Title = dto.Title,
            Author = dto.Author,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            Image = imagePath,
            CreatedAt = DateTime.UtcNow,
            Genre = dto.Genre,
            Language = dto.Language,
            Format = dto.Format,
            Publisher = dto.Publisher,
            ISBN = dto.ISBN,
            PublicationDate = dto.PublicationDate.HasValue ? DateTime.SpecifyKind(dto.PublicationDate.Value, DateTimeKind.Utc) : null,
            Ratings = dto.Ratings,
            RatingsCount = dto.RatingsCount,
            IsPhysicalAvailable = dto.IsPhysicalAvailable,
            SoldCount = dto.SoldCount,
            DiscountPrice = dto.DiscountPrice,
            DiscountStart = dto.DiscountStart,
            DiscountEnd = dto.DiscountEnd,
            IsOnSale = dto.IsOnSale
        };
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return Ok(book);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromForm] BookUpdateDto dto, [FromForm] IFormFile image = null)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        if (dto.Title != null) book.Title = dto.Title;
        if (dto.Author != null) book.Author = dto.Author;
        if (dto.Description != null) book.Description = dto.Description;
        if (dto.Price.HasValue) book.Price = dto.Price.Value;
        if (dto.Stock.HasValue) book.Stock = dto.Stock.Value;
        if (image != null && image.Length > 0)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploads, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            book.Image = $"/images/{fileName}";
        }
        if (dto.Genre != null) book.Genre = dto.Genre;
        if (dto.Language != null) book.Language = dto.Language;
        if (dto.Format != null) book.Format = dto.Format;
        if (dto.Publisher != null) book.Publisher = dto.Publisher;
        if (dto.ISBN != null) book.ISBN = dto.ISBN;
        if (dto.PublicationDate.HasValue) book.PublicationDate = dto.PublicationDate;
        if (dto.Ratings.HasValue) book.Ratings = dto.Ratings;
        if (dto.RatingsCount.HasValue) book.RatingsCount = dto.RatingsCount;
        if (dto.IsPhysicalAvailable.HasValue) book.IsPhysicalAvailable = dto.IsPhysicalAvailable.Value;
        if (dto.SoldCount.HasValue) book.SoldCount = dto.SoldCount;
        if (dto.DiscountPrice.HasValue) book.DiscountPrice = dto.DiscountPrice;
        if (dto.DiscountStart.HasValue) book.DiscountStart = dto.DiscountStart;
        if (dto.DiscountEnd.HasValue) book.DiscountEnd = dto.DiscountEnd;
        if (dto.IsOnSale.HasValue) book.IsOnSale = dto.IsOnSale.Value;
        if (book.PublicationDate.HasValue && book.PublicationDate.Value.Kind != DateTimeKind.Utc)
        {
            book.PublicationDate = DateTime.SpecifyKind(book.PublicationDate.Value, DateTimeKind.Utc);
        }
        await _context.SaveChangesAsync();
        return Ok(book);
    }

    // 4. Delete a book
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Book deleted successfully" });
    }
}
