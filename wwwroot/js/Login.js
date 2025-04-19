function showToast(message, type = 'error') {
    const toast = $(`
        <div class="toast ${type}">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} toast-icon"></i>
            <span class="toast-message">${message}</span>
        </div>
    `);

    $('.toast-container').append(toast);
    toast.fadeIn(300);

    setTimeout(() => {
        toast.fadeOut(300, () => toast.remove());
    }, 5000);
}

$(document).ready(function () {
    // Initialize toast container
    $('body').append('<div class="toast-container"></div>');

    // Initialize jQuery Validation
    $.validator.setDefaults({
        errorClass: 'is-invalid',
        validClass: 'is-valid',
        errorPlacement: function (error, element) {
            // Suppress default error placement
        },
        highlight: function (element) {
            $(element).addClass('is-invalid').removeClass('is-valid');
            $(element).closest('.input-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).addClass('is-valid').removeClass('is-invalid');
            $(element).closest('.input-group').removeClass('has-error');
        },
        invalidHandler: function (form, validator) {
            const errors = validator.numberOfInvalids();
            if (errors) {
                const firstError = validator.errorList[0].message;
                showToast(firstError);
            }
        }
    });

    // Add custom validation rules
    $('#loginForm').validate({
        rules: {
            UserName: {
                required: true
            },
            Password: {
                required: true
            }
        },
        messages: {
            UserName: "Username is required",
            Password: "Password is required"
        }
    });

    // Form submission handler
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        const $form = $(this);
        const $button = $form.find('button[type="submit"]');

        // Clear previous toasts
        $('.toast').remove();

        if (!$form.valid()) {
            return;
        }

        $button.prop('disabled', true);
        $('.button-text').hide();
        $('.loader').show();

        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            data: $form.serialize(),
            success: function (response) {
                if (response.redirectUrl) {
                    showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1500);
                }
            },
            error: function (xhr) {
                $button.prop('disabled', false);
                $('.button-text').show();
                $('.loader').hide();

                let errorMessage = 'An error occurred during login';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                showToast(errorMessage);
            }
        });
    });

    // Real-time validation feedback
    $('input').on('input', function () {
        $(this).valid();
        $(this).closest('.input-group').removeClass('has-error');
    });
});

function togglePassword() {
    const passwordField = $('#Password');
    const icon = $('.password-toggle');

    if (passwordField.attr('type') === 'password') {
        passwordField.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        passwordField.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}