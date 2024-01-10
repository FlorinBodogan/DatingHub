using AutoMapper;
using AutoMapper.QueryableExtensions;
using BACKEND.DTOs;
using BACKEND.Entities;
using BACKEND.Helpers;
using BACKEND.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public void AddMessage(Message message)
        {
            this.context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            this.context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await this.context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = this.context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Unread" => query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRead == null),

                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username),

                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),

                _ => query
            };

            var result = query.ProjectTo<MessageDto>(this.mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreateAsync(result, messageParams.PageNumber, messageParams.PageSize);
        }


        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            var query = this.context.Messages
                .Where(
                    m => m.RecipientUsername == currentUserName &&
                    m.SenderUsername == recipientUserName ||
                    m.RecipientUsername == recipientUserName &&
                    m.SenderUsername == currentUserName
                )
                .OrderBy(m => m.MessageSent)
                .AsQueryable();


            var unreadMessages = query.Where(m => m.DateRead == null &&
                m.RecipientUsername == currentUserName).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await this.context.SaveChangesAsync();
            }

            return await query.ProjectTo<MessageDto>(this.mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await this.context.Groups
                .Include(x => x.Connections)
                .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await this.context.Connections.FindAsync(connectionId);
        }
        public void RemoveConnection(Connection connection)
        {
            this.context.Connections.Remove(connection);
        }
        public void AddGroup(Group group)
        {
            this.context.Groups.Add(group);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await this.context.Groups
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<int> GetNumbersOfMessagesLastWeek()
        {
            DateTime lastWeekStartDate = DateTime.UtcNow.AddDays(-7);

            var matchesCount = await context.Messages
                .Where(m => m.MessageSent >= lastWeekStartDate)
                .CountAsync();

            return matchesCount;
        }

        public async Task<int> GetNumbersOfMessagesLastMonth()
        {
            DateTime lastWeekStartDate = DateTime.UtcNow.AddDays(-30);

            var matchesCount = await context.Messages
                .Where(m => m.MessageSent >= lastWeekStartDate)
                .CountAsync();

            return matchesCount;
        }

        public async Task<int> GetNumbersOfMessagesLastYear()
        {
            DateTime lastWeekStartDate = DateTime.UtcNow.AddDays(-365);

            var matchesCount = await context.Messages
                .Where(m => m.MessageSent >= lastWeekStartDate)
                .CountAsync();

            return matchesCount;
        }

        public async Task<int> DeleteUserMessages(int userId)
        {
            var userMessages = context.Messages
                .Where(m => m.SenderId == userId || m.RecipientId == userId);

            context.Messages.RemoveRange(userMessages);

            return await context.SaveChangesAsync();
        }
    }
}