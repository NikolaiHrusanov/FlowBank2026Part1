// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate login - in real app, this would be an API call
            console.log('Login attempt:', { username, password });
            
            // Redirect to dashboard after successful login
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }

    // Simulate loading user data on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        // This would typically come from an API
        const userData = {
            name: 'John Doe',
            balance: 12458.50,
            lastLogin: new Date().toLocaleDateString()
        };
        
        // Update user info in the dashboard
        const userInfoElements = document.querySelectorAll('.user-info span');
        userInfoElements.forEach(el => {
            if (el.textContent.includes('Welcome')) {
                el.textContent = `Welcome, ${userData.name}`;
            }
        });
    }

    // Add animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Mobile menu toggle for dashboard pages
    const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
    const sidebar = document.querySelector('#sidebar');
    const sidebarOverlay = document.querySelector('#sidebarOverlay');
    
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
        
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
    
    // Form validation helper
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        
        return isValid;
    }
});

// Currency formatter
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Date formatter
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Sample transaction data (in real app, this would come from API)
const sampleTransactions = [
    {
        id: 1,
        description: 'Amazon Purchase',
        amount: -89.99,
        date: new Date(),
        type: 'shopping'
    },
    {
        id: 2,
        description: 'Salary Deposit',
        amount: 3500.00,
        date: new Date(Date.now() - 86400000),
        type: 'deposit'
    }
];