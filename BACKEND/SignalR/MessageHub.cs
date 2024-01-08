using System.Security.AccessControl;
using AutoMapper;
using BACKEND.DTOs;
using BACKEND.Entities;
using BACKEND.Extensions;
using BACKEND.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BACKEND.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        public MessageHub(
            IMapper mapper, IHubContext<PresenceHub> presenceHub,
            IUnitOfWork uow
        )
        {
            _uow = uow;
            _mapper = mapper;
            _presenceHub = presenceHub;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var currentUsername = Context.User.GetUsername();

            var isLikedEachOther = await _uow.LikesRepository.CheckLikedEachOther(currentUsername, otherUser);

            if (isLikedEachOther)
            {
                var groupName = GetGroupName(currentUsername, otherUser);
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                var group = await AddToGroup(groupName);

                await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

                var messages = await _uow.MessageRepository.GetMessageThread(currentUsername, otherUser);

                if (_uow.HasChanges()) await _uow.Complete();

                await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
            }
            else
            {
                await Clients.Caller.SendAsync("NotLikedEachOther", $"You cannot send messages to {otherUser} because you are not liking each other.");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
             var username = Context.User.GetUsername();

            if (username == createMessageDto.RecipientUsername.ToLower()) 
                throw new HubException("You cannot send messages to yourself");

            var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
            var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _uow.MessageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", new {
                        username = sender.UserName,
                        knownAs = sender.KnownAs
                    });
                }
            }

            _uow.MessageRepository.AddMessage(message);

            if (await _uow.Complete()) 
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
        }

        //groups
        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _uow.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            if (group == null)
            {
                group = new Group(groupName);
                _uow.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await _uow.Complete()) return group;

            throw new HubException("Failed to add to group");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _uow.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _uow.MessageRepository.RemoveConnection(connection);

            if (await _uow.Complete()) return group;

            throw new HubException("Failed to remove from group");
        }



        //util functions
        private static string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}