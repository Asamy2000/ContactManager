
export function initPhoneInputs() {
    this.addModalIti = window.intlTelInput(document.querySelector('.phone-input'), {
        initialCountry: this.initialCountry,
        separateDialCode: true,
        utilsScript: this.utilsScriptUrl
    });
    this.editIti = null;
}

export function replaceWithEditableField(cell, field, value) {
    if (field === 'phone') {
        const input = $('<input type="tel" class="form-control edit-input phone-input">');
        cell.html(input);
        this.currentEditIti = window.intlTelInput(input[0], {
            initialCountry: "auto",
            geoIpLookup: this.getGeoIpLocation?.bind(this),
            separateDialCode: true,
            utilsScript: this.utilsScriptUrl
        });
        this.currentEditIti.setNumber(value);
    } else {
        cell.html(`<input type="text" class="form-control edit-input" value="${value}">`);
    }
}
