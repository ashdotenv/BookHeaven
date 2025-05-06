using Book_haven_top.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/banner")]
    public class BannerController : ControllerBase
    {
        private readonly AppDbContext _context;
        public BannerController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveBanner()
        {
            var now = DateTime.UtcNow;
            var banner = await _context.BannerAnnouncements
                .OrderBy(b => b.StartTime)
                .FirstOrDefaultAsync();
            if (banner == null) return NotFound();
            return Ok(banner);
        }
    }
}