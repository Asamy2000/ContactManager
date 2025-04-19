
export function validateEditForm(row, currentEditIti, showToast) {
    if (currentEditIti && !currentEditIti.isValidNumber()) {
        showToast('Please enter a valid phone number', 'danger');
        return false;
    }

    const name = getFieldValue(row, 'name');
    const address = getFieldValue(row, 'address');

    if (!name) {
        showToast('Name is required', 'danger');
        return false;
    }

    if (!address) {
        showToast('Address is required', 'danger');
        return false;
    }

    return true;
}

export function collectEditData(row, currentEditIti) {
    const getFieldValue = (field) => {
        const cell = row.find(`[data-field="${field}"]`);
        return cell.find('input').length ? cell.find('input').val().trim() : cell.text().trim();
    };

    const phone = currentEditIti
        ? currentEditIti.getNumber(intlTelInputUtils.numberFormat.E164)
        : getFieldValue('phone');

    return {
        Name: getFieldValue('name'),
        Phone: phone,
        Address: getFieldValue('address'),
        Notes: getFieldValue('notes')
    };
}

export function validateAddForm(form, addModalIti, showToast) {
    if (!form[0].checkValidity()) {
        form.addClass('was-validated');
        return false;
    }

    if (!addModalIti.isValidNumber()) {
        showToast('Please enter a valid phone number', 'danger');
        return false;
    }

    return true;
}

export function collectAddFormData(form, addModalIti) {
    return {
        Name: form.find('[name="Name"]').val().trim(),
        Phone: addModalIti.getNumber(),
        Address: form.find('[name="Address"]').val().trim(),
        Notes: form.find('[name="Notes"]').val().trim()
    };
}

function getFieldValue(row, field) {
    const cell = row.find(`[data-field="${field}"]`);
    return cell.find('input').length ? cell.find('input').val().trim() : cell.text().trim();
}
