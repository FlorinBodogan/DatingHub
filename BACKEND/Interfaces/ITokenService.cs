using BACKEND.entities;

namespace BACKEND.interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}