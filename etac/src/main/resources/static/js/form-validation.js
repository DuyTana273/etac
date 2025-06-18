/**
 * Form Validation Script
 * Xử lý validation form theo thời gian thực
 */

document.addEventListener('DOMContentLoaded', function() {
    // Lấy form và các trường dữ liệu
    const contactForm = document.querySelector('.contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('send');
    const formStatus = document.querySelector('.form-status');

    // Regex patterns
    const patterns = {
        name: /^[\p{L}\s]+$/u, // Chỉ chữ cái và khoảng trắng, hỗ trợ Unicode
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^\+?\d{8,15}$/, // Số điện thoại 8-15 chữ số, có thể có dấu +
    };

    // Error messages
    const errorMessages = {
        name: {
            empty: 'お名前を入力してください',
            invalid: 'お名前は文字と空白のみを含める必要があります'
        },
        email: {
            empty: 'メールアドレスを入力してください',
            invalid: '有効なメールアドレスを入力してください'
        },
        phone: {
            empty: '電話番号を入力してください',
            invalid: '有効な電話番号を入力してください'
        },
        subject: {
            empty: '件名を入力してください'
        },
        message: {
            empty: 'お問い合わせ内容を入力してください'
        }
    };

    // Form validation state
    const validationState = {
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
    };

    // Tạo và hiển thị thông báo lỗi
    function showError(input, message) {
        // Xóa thông báo lỗi cũ nếu có
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Tạo và thêm thông báo lỗi mới
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger';
        errorDiv.textContent = message;

        // Thêm vào sau input
        input.parentElement.appendChild(errorDiv);

        // Thêm class để đánh dấu trường có lỗi
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    // Xóa thông báo lỗi
    function clearError(input) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    // Kiểm tra tất cả các trường và cập nhật trạng thái nút gửi
    function updateSubmitButtonState() {
        const isFormValid = Object.values(validationState).every(state => state === true);
        submitButton.disabled = !isFormValid;

        if (isFormValid) {
            submitButton.classList.remove('disabled');
        } else {
            submitButton.classList.add('disabled');
        }
    }

    // Validate từng trường
    function validateField(input, fieldName) {
        // Kiểm tra trường trống
        if (input.value.trim() === '') {
            showError(input, errorMessages[fieldName].empty);
            validationState[fieldName] = false;
            return false;
        }

        // Kiểm tra định dạng (nếu có pattern)
        if (patterns[fieldName] && !patterns[fieldName].test(input.value)) {
            showError(input, errorMessages[fieldName].invalid);
            validationState[fieldName] = false;
            return false;
        }

        // Nếu không có lỗi
        clearError(input);
        validationState[fieldName] = true;
        return true;
    }

    // Thêm sự kiện blur (mất focus) cho các trường
    nameInput.addEventListener('blur', function() {
        validateField(this, 'name');
        updateSubmitButtonState();
    });

    emailInput.addEventListener('blur', function() {
        validateField(this, 'email');
        updateSubmitButtonState();
    });

    phoneInput.addEventListener('blur', function() {
        validateField(this, 'phone');
        updateSubmitButtonState();
    });

    subjectInput.addEventListener('blur', function() {
        validateField(this, 'subject');
        updateSubmitButtonState();
    });

    messageInput.addEventListener('blur', function() {
        validateField(this, 'message');
        updateSubmitButtonState();
    });

    // Thêm sự kiện input (thay đổi nội dung) cho các trường
    nameInput.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
            validateField(this, 'name');
            updateSubmitButtonState();
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
            validateField(this, 'email');
            updateSubmitButtonState();
        }
    });

    phoneInput.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
            validateField(this, 'phone');
            updateSubmitButtonState();
        }
    });

    subjectInput.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
            validateField(this, 'subject');
            updateSubmitButtonState();
        }
    });

    messageInput.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
            validateField(this, 'message');
            updateSubmitButtonState();
        }
    });

    // Form submit handler
    contactForm.addEventListener('submit', function(event) {
        // Validate tất cả các trường
        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isPhoneValid = validateField(phoneInput, 'phone');
        const isSubjectValid = validateField(subjectInput, 'subject');
        const isMessageValid = validateField(messageInput, 'message');

        // Nếu có bất kỳ trường nào không hợp lệ, không gửi form
        if (!(isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid)) {
            event.preventDefault();
            return false;
        }

        // Hiển thị thông báo đang gửi
        formStatus.style.display = 'block';

        // Hiển thị trạng thái loading
        submitButton.innerHTML = submitButton.getAttribute('data-loading-text');
        submitButton.disabled = true;

        // Cho phép form gửi
        return true;
    });

    // Validate tất cả các trường khi tải trang (nếu có giá trị)
    if (nameInput.value.trim()) validateField(nameInput, 'name');
    if (emailInput.value.trim()) validateField(emailInput, 'email');
    if (phoneInput.value.trim()) validateField(phoneInput, 'phone');
    if (subjectInput.value.trim()) validateField(subjectInput, 'subject');
    if (messageInput.value.trim()) validateField(messageInput, 'message');

    // Cập nhật trạng thái nút gửi
    updateSubmitButtonState();
}); 