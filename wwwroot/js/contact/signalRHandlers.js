
import { showToast } from './utils.js';

export function initSignalR() {
    this.hubConnection.start().catch(err => {
        showToast('Failed to connect to real-time updates', 'danger');
    });

    this.hubConnection.on("ContactLocked", (contactId, userId) => {
        handleContactLocked.call(this, contactId, userId);
    });

    this.hubConnection.on("ContactUnlocked", (contactId) => {
        handleContactUnlocked.call(this, contactId);
    });
}

export function handleContactLocked(contactId, userId) {
    const row = $(`tr[data-contact-id="${contactId}"]`);
    if (row.length && userId !== currentUserId) {
        row.addClass('locked-row');
        row.find('.editable').addClass('locked').attr('title', `Locked by ${userId}`);
    }
}

export function handleContactUnlocked(contactId) {
    const row = $(`tr[data-contact-id="${contactId}"]`);
    if (row.length) {
        row.removeClass('locked-row');
        row.find('.editable').removeClass('locked').removeAttr('title');
    }
}


