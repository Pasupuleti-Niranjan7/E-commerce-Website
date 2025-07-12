// Sample product data
const products = [
  {
    id: 1,
    title: "Red Jacket",
    price: 85.99,
    image: "image-1.avif",
    trending: true,
  },
  {
    id: 2,
    title: "Trendy Hoodie",
    price:70.15,
    image: "image-2.avif",
    trending: true,
  },
  {
    id: 3,
    title: "Pair of T-shirts",
    price: 15,
    image: "image-3.avif",
    trending: false,
  },
  {
    id: 4,
    title: "Children T-shirts with Toys",
    price: 10,
    image: "image-4.avif",
    trending: false,
  },
  {
    id: 5,
    title: "T-shirt",
    price: 60.915,
    image: "image-5.avif",
    trending: false,
  },
  {
    id: 6,
    title: "Trendy Jacket",
    price: 70,
    image: "image-6.avif",
    trending: true,
  },
  {
    id: 7,
    title: "Puma Shoes",
    price: 125.99,
    image: "image-7.avif",
    trending: true,
  },
  {
    id: 8,
    title: "Jacket",
    price: 49.99,
    image: "image-8.avif",
    trending: false,
  },
  {
    id: 9,
    title: "White Shirt",
    price: 50,
    image: "image-9.avif",
    trending: false,
  }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCartCount();
    
    // Load content based on current page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadTrendingProducts();
    } else if (window.location.pathname.includes('products.html')) {
        loadAllProducts();
    } else if (window.location.pathname.includes('cart.html')) {
        loadCart();
        initializeCheckout();
    }
    
    // Initialize mobile menu
    initializeMobileMenu();
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

function loadTrendingProducts() {
    const trendingGrid = document.getElementById('trending-grid');
    if (!trendingGrid) return;
    
    const trendingProducts = products.filter(product => product.trending);
    trendingGrid.innerHTML = trendingProducts.map(product => createProductCard(product)).join('');
}

function loadAllProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <a href="products.html" class="cta-button">Shop Now</a>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => createCartItem(item)).join('');
    updateCartSummary();
}

function createCartItem(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="setQuantity(${item.id}, this.value)" min="1">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function setQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = parseInt(quantity);
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSummary();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    if (taxElement) {
        taxElement.textContent = `$${tax.toFixed(2)}`;
    } 
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutSection = document.getElementById('checkout-section');
    const shippingForm = document.getElementById('shipping-form');
    
    if (checkoutBtn && checkoutSection) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            checkoutSection.classList.remove('hidden');
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

function processOrder() {
    const form = document.getElementById('shipping-form');
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Processing...';
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Hide checkout section
        document.getElementById('checkout-section').classList.add('hidden');
        
        // Update cart count
        updateCartCount();
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Place Order';
        
        // Reload cart
        loadCart();
    }, 2000);
}

function validateForm(formData) {
    const requiredFields = ['name', 'email', 'mobile', 'address', 'city', 'postal'];
    
    for (let field of requiredFields) {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            alert(`Please fill in ${field}, 'error'`);
            return false;
        }
    }
    
    // Validate email
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate mobile
    const mobile = formData.get('mobile');
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!mobileRegex.test(mobile)) {
        alert('Please enter a valid mobile number', 'error');
        return false;
    }
    
    return true;
}

function showSuccessMessage() {
    const cartSection = document.querySelector('.cart-section');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>Order Placed Successfully!</h3>
        <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
    `;
    
    cartSection.insertBefore(successMessage, cartSection.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

