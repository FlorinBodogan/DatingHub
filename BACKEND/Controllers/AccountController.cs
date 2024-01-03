using System.Security.Cryptography;
using System.Text;
using BACKEND.Data;
using BACKEND.entities;
using BACKEND.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BACKEND.interfaces;
using AutoMapper;

namespace BACKEND.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper) 
        {
            _context = context;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")] //POST: api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            using var hmac = new HMACSHA512();

            user.UserName = registerDto.Username.ToLower();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto 
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Gender = user.Gender,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")] //POST: api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(user => user.UserName == loginDto.Username);

            if(user == null) return Unauthorized("Invalid username");

            return new UserDto 
            {
                Username = user.UserName,
                Gender = user.Gender,
                Photo = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}