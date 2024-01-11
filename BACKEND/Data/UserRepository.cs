using AutoMapper;
using AutoMapper.QueryableExtensions;
using BACKEND.DTOs;
using BACKEND.entities;
using BACKEND.Helpers;
using BACKEND.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(p => p.Photos).ToListAsync();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
                userParams.PageNumber,
                userParams.PageSize
            );
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
            .Where(u => u.UserName == username)
            .Select(u => u.Gender)
            .FirstOrDefaultAsync();
        }

        public async Task<int> GetUsersCountForPeriod(int numberOfDays)
        {
            DateTime startDate = DateTime.UtcNow.AddDays(-numberOfDays);
            DateTime currentDate = DateTime.UtcNow;

            var usersCount = await _context.Users
                .Where(user => user.Created >= startDate && user.Created <= currentDate)
                .CountAsync();

            return usersCount;
        }

        public async Task<UsersCountDto> GetNumbersOfUsers()
        {
            DateTime currentDate = DateTime.UtcNow;

            var usersLastDay = await GetUsersCountForPeriod(1);
            var usersLastWeek = await GetUsersCountForPeriod(7);
            var usersLastMonth = await GetUsersCountForPeriod(30);
            var usersLast3Months = await GetUsersCountForPeriod(90);
            var usersLast6Months = await GetUsersCountForPeriod(180);
            var usersLastYear = await GetUsersCountForPeriod(365);

            return new UsersCountDto
            {
                UsersLastDay = usersLastDay,
                UsersLastWeek = usersLastWeek,
                UsersLastMonth = usersLastMonth,
                UsersLast3Months = usersLast3Months,
                UsersLast6Months = usersLast6Months,
                UsersLastYear = usersLastYear
            };
        }
    }
}