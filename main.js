// Main JavaScript functionality
class JewelryStore {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.checkLoginStatus();
    }

    setupEventListeners() {
        // Form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Scroll animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-card, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Cart functionality
    addToCart(productId) {
        const products = {
            1: { id: 1, name: 'Nhẫn Kim Cương Vĩnh Cửu', price: 25000000, image: '💍' },
            2: { id: 2, name: 'Vòng Cổ Ngọc Trai', price: 18000000, image: '📿' },
            3: { id: 3, name: 'Bông Tai Sapphire', price: 12000000, image: '💎' }
        };

        const product = products[productId];
        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`Đã thêm ${product.name} vào giỏ hàng`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        if (cartItems) {
            cartItems.innerHTML = this.cart.length ? this.cart.map(item => `
                <div class="cart-item">
                    <div class="item-image">${item.image}</div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()}₫ x ${item.quantity}</p>
                    </div>
                    <button onclick="store.removeFromCart(${item.id})" class="btn btn-outline">Xóa</button>
                </div>
            `).join('') : '<p>Giỏ hàng trống</p>';
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toLocaleString() + '₫';
        }
    }

    saveCart() {
        localStorage.setItem('jewelryCart', JSON.stringify(this.cart));
    }

    loadCart() {
        const savedCart = localStorage.getItem('jewelryCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }

    // Authentication
    checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.showUserMenu();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
            email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
            password: formData.get('password') || e.target.querySelector('input[type="password"]').value
        };

        try {
            // Simulate API call
            await this.simulateRegister(userData);
            this.showNotification('Đăng ký thành công!');
            this.closeLogin();
        } catch (error) {
            this.showNotification('Đăng ký thất bại: ' + error.message, 'error');
        }
    }

    simulateRegister(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userData.email && userData.password) {
                    localStorage.setItem('authToken', 'simulated-token');
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Vui lòng điền đầy đủ thông tin'));
                }
            }, 1000);
        });
    }

    loginWithGoogle() {
        // Simulate Google OAuth
        this.showNotification('Đang kết nối với Google...');
        setTimeout(() => {
            localStorage.setItem('authToken', 'google-simulated-token');
            localStorage.setItem('user', JSON.stringify({
                name: 'Google User',
                email: 'user@gmail.com'
            }));
            this.showNotification('Đăng nhập thành công với Google!');
            this.closeLogin();
            this.showUserMenu();
        }, 1500);
    }

    showUserMenu() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const navActions = document.querySelector('.nav-actions');
        if (navActions && user.name) {
            navActions.innerHTML = `
                <div class="user-menu">
                    <span>Xin chào, ${user.name}</span>
                    <button class="btn btn-outline" onclick="store.logout()">Đăng xuất</button>
                    <button class="btn btn-primary" onclick="openCart()">
                        🛒 Giỏ hàng <span class="cart-count">${this.cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </button>
                </div>
            `;
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        location.reload();
    }

    // UI Helpers
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    openLogin() {
        document.getElementById('loginModal').style.display = 'flex';
    }

    closeLogin() {
        document.getElementById('loginModal').style.display = 'none';
    }

    openCart() {
        document.getElementById('cartModal').style.display = 'flex';
    }

    closeCart() {
        document.getElementById('cartModal').style.display = 'none';
    }
}

// Global functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addToCart(productId) {
    store.addToCart(productId);
}

function openLogin() {
    store.openLogin();
}

function closeLogin() {
    store.closeLogin();
}

function openCart() {
    store.openCart();
}

function closeCart() {
    store.closeCart();
}

function loginWithGoogle() {
    store.loginWithGoogle();
}

// Initialize store
const store = new JewelryStore();

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const loginModal = document.getElementById('loginModal');
    const cartModal = document.getElementById('cartModal');
    
    if (e.target === loginModal) store.closeLogin();
    if (e.target === cartModal) store.closeCart();
});