
import { getAntiForgeryToken } from './utils.js';

export async function sendUpdateRequest(contactId, contactData, row, hubConnection, currentUserId, refreshGrid, showToast, handleUpdateError) {
    try {
        await $.ajax({
            url: `/Contacts/Edit/${contactId}`,
            method: 'POST',
            headers: { 'RequestVerificationToken': getAntiForgeryToken() },
            data: contactData
        });

        row.removeClass('editing').find('.save-btn, .cancel-btn').hide();
        await hubConnection.invoke("UnlockContact", contactId, currentUserId);
        refreshGrid();
        showToast('Contact updated successfully');
    } catch (error) {
        handleUpdateError(error, showToast);
    }
}

export async function sendCreateRequest(formData, form, addModalIti, refreshGrid, showToast, handleCreateError) {
    try {
        await $.ajax({
            url: '/Contacts/Create',
            method: 'POST',
            headers: { 'RequestVerificationToken': getAntiForgeryToken() },
            data: formData
        });

        $('#addContactModal').modal('hide');
        form[0].reset();
        addModalIti.setNumber("");
        refreshGrid();
        showToast('Contact added successfully');
    } catch (error) {
        handleCreateError(error, form, showToast);
    }
}

export async function handleConfirmDelete(pendingDelete, refreshGrid, showToast) {
    if (!pendingDelete.contactId) return;
    const confirmBtn = $('#confirmDeleteBtn');
    const originalHtml = confirmBtn.html();
    const { contactId, rowElement } = pendingDelete;

    try {
        confirmBtn.prop('disabled', true)
            .addClass('loading')
            .html(`<span class="spinner-border spinner-border-sm" role="status"></span> Deleting...`);

        const response = await $.ajax({
            url: `/Contacts/Delete/${contactId}`,
            method: 'POST',
            headers: { 'RequestVerificationToken': getAntiForgeryToken() }
        });

        if (response.success) {
            rowElement.fadeOut(400, () => rowElement.remove());
            showToast('Contact deleted successfully');
            const currentPage = parseInt($('#contactsTable').data('current-page')) || 1;
            const searchTerm = $('#searchInput').val();
            refreshGrid(currentPage, searchTerm);
        }
    } catch (error) {
        showToast(`Error deleting contact: ${error.statusText}`, 'danger');
    } finally {
        confirmBtn.prop('disabled', false).removeClass('loading').html(originalHtml);
        $('#deleteConfirmationModal').modal('hide');
        return { contactId: null, rowElement: null };
    }
}

export async function loadPage(page, search = '', showToast) {
    try {
        const data = await $.get('/Contacts', { page, search });
        const $newContent = $(data);
        const $pagination = $newContent.find('.pagination');
        const $tableBody = $newContent.find('#contactsTable tbody');
        const serverPage = parseInt($newContent.find('#contactsTable').data('current-page')) || page;

        $('.pagination').html($pagination.html());
        $('#contactsTable')
            .html($newContent.find('#contactsTable').html())
            .data('current-page', serverPage);

        if ($tableBody.children().length === 0 && serverPage > 1) {
            return loadPage(serverPage - 1, search, showToast);
        }
    } catch (error) {
        showToast('Error loading contacts', 'danger');
    }
}
