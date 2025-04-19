
export function showToast(message, type = 'success') {
    const toastContainer = $('.toast-container');
    if (!toastContainer.length) return;

    const toast = $(`
        <div class="toast align-items-center text-white bg-${type} border-0 fade">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);

    toastContainer.append(toast);
    new bootstrap.Toast(toast[0]).show();
    setTimeout(() => toast.remove(), 5000);
}

export function getGeoIpLocation(callback, fallback = 'eg') {
    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback(fallback));
}

export function getAntiForgeryToken() {
    return $('input[name="__RequestVerificationToken"]').val();
}

export function handleUpdateError(error, showToast) {
    if (error.responseJSON) {
        const errorData = error.responseJSON;
        if (Array.isArray(errorData)) {
            errorData.forEach(msg => showToast(msg, 'danger'));
        } else if (typeof errorData === 'object') {
            Object.values(errorData).forEach(messages => {
                if (Array.isArray(messages)) {
                    messages.forEach(msg => showToast(msg, 'danger'));
                } else {
                    showToast(messages, 'danger');
                }
            });
        }
    } else {
        showToast('Error updating contact', 'danger');
    }
}

export function handleCreateError(error, form, showToast) {
    if (error.status === 400 && error.responseJSON) {
        Object.entries(error.responseJSON).forEach(([field, messages]) => {
            const input = form.find(`[name="${field}"]`);
            input.addClass('is-invalid');
            input.siblings('.invalid-feedback').text(messages[0]);
        });
    } else {
        showToast('Error saving contact', 'danger');
    }
}
