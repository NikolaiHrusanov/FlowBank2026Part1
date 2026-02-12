// ============================================
// NEXUSBANK - ENHANCED AUTH & UI
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ---------- THEME TOGGLE ----------
    initThemeToggle();

    // ---------- PASSWORD TOGGLE ----------
    initPasswordToggle();

    // ---------- AUTH FORM TOGGLE ----------
    initAuthToggle();

    // ---------- REGISTRATION ENHANCEMENTS ----------
    initRegistration();

    // ---------- LOGIN ENHANCEMENTS ----------
    initLogin();

    // ---------- FORGOT PASSWORD ----------
    initForgotPassword();

    // ---------- PROTECT ROUTES ----------
    protectRoutes();

    // ---------- AUTO-LOGOUT ON INACTIVITY ----------
    initSessionTimeout();

    // ---------- DASHBOARD LOGOUT ----------
    initLogout();
});

// ============================================
// THEME TOGGLE (with localStorage)
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('nexusbank_theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.add('light-theme');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const icon = this.querySelector('i');
        if (html.classList.contains('dark-theme')) {
            html.classList.remove('dark-theme');
            html.classList.add('light-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('nexusbank_theme', 'light');
        } else {
            html.classList.remove('light-theme');
            html.classList.add('dark-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('nexusbank_theme', 'dark');
        }
    });
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================
function initPasswordToggle() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-password')) {
            const button = e.target.closest('.toggle-password');
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    });
}

// ============================================
// AUTH TOGGLE (LOGIN / REGISTER)
// ============================================
function initAuthToggle() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');

    if (showLoginBtn && showRegisterBtn) {
        showLoginBtn.addEventListener('click', function() {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            showLoginBtn.classList.add('active');
            showRegisterBtn.classList.remove('active');
        });

        showRegisterBtn.addEventListener('click', function() {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            showRegisterBtn.classList.add('active');
            showLoginBtn.classList.remove('active');
        });
    }
}

