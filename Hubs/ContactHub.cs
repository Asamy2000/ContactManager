using Microsoft.AspNetCore.SignalR;

namespace ContactsSystem.Hubs
{
    public class ContactHub : Hub
    {
        private static readonly Dictionary<int, string> _lockedContacts = [];

        public async Task LockContact(int contactId, string userId)
        {
            if (!_lockedContacts.ContainsKey(contactId))
            {
                _lockedContacts[contactId] = userId;
                await Clients.Others.SendAsync("ContactLocked", contactId, userId);
            }
            else
            {
                throw new HubException("Contact is already locked");
            }
        }

        public async Task UnlockContact(int contactId, string userId)
        {
            if (_lockedContacts.ContainsKey(contactId) && _lockedContacts[contactId] == userId)
            {
                _lockedContacts.Remove(contactId);
                await Clients.Others.SendAsync("ContactUnlocked", contactId);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            foreach (var contact in _lockedContacts.Where(kvp => kvp.Value == Context.UserIdentifier).ToList())
            {
                _lockedContacts.Remove(contact.Key);
                await Clients.Others.SendAsync("ContactUnlocked", contact.Key);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
