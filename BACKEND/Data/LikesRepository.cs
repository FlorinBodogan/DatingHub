using BACKEND.DTOs;
using BACKEND.entities;
using BACKEND.Entities;
using BACKEND.Extensions;
using BACKEND.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == userId);
                users = likes.Select(like => like.TargetUser);
            }

            if (predicate == "likedBy")
            {
                likes = likes.Where(like => like.TargetUserId == userId);
                users = likes.Select(like => like.SourceUser);
            }

            if (predicate == "likedByEachOther")
            {
                likes = likes.Where(like => like.SourceUserId == userId || like.TargetUserId == userId);
                var mutualLikes = likes
                    .GroupBy(like => like.SourceUserId == userId ? like.TargetUserId : like.SourceUserId)
                    .Where(group => group.Count() == 2)
                    .Select(group => group.Key);

                users = users.Where(user => mutualLikes.Contains(user.Id));
            }

            return await users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
                City = user.City,
                Id = user.Id
            }).ToListAsync();
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users.Include(x => x.LikedUsers).FirstOrDefaultAsync(x => x.Id == userId);
        }

        public async Task<bool> CheckLikeConnection(int userSourceId, int userTargetId)
        {
            var reverseLike = await _context.Likes
                .FirstOrDefaultAsync(ul => ul.SourceUserId == userTargetId && ul.TargetUserId == userSourceId);

            return reverseLike != null;
        }

        public async Task<bool> CheckLikedEachOther(string userSourceName, string userTargetName)
        {
            if (userSourceName == "admin" || userTargetName == "admin") return true;
            var likedEachOther = await _context.Likes
                .AnyAsync(ul =>
                    (ul.SourceUser.UserName == userSourceName && ul.TargetUser.UserName == userTargetName && ul.LikedEachOther) ||
                    (ul.SourceUser.UserName == userTargetName && ul.TargetUser.UserName == userSourceName && ul.LikedEachOther)
                );

            return likedEachOther;
        }

        public async Task<UserLike> ConfirmUsersLikedEachOther(int userSourceId, int userTargetId)
        {
            var like = await _context.Likes
                .FirstOrDefaultAsync(ul => (ul.SourceUserId == userSourceId && ul.TargetUserId == userTargetId) ||
                                            (ul.SourceUserId == userTargetId && ul.TargetUserId == userSourceId));

            if (like != null)
            {
                like.LikedEachOther = true;
                like.LikeDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }

            return like;
        }

        public async Task<int> GetMatchesCountForPeriod(int numberOfDays)
        {
            DateTime startDate = DateTime.UtcNow.AddDays(-numberOfDays);

            var matchesCount = await _context.Likes
                .Where(l => l.LikedEachOther && l.LikeDate >= startDate)
                .CountAsync();

            return matchesCount;
        }

        public async Task<MatchesCountDto> GetNumbersOfMatches()
        {
            DateTime currentDate = DateTime.UtcNow;

            var matchesLastDay = await GetMatchesCountForPeriod(1);
            var matchesLastWeek = await GetMatchesCountForPeriod(7);
            var matchesLastMonth = await GetMatchesCountForPeriod(30);
            var matchesLast3Months = await GetMatchesCountForPeriod(90);
            var matchesLast6Months = await GetMatchesCountForPeriod(180);
            var matchesLastYear = await GetMatchesCountForPeriod(365);

            return new MatchesCountDto
            {
                MatchesLastDay = matchesLastDay,
                MatchesLastWeek = matchesLastWeek,
                MatchesLastMonth = matchesLastMonth,
                MatchesLast3Months = matchesLast3Months,
                MatchesLast6Months = matchesLast6Months,
                MatchesLastYear = matchesLastYear
            };
        }
    }
}