// ============================================
// REGISTRATION – VALIDATION & SUBMIT
// ============================================
function initRegistration() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    // ----- DOM elements -----
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('regEmail');
    const address = document.getElementById('address');
    const occupation = document.getElementById('occupation');
    const phone = document.getElementById('phone');
    const age = document.getElementById('age');
    const birthYear = document.getElementById('birthYear');
    const idType = document.getElementById('idType');
    const fileInput = document.getElementById('idDocument');
    const password = document.getElementById('regPassword');
    const confirm = document.getElementById('confirmPassword');

    const ageMismatchHint = document.getElementById('ageMismatchHint');
    const passwordMismatch = document.getElementById('passwordMismatch');
    const fileError = document.getElementById('fileError');
    const registerError = document.getElementById('registerError');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthLabel = document.getElementById('passwordStrengthLabel');
    const filePreview = document.getElementById('filePreview');
    const fileNameSpan = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');

    // Requirements elements
    const reqLength = document.getElementById('reqLength');
    const reqUppercase = document.getElementById('reqUppercase');
    const reqLowercase = document.getElementById('reqLowercase');
    const reqNumber = document.getElementById('reqNumber');
    const reqSpecial = document.getElementById('reqSpecial');

    const submitBtn = registerForm.querySelector('button[type="submit"]');

    // ----- Auto‑calculate age from birth year -----
    if (birthYear) {
        birthYear.addEventListener('input', function() {
            const year = parseInt(this.value);
            if (year >= 1900 && year <= new Date().getFullYear()) {
                const calculatedAge = new Date().getFullYear() - year;
                age.value = calculatedAge;
                validateAgeBirthYear();
            }
        });
    }

    // ----- Real‑time field validation (visual) -----
    const fieldsToValidate = [fullName, email, age, birthYear, idType, password, confirm];
    fieldsToValidate.forEach(field => {
        if (field) field.addEventListener('input', validateField);
    });
    if (fileInput) fileInput.addEventListener('change', validateFile);

    // ----- Password strength & requirements -----
    if (password) {
        password.addEventListener('input', function() {
            checkPasswordStrength();
            validateField({ target: password });
            checkPasswordMatch();
        });
    }
    if (confirm) {
        confirm.addEventListener('input', function() {
            checkPasswordMatch();
            validateField({ target: confirm });
        });
    }

    // ----- Age / Birth year validation -----
    function validateAgeBirthYear() {
        const ageVal = parseInt(age.value);
        const birthYearVal = parseInt(birthYear.value);
        if (!ageVal || !birthYearVal) return false;
        const currentYear = new Date().getFullYear();
        const calculated = currentYear - birthYearVal;
        const isValid = Math.abs(calculated - ageVal) <= 1;
        ageMismatchHint.style.display = isValid ? 'none' : 'flex';
        return isValid;
    }
    age.addEventListener('input', validateAgeBirthYear);
    birthYear.addEventListener('input', validateAgeBirthYear);

    // ----- Password strength check -----
    function checkPasswordStrength() {
        const pwd = password.value;
        const criteria = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /\d/.test(pwd),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
        };

        // Update requirement list
        reqLength.innerHTML = criteria.length ? '✓ At least 8 characters' : '✗ At least 8 characters';
        reqUppercase.innerHTML = criteria.uppercase ? '✓ One uppercase letter' : '✗ One uppercase letter';
        reqLowercase.innerHTML = criteria.lowercase ? '✓ One lowercase letter' : '✗ One lowercase letter';
        reqNumber.innerHTML = criteria.number ? '✓ One number' : '✗ One number';
        reqSpecial.innerHTML = criteria.special ? '✓ One special character' : '✗ One special character';

        reqLength.classList.toggle('valid', criteria.length);
        reqUppercase.classList.toggle('valid', criteria.uppercase);
        reqLowercase.classList.toggle('valid', criteria.lowercase);
        reqNumber.classList.toggle('valid', criteria.number);
        reqSpecial.classList.toggle('valid', criteria.special);

        // Strength bar & label
        const strength = Object.values(criteria).filter(Boolean).length;
        if (strength <= 2) {
            strengthBar.style.width = '25%';
            strengthBar.className = 'strength-bar strength-weak';
            if (strengthLabel) {
                strengthLabel.textContent = 'Weak';
                strengthLabel.className = 'strength-label weak';
            }
        } else if (strength <= 4) {
            strengthBar.style.width = '50%';
            strengthBar.className = 'strength-bar strength-medium';
            if (strengthLabel) {
                strengthLabel.textContent = 'Medium';
                strengthLabel.className = 'strength-label medium';
            }
        } else {
            strengthBar.style.width = '100%';
            strengthBar.className = 'strength-bar strength-strong';
            if (strengthLabel) {
                strengthLabel.textContent = 'Strong';
                strengthLabel.className = 'strength-label strong';
            }
        }
        return criteria;
    }

    // ----- Password match check -----
    function checkPasswordMatch() {
        if (!confirm.value) {
            passwordMismatch.style.display = 'none';
            return true;
        }
        const match = password.value === confirm.value;
        passwordMismatch.style.display = match ? 'none' : 'flex';
        return match;
    }

    // ----- Individual field validation (adds .is-valid / .is-invalid) -----
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = false;

        if (field === fullName) {
            isValid = value.length >= 2;
        } else if (field === email) {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else if (field === age) {
            const a = parseInt(value);
            isValid = a >= 18 && a <= 120;
        } else if (field === birthYear) {
            const y = parseInt(value);
            const currentYear = new Date().getFullYear();
            isValid = y >= 1900 && y <= currentYear;
        } else if (field === idType) {
            isValid = value !== '' && value !== null;
        } else if (field === password) {
            const pwd = password.value;
            isValid = pwd.length >= 8 &&
                /[A-Z]/.test(pwd) &&
                /[a-z]/.test(pwd) &&
                /\d/.test(pwd) &&
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
        } else if (field === confirm) {
            isValid = confirm.value === password.value;
        }

        field.classList.toggle('is-valid', isValid);
        field.classList.toggle('is-invalid', !isValid && value !== '');
    }

    // ----- File validation & preview -----
    function validateFile() {
        const file = fileInput.files[0];
        if (!file) {
            fileError.style.display = 'none';
            filePreview.style.display = 'none';
            return false;
        }
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const isValidType = validTypes.includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

        if (!isValidType) {
            fileError.textContent = 'Only JPG, PNG, or PDF files are allowed.';
            fileError.style.display = 'flex';
            filePreview.style.display = 'none';
            fileInput.value = '';
            return false;
        }
        if (!isValidSize) {
            fileError.textContent = 'File size must be less than 5MB.';
            fileError.style.display = 'flex';
            filePreview.style.display = 'none';
            fileInput.value = '';
            return false;
        }

        fileError.style.display = 'none';
        // Show preview
        fileNameSpan.textContent = file.name;
        filePreview.style.display = 'flex';
        return true;
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function() {
            fileInput.value = '';
            filePreview.style.display = 'none';
            fileError.style.display = 'none';
        });
    }

    // ----- Disable submit until form is valid -----
    function isFormValid() {
        const fieldsValid = 
            fullName.value.trim().length >= 2 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
            parseInt(age.value) >= 18 && parseInt(age.value) <= 120 &&
            parseInt(birthYear.value) >= 1900 && parseInt(birthYear.value) <= new Date().getFullYear() &&
            idType.value !== '' &&
            password.value.length >= 8 &&
            /[A-Z]/.test(password.value) &&
            /[a-z]/.test(password.value) &&
            /\d/.test(password.value) &&
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value) &&
            password.value === confirm.value &&
            fileInput.files.length > 0 &&
            validateAgeBirthYear();

        submitBtn.disabled = !fieldsValid;
        return fieldsValid;
    }

    // Attach validation to all fields for button state
    registerForm.addEventListener('input', isFormValid);
    registerForm.addEventListener('change', isFormValid);

    // ----- Registration submit -----
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!isFormValid()) {
            registerError.textContent = 'Please fix all errors before submitting.';
            registerError.style.display = 'flex';
            return;
        }

        // Check if email exists
        const users = JSON.parse(localStorage.getItem('nexusbank_users')) || [];
        if (users.find(u => u.email === email.value.trim())) {
            registerError.textContent = 'This email is already registered.';
            registerError.style.display = 'flex';
            return;
        }

        // Show loading
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';

        // Convert file to Base64
        const reader = new FileReader();
        reader.onload = function(e) {
            // Simple hash (DO NOT use in production)
            const hashPassword = btoa(password.value); 

            const newUser = {
                id: Date.now(),
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                address: address.value.trim(),
                occupation: occupation.value.trim(),
                phone: phone.value.trim(),
                age: parseInt(age.value),
                birthYear: parseInt(birthYear.value),
                idType: idType.value,
                idDocument: e.target.result,
                password: hashPassword,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('nexusbank_users', JSON.stringify(users));

            setTimeout(() => {
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                // Auto-fill login email and switch to login
                document.getElementById('loginEmail').value = newUser.email;
                document.getElementById('showLoginBtn').click();
                alert('Registration successful! Please sign in.');
                registerForm.reset();
                // Reset validation styles
                document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
                strengthBar.style.width = '0%';
                if (strengthLabel) {
                    strengthLabel.textContent = 'Enter a password';
                    strengthLabel.className = 'strength-label';
                }
                filePreview.style.display = 'none';
                submitBtn.disabled = true;
            }, 1500);
        };
        reader.readAsDataURL(fileInput.files[0]);
    });
}

