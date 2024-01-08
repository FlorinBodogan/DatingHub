using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [RegularExpression(@"^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$", ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        public string EmailConfirmed { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateOnly? DateOfBirth { get; set; } //optional to make require work becaute by default variable of this type cannot be null and would take current time instead
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 6)]
        public string Password { get; set; }
    }
}