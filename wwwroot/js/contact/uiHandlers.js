
import { replaceWithEditableField } from './phoneInput.js';
import {
    validateEditForm,
    collectEditData,
    validateAddForm,
    collectAddFormData
} from './formValidation.js';

import {
    sendUpdateRequest,
    sendCreateRequest,
    handleConfirmDelete as handleDeleteConfirmAjax,
    loadPage
} from './ajaxRequests.js';

import { showToast } from './utils.js';
import { handleUpdateError, handleCreateError } from './utils.js';

export function handleEdit(e) {
    const { hubConnection } = this;

    const cell = $(e.currentTarget);
    const row = cell.closest('tr');
    const contactId = row.data('contact-id');
    const field = cell.data('field');
    const value = cell.text().trim();

    hubConnection.invoke("LockContact", contactId, currentUserId)
        .then(() => {
            row.addClass('editing').find('.save-btn, .cancel-btn').show();
            replaceWithEditableField.call(this, cell, field, value);
        })
        .catch(err => {
            showToast('Cannot edit: Contact is locked or connection failed', 'danger');
        });
}

export function handleDelete(e) {
    const contactId = $(e.currentTarget).data('contact-id');
    const $row = $(e.currentTarget).closest('tr');

    this.pendingDelete = {
        contactId,
        rowElement: $row
    };

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    deleteModal.show();
}

export function handleSave(e) {
    const {
        currentEditIti,
        hubConnection,
        refreshGrid
    } = this;

    const $btn = $(e.currentTarget);
    const row = $btn.closest('tr');
    const contactId = row.data('contact-id');

    if (currentEditIti && !currentEditIti.isValidNumber()) {
        showToast('Please enter a valid phone number', 'danger');
        return;
    }

    if (!validateEditForm(row, currentEditIti, showToast)) return;

    const contactData = collectEditData(row, currentEditIti);
    sendUpdateRequest(
        contactId,
        contactData,
        row,
        hubConnection,
        currentUserId,
        refreshGrid.bind(this),
        showToast,
        handleUpdateError
    );
}

export function handleCancel(e) {
    const { hubConnection, refreshGrid } = this;

    const row = $(e.currentTarget).closest('tr');
    const contactId = row.data('contact-id');
    row.removeClass('editing').find('.save-btn, .cancel-btn').hide();

    hubConnection.invoke("UnlockContact", contactId, currentUserId)
        .catch(() => {
            showToast('Error unlocking contact', 'danger');
        });

    refreshGrid();
}

export function handleAddContact(e) {
    e.preventDefault();

    const {
        addModalIti,
        refreshGrid
    } = this;

    const form = $(e.currentTarget);

    if (!validateAddForm(form, addModalIti, showToast)) return;

    const formData = collectAddFormData(form, addModalIti);
    sendCreateRequest(
        formData,
        form,
        addModalIti,
        refreshGrid.bind(this),
        showToast,
        handleCreateError
    );
}

export function handlePagination(e) {
    e.preventDefault();
    const page = $(e.currentTarget).data('page');
    loadPage(page, $('#searchInput').val(), showToast);
}

export function handleSearch(e) {
    const searchTerm = $(e.currentTarget).val();
    loadPage(1, searchTerm, showToast);
}

export async function handleConfirmDelete() {
    const { refreshGrid } = this;

    this.pendingDelete = await handleDeleteConfirmAjax(
        this.pendingDelete,
        refreshGrid.bind(this),
        showToast
    );
}
