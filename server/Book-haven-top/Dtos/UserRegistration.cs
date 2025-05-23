﻿using System.ComponentModel.DataAnnotations;

public class UserRegistrationDto
{
    [Required]
    [StringLength(100)]
    public string FullName { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Role { get; set; }
}
