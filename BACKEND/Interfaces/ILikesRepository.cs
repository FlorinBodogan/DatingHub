using BACKEND.DTOs;
using BACKEND.entities;
using BACKEND.Entities;

namespace BACKEND.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId);

        Task<bool> CheckLikeConnection(int sourceUserId, int targetUserId);
        Task<bool> CheckLikedEachOther(string sourceUser, string targetUser);

        Task<UserLike> ConfirmUsersLikedEachOther(int sourceUserId, int targetUserId);

        Task<int> GetNumbersOfMatchesLastWeek();
        Task<int> GetNumbersOfMatchesLastMonth();
        Task<int> GetNumbersOfMatchesLastYear();
    }
}