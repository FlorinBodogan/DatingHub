using BACKEND.DTOs;
using BACKEND.Entities;
using BACKEND.Helpers;
using Newtonsoft.Json.Linq;

namespace BACKEND.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName);
        Task<Connection> GetConnection(string connectionId);
        void RemoveConnection(Connection connection);
        void AddGroup(Group group);
        Task<Group> GetMessageGroup(string groupName);
        Task<Group> GetGroupForConnection(string connectionId);
    }
}