// ============================================
// LOGIN – AUTHENTICATION & REMEMBER ME
// ============================================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberCheck = document.querySelector('#loginForm .checkbox input[type="checkbox"]');
    const loadingOverlay = document.getElementById('loadingOverlay');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }

        loadingOverlay.style.display = 'flex';

        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('nexusbank_users')) || [];
            const user = users.find(u => u.email === email && atob(u.password) === password);

            if (user) {
                // Create session
                const session = {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    loginTime: new Date().toISOString()
                };

                if (rememberCheck && rememberCheck.checked) {
                    // Persistent session (localStorage)
                    localStorage.setItem('nexusbank_current_user', JSON.stringify(session));
                } else {
                    // Session-only (sessionStorage) – cleared when browser closed
                    sessionStorage.setItem('nexusbank_current_user', JSON.stringify(session));
                }

                window.location.href = 'dashboard.html';
            } else {
                loadingOverlay.style.display = 'none';
                alert('Invalid email or password.');
            }
        }, 1500);
    });
}

// ============================================
// FORGOT PASSWORD – SIMULATION
// ============================================
function initForgotPassword() {
    const forgotLink = document.querySelector('.forgot-link');
    if (!forgotLink) return;

    forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        const email = prompt('Enter your email address:');
        if (email && email.includes('@')) {
            // Generate a reset token and store (demo)
            const token = Math.random().toString(36).substr(2, 10);
            const resetRequests = JSON.parse(localStorage.getItem('nexusbank_reset_tokens')) || [];
            resetRequests.push({ email, token, expires: Date.now() + 3600000 }); // 1 hour
            localStorage.setItem('nexusbank_reset_tokens', JSON.stringify(resetRequests));
            alert(`Password reset link sent to ${email} (demo token: ${token})`);
        } else if (email) {
            alert('Please enter a valid email address.');
        }
    });
}

// ============================================
// PROTECT ROUTES – REDIRECT IF NOT LOGGED IN
// ============================================
function protectRoutes() {
    const protectedPages = ['dashboard.html', 'accounts.html', 'transfer.html', 'transactions.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const user = JSON.parse(localStorage.getItem('nexusbank_current_user')) ||
                     JSON.parse(sessionStorage.getItem('nexusbank_current_user'));
        if (!user) {
            window.location.href = 'login.html';
        } else {
            // Optionally display user name in header
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => {
                el.textContent = user.name;
            });
        }
    }
}

// ============================================
// SESSION TIMEOUT – AUTO LOGOUT AFTER 30 MIN
// ============================================
function initSessionTimeout() {
    const TIMEOUT = 30 * 60 * 1000; // 30 minutes
    let timeoutId;

    function resetTimer() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(logout, TIMEOUT);
    }

    function logout() {
        const protectedPages = ['dashboard.html', 'accounts.html', 'transfer.html', 'transactions.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            localStorage.removeItem('nexusbank_current_user');
            sessionStorage.removeItem('nexusbank_current_user');
            alert('Your session has expired. Please login again.');
            window.location.href = 'login.html';
        }
    }

    // Events that reset the timer
    window.addEventListener('load', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);
}

// ============================================
// DASHBOARD LOGOUT BUTTON
// ============================================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('nexusbank_current_user');
            sessionStorage.removeItem('nexusbank_current_user');
            window.location.href = 'login.html';
        });
    }
}