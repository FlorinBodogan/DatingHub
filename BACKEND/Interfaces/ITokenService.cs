using BACKEND.entities;

namespace BACKEND.interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}