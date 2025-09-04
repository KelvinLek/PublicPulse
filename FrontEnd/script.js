class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Navigation links
        document.getElementById('login-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('login-page');
        });

        document.getElementById('register-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('register-page');
        });

        document.getElementById('dashboard-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('dashboard-page');
        });

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        document.getElementById('home-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('home-page');
        });

        // Auth form switches
        document.getElementById('switch-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('register-page');
        });

        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('login-page');
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        document.getElementById(pageId).classList.add('active');
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            // Simulate API call - replace with actual API endpoint
            const user = await this.mockLoginApi(email, password);
            
            if (user) {
                this.currentUser = user;
                this.saveAuthState();
                this.updateUI();
                this.showPage('dashboard-page');
                this.showMessage('Login successful!', 'success');
            } else {
                this.showMessage('Invalid credentials', 'error');
            }
        } catch (error) {
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        try {
            // Simulate API call - replace with actual API endpoint
            const user = await this.mockRegisterApi(name, email, password);
            
            if (user) {
                this.showMessage('Registration successful! Please login.', 'success');
                this.showPage('login-page');
                // Clear form
                document.getElementById('register-form').reset();
            }
        } catch (error) {
            this.showMessage('Registration failed. Please try again.', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        this.clearAuthState();
        this.updateUI();
        this.showPage('home-page');
        this.showMessage('Logged out successfully', 'success');
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
            this.showPage('dashboard-page');
        }
    }

    saveAuthState() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    clearAuthState() {
        localStorage.removeItem('currentUser');
    }

    updateUI() {
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const dashboardLink = document.getElementById('dashboard-link');
        const logoutLink = document.getElementById('logout-link');

        if (this.currentUser) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            dashboardLink.style.display = 'block';
            logoutLink.style.display = 'block';
            
            // Update user info in dashboard
            document.getElementById('user-email').textContent = this.currentUser.email;
            document.getElementById('user-name').textContent = this.currentUser.name;
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            dashboardLink.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        `;

        document.body.appendChild(messageEl);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Mock API functions - replace with actual API calls
    async mockLoginApi(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock validation - in real app, this would be a server call
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        return user ? { name: user.name, email: user.email } : null;
    }

    async mockRegisterApi(name, email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock registration - in real app, this would be a server call
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return { name, email };
    }
}

// Initialize the auth system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});