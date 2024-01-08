using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class ConfirmEmailDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression(@"^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$", ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
    }
}