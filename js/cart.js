class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('caliAliCart')) || [];
        this.init();
    }

    init() {
        // Render UI if on cart page
        if (document.getElementById('cart-items-wrapper')) {
            this.renderCartPage();
        }
        // UI updates are handled via events/externally when header loads
    }

    save() {
        localStorage.setItem('caliAliCart', JSON.stringify(this.items));
        this.updateHeaderCount();
        if (document.getElementById('cart-items-wrapper')) {
            this.renderCartPage();
        }
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        this.showToast(`Added ${product.name} to cart`);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }

    updateQuantity(id, change) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.save();
            }
        }
    }

    get totalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    get totalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateHeaderCount() {
        const countEl = document.getElementById('cart-count');
        const priceEl = document.getElementById('cart-total-header');

        if (countEl) {
            countEl.textContent = this.totalItems;
            countEl.style.display = this.totalItems > 0 ? 'flex' : 'none';
        }

        if (priceEl && this.totalItems > 0) {
            priceEl.textContent = `$${this.totalPrice.toFixed(2)}`;
        } else if (priceEl) {
            priceEl.textContent = '';
        }
    }

    renderCartPage() {
        const wrapper = document.getElementById('cart-items-wrapper');
        const summary = document.getElementById('cart-summary');

        if (this.items.length === 0) {
            wrapper.innerHTML = `
                <div class="empty-message">
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any beans yet.</p>
                    <a href="shop.html" class="btn" style="margin-top: 1rem;">Start Shopping</a>
                </div>
            `;
            summary.style.display = 'none';
            return;
        }

        summary.style.display = 'block';
        wrapper.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">$${item.price.toFixed(2)} / ea</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="price-col" style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" onclick="cart.removeItem('${item.id}')">&times;</button>
            </div>
        `).join('');

        document.getElementById('cart-total').textContent = `$${this.totalPrice.toFixed(2)}`;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--color-primary, #333);
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out forwards;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

const cart = new Cart();
