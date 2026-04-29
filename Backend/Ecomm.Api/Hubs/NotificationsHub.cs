using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Ecomm.Api.Hubs;

[Authorize(Roles = "Admin")]
public class NotificationsHub : Hub
{
    
}