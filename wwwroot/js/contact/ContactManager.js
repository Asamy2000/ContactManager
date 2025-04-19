
import { initPhoneInputs } from './phoneInput.js';
import { initSignalR } from './signalRHandlers.js';
import {
    handleEdit, handleDelete, handleSave, handleCancel,
    handleAddContact, handlePagination, handleSearch, handleConfirmDelete
} from './uiHandlers.js';

class ContactManager {
    constructor() {
        this.currentEditIti = null;
        this.initialCountry = 'eg';
        this.utilsScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js';
        this.pendingDelete = { contactId: null, rowElement: null };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/contactHub")
            .build();

        this.refreshGrid = () => {
            const currentPage = parseInt($('#contactsTable').data('current-page')) || 1;
            const searchTerm = $('#searchInput').val();
            import('./ajaxRequests.js').then(module => module.loadPage(currentPage, searchTerm));
        };

        this.init();
    }

    init() {
        initPhoneInputs.call(this);
        this.initEventHandlers();
        this.initToastSystem();
        initSignalR.call(this);
    }

    initEventHandlers() {
        $(document)
            .on('dblclick', '.editable:not(.locked)', handleEdit.bind(this))
            .on('click', '.delete-btn', handleDelete.bind(this))
            .on('click', '.save-btn', handleSave.bind(this))
            .on('click', '.cancel-btn', handleCancel.bind(this))
            .on('click', '.page-link', handlePagination.bind(this))
            .on('input', '#searchInput', handleSearch.bind(this))
            .on('click', '#confirmDeleteBtn', handleConfirmDelete.bind(this));

        $('#addContactForm').submit(handleAddContact.bind(this));
    }

    initToastSystem() {
        $(document).on('hidden.bs.toast', '.toast', function () {
            $(this).remove();
        });
    }
}

export default ContactManager;
