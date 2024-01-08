using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression(@"^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$", ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 6)]
        public string NewPassword { get; set; }
    }
}