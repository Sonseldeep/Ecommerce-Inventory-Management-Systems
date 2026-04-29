namespace Ecomm.Application.Interfaces.Repositories;

public interface ICurrentUserService
{
    Guid GetUserId();
    string GetEmail();
    string GetRole();
}