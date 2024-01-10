using AutoMapper;
using BACKEND.DTOs;
using BACKEND.entities;
using BACKEND.Extensions;
using BACKEND.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager, IUnitOfWork uow, IMapper mapper, IPhotoService photoService)
        {
            _userManager = userManager;
            _uow = uow;
            _mapper = mapper;
            _photoService = photoService;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    KnownAs = u.KnownAs,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound();

            if (user.UserName == "admin") return BadRequest("You cannot modify the admin roles");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or Moderators");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("lock-member/{id}")]
        public async Task<IActionResult> LockMember([FromBody] ActionsUserDto actionsUserDto)
        {
            var user = await _userManager.FindByNameAsync(actionsUserDto.UserName);
            if (user == null) return NotFound();

            if (IsAdminUserName(actionsUserDto.UserName))
            {
                return BadRequest("You cannot ban admin");
            }

            await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddDays(5000));
            return NoContent();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("unlock-member/{id}")]
        public async Task<IActionResult> UnlockMember([FromBody] ActionsUserDto actionsUserDto)
        {
            var user = await _userManager.FindByNameAsync(actionsUserDto.UserName);
            if (user == null) return NotFound();

            if (user.LockoutEnd != null && user.LockoutEnd > DateTime.Now)
            {
                await _userManager.SetLockoutEndDateAsync(user, null);
                return NoContent();
            }
            else
            {
                return BadRequest("User is not locked.");
            }
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("delete-member/{id}")]
        public async Task<IActionResult> DeleteMember([FromBody] ActionsUserDto deleteUserDto)
        {
            var username = User.GetUsername();

            if (username != "admin")
            {
                return BadRequest("Only administrator can delete members.");
            }

            var user = await _userManager.FindByNameAsync(deleteUserDto.UserName);
            if (user == null) return NotFound();

            if (IsAdminUserName(deleteUserDto.UserName))
            {
                return BadRequest("You cannot delete admin");
            }

            await _uow.MessageRepository.DeleteUserMessages(user.Id);

            await _userManager.DeleteAsync(user);
            return NoContent();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("edit-member-info/{username}")]
        public async Task<ActionResult> EditUserInfo(string username, [FromBody] UserUpdateInfoDto userUpdateDto)
        {

            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();

            if (IsAdminUserName(username))
            {
                return BadRequest("You cannot edit admin");
            }

            if (!userUpdateDto.UserName.All(char.IsLetterOrDigit) && !userUpdateDto.UserName.All(char.IsLower))
            {
                return BadRequest("Username must consist of lowercase letters and digits.");
            }

            if (await UserExists(userUpdateDto.UserName, username)) return BadRequest("Username is taken.");

            if (await EmailExists(userUpdateDto.Email)) return BadRequest("Email is taken.");

            user.UserName = userUpdateDto.UserName;
            user.KnownAs = userUpdateDto.KnownAs;
            user.Email = userUpdateDto.Email;

            Console.WriteLine("Userul de trimis: " + user);

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User information updated successfully." });
            }
            else
            {
                return BadRequest(new { message = "User information update failed." });
            }
        }

        //edit user about details
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("edit-member-details/{username}")]
        public async Task<ActionResult> EditUserDetails(string username, [FromBody] MemberUpdateDto userUpdateDto)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();

            if (IsAdminUserName(username))
            {
                return BadRequest("You cannot edit admin");
            }

            user.Introduction = userUpdateDto.Introduction;
            user.LookingFor = userUpdateDto.LookingFor;
            user.Interests = userUpdateDto.Interests;
            user.City = userUpdateDto.City;
            user.Country = userUpdateDto.Country;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User information updated successfully." });
            }
            else
            {
                return BadRequest(new { message = "User information updated failed." });
            }
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto([FromBody] DeletePhotoAdminDto deletePhotoAdminDto)
        {


            var user = await _uow.UserRepository.GetUserByUsernameAsync(deletePhotoAdminDto.Username);

            if (IsAdminUserName(deletePhotoAdminDto.Username))
            {
                return BadRequest(new { message = "You can't delete admin's photos." });
            }

            var photo = user.Photos.FirstOrDefault(x => x.Id == deletePhotoAdminDto.PhotoId);

            if (photo == null) return NotFound();

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _uow.Complete()) return Ok();

            return BadRequest(new { message = "Problem deleting photo" });
        }

        //STATISTICS
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-banned")]
        public async Task<int> GetNumberOfUsersBanned()
        {
            var bannedUsers = await _userManager.Users.Where(u => u.LockoutEnd != null && u.LockoutEnd > DateTimeOffset.UtcNow).ToListAsync();
            return bannedUsers.Count;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-uncorfimed")]
        public async Task<int> GetNumberOfUsersUncorfimed()
        {
            var uncorfimedUsers = await _userManager.Users.Where(u => u.EmailConfirmed != true).ToListAsync();
            return uncorfimedUsers.Count;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("allUsers")]
        public async Task<int> GetNumberOfUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return users.Count;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("matches-last-week")]
        public async Task<int> GetNumberOfMatchesLastWeek()
        {
            var users = await _uow.LikesRepository.GetNumbersOfMatchesLastWeek();
            return users;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("matches-last-month")]
        public async Task<int> GetNumberOfMatchesLastMonth()
        {
            var users = await _uow.LikesRepository.GetNumbersOfMatchesLastMonth();
            return users;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("matches-last-year")]
        public async Task<int> GetNumberOfMatchesLastYear()
        {
            var users = await _uow.LikesRepository.GetNumbersOfMatchesLastYear();
            return users;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("messages-last-year")]
        public async Task<int> GetNumberOfMessagesLastYear()
        {
            var users = await _uow.MessageRepository.GetNumbersOfMessagesLastYear();
            return users;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("messages-last-month")]
        public async Task<int> GetNumberOfMessagesLastMonth()
        {
            var users = await _uow.MessageRepository.GetNumbersOfMessagesLastMonth();
            return users;
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("messages-last-week")]
        public async Task<int> GetNumberOfMessagesLastWeek()
        {
            var users = await _uow.MessageRepository.GetNumbersOfMessagesLastWeek();
            return users;
        }

        //UTILS
        private bool IsAdminUserName(string username)
        {
            return _userManager.FindByNameAsync(username).GetAwaiter().GetResult().UserName.Equals("admin");
        }

        private async Task<bool> UserExists(string username, string userReq)
        {
            return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower() && user.UserName != userReq);
        }
        private async Task<bool> EmailExists(string email)
        {
            return await _userManager.Users.AnyAsync(user => user.Email == email.ToLower());
        }

    }
}