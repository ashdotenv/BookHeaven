using System;
using System.ComponentModel.DataAnnotations;

namespace Book_haven_top.Models
{
    public class BannerAnnouncement
    {
        public int Id { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public bool IsActive { get; set; } = true;
    }
}