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
    public async Task<IActionResult> CreateBook([FromBody] BookCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var book = new Book
        {
            Title = dto.Title,
            Author = dto.Author,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return Ok(book);
    }

    // 3. Update a book
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] BookUpdateDto dto)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        book.Title = dto.Title;
        book.Author = dto.Author;
        book.Description = dto.Description;
        book.Price = dto.Price;
        book.Stock = dto.Stock;

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
