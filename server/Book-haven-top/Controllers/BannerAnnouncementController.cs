using Book_haven_top.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Book_haven_top.Controllers
{
    [ApiController]
    [Route("api/admin/banner-announcements")]
    [Authorize(Roles = "Admin")]
    public class BannerAnnouncementController : ControllerBase
    {
        private readonly AppDbContext _context;
        public BannerAnnouncementController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _context.BannerAnnouncements.ToListAsync();
            return Ok(banners);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BannerAnnouncement banner)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // Ensure StartTime and EndTime are UTC
            if (banner.StartTime.Kind != DateTimeKind.Utc)
                banner.StartTime = DateTime.SpecifyKind(banner.StartTime, DateTimeKind.Utc);
            if (banner.EndTime.Kind != DateTimeKind.Utc)
                banner.EndTime = DateTime.SpecifyKind(banner.EndTime, DateTimeKind.Utc);
            _context.BannerAnnouncements.Add(banner);
            await _context.SaveChangesAsync();
            return Ok(banner);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BannerAnnouncement banner)
        {
            var existing = await _context.BannerAnnouncements.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Message = banner.Message;
            // Ensure StartTime and EndTime are UTC
            if (banner.StartTime.Kind != DateTimeKind.Utc)
                existing.StartTime = DateTime.SpecifyKind(banner.StartTime, DateTimeKind.Utc);
            else
                existing.StartTime = banner.StartTime;
            if (banner.EndTime.Kind != DateTimeKind.Utc)
                existing.EndTime = DateTime.SpecifyKind(banner.EndTime, DateTimeKind.Utc);
            else
                existing.EndTime = banner.EndTime;
            existing.IsActive = banner.IsActive;
            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.BannerAnnouncements.FindAsync(id);
            if (banner == null) return NotFound();
            _context.BannerAnnouncements.Remove(banner);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Banner announcement deleted successfully" });
        }
    }
}