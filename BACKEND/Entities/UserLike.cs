using BACKEND.entities;

namespace BACKEND.Entities
{
    public class UserLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public AppUser TargetUser { get; set; }
        public int TargetUserId { get; set; }
        public bool LikedEachOther { get; set; } = false;
        public DateTime LikeDate { get; set; } = DateTime.UtcNow;
    }
}