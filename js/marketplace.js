document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. FOOD DUMMY DATABASE ARRAY
       ========================================================================== */
    const foodProducts = [
        {
            id: 1,
            name: "Assorted Gourmet Croissants",
            category: "bakery",
            restaurant: "La Parisienne Boulangerie",
            originalPrice: 85000,
            discountPrice: 30000,
            discountPercent: 65,
            qtyLeft: 4,
            distance: 1.2,
            expiryMin: 45,
            allergens: "Gluten, Dairy, Eggs",
            pickupWindow: "20:00 - 21:30 Tonight",
            dietary: "Vegetarian Friendly",
            image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
            desc: "A fresh bakery assortment box of our daily signature pastries including 2 premium butter croissants, 1 chocolate pain au chocolat, and 2 almond croissants."
        },
        {
            id: 2,
            name: "Premium Salmon Sushi Platter",
            category: "restaurant",
            restaurant: "Kaizen Artisanal Sushi",
            originalPrice: 120000,
            discountPrice: 45000,
            discountPercent: 62,
            qtyLeft: 2,
            distance: 2.1,
            expiryMin: 25,
            allergens: "Fish, Soy, Gluten",
            pickupWindow: "21:30 - 22:30 Tonight",
            dietary: "Pescatarian, High Protein",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
            desc: "Chef's selection pack of closing hour salmon nigiri (8pcs) and salmon avocado maki rolls (6pcs). Prepared fresh this evening, kept chilled."
        },
        {
            id: 3,
            name: "Organic Farmer's Grocery Box",
            category: "grocery",
            restaurant: "GreenSprout Organic Market",
            originalPrice: 95000,
            discountPrice: 38000,
            discountPercent: 60,
            qtyLeft: 5,
            distance: 0.8,
            expiryMin: 180,
            allergens: "None",
            pickupWindow: "18:00 - 20:00 Tonight",
            dietary: "Vegan, Gluten-Free",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
            desc: "A rescue bundle of slightly surplus organic greens, including ripe heirloom tomatoes, wild spinach, fresh avocado, and organic field strawberries."
        },
        {
            id: 4,
            name: "Closing Sweet Donut Pack (Box of 6)",
            category: "bakery",
            restaurant: "Delight Glazed Donuts",
            originalPrice: 60000,
            discountPrice: 20000,
            discountPercent: 66,
            qtyLeft: 3,
            distance: 1.5,
            expiryMin: 75,
            allergens: "Gluten, Milk, Soy",
            pickupWindow: "19:30 - 21:00 Tonight",
            dietary: "Vegetarian",
            image: "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?auto=format&fit=crop&w=600&q=80",
            desc: "Box containing 6 soft donuts glazed with classic organic chocolate sprinkles, vanilla cream toppings, and regional matcha powder infusions."
        },
        {
            id: 5,
            name: "Signature Veggie Curry Bento",
            category: "restaurant",
            restaurant: "Zen Garden Veg Eatery",
            originalPrice: 70000,
            discountPrice: 28000,
            discountPercent: 60,
            qtyLeft: 2,
            distance: 3.2,
            expiryMin: 15,
            allergens: "Soy, Mustard",
            pickupWindow: "21:00 - 22:00 Tonight",
            dietary: "Vegan, Halal Certified",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            desc: "Healthy bento package consisting of warm organic jasmine rice, spiced local organic vegetable curry, tofu skins, and sweet pickled radishes."
        },
        {
            id: 6,
            name: "Premium Buffet Banquet Assortment",
            category: "buffet",
            restaurant: "Grand Circle Hotel Resto",
            originalPrice: 150000,
            discountPrice: 50000,
            discountPercent: 67,
            qtyLeft: 4,
            distance: 4.1,
            expiryMin: 110,
            allergens: "Dairy, Gluten, Nuts",
            pickupWindow: "21:30 - 23:00 Tonight",
            dietary: "Meat and Veg Mix",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
            desc: "A generous selection pack drawn from our premium grand evening dinner buffet, packaged safely in separate compartments, featuring chicken grill slice, salad bowls, and baked potatoes."
        }
    ];

    /* ==========================================================================
       2. VARIABLES & STATE MANAGERS
       ========================================================================== */
    let cart = JSON.parse(localStorage.getItem('savebite_cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('savebite_favs')) || [];

    const grid = document.getElementById('marketplace-grid');
    const searchInput = document.getElementById('marketplace-search');
    const sortSelect = document.getElementById('marketplace-sort');
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox');
    const priceSlider = document.getElementById('price-slider');
    const priceVal = document.getElementById('price-val');
    const distSlider = document.getElementById('dist-slider');
    const distVal = document.getElementById('dist-val');

    // Timer list trackers
    let countdownInterval = null;

    /* ==========================================================================
       3. CATALOG RENDERING SYSTEM
       ========================================================================== */
    function renderCatalog() {
        if (!grid) return;
        
        // Show Skeleton Cards to mimic loading
        grid.innerHTML = Array(3).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-image skeleton"></div>
                <div class="skeleton-title skeleton"></div>
                <div class="skeleton-text skeleton"></div>
                <div class="skeleton-text skeleton" style="width:50%;"></div>
                <div class="skeleton-btn skeleton"></div>
            </div>
        `).join('');

        setTimeout(() => {
            const query = searchInput.value.toLowerCase();
            const sortVal = sortSelect.value;
            const maxPrice = parseInt(priceSlider.value);
            const maxDist = parseFloat(distSlider.value);
            
            // Get active category values
            const activeCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            // Filter lists
            let filtered = foodProducts.filter(item => {
                const matchesQuery = item.name.toLowerCase().includes(query) || item.restaurant.toLowerCase().includes(query);
                const matchesCategory = activeCategories.length === 0 || activeCategories.includes(item.category);
                const matchesPrice = item.discountPrice <= maxPrice;
                const matchesDist = item.distance <= maxDist;
                
                return matchesQuery && matchesCategory && matchesPrice && matchesDist;
            });

            // Sorter algorithms
            if (sortVal === 'price-low') {
                filtered.sort((a, b) => a.discountPrice - b.discountPrice);
            } else if (sortVal === 'price-high') {
                filtered.sort((a, b) => b.discountPrice - a.discountPrice);
            } else if (sortVal === 'distance') {
                filtered.sort((a, b) => a.distance - b.distance);
            } else if (sortVal === 'discount') {
                filtered.sort((a, b) => b.discountPercent - a.discountPercent);
            }

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                        <svg viewBox="0 0 24 24" style="width: 52px; height: 52px; fill: currentColor; opacity: 0.3; margin-bottom: 14px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <h4 style="font-size: 1.25rem; font-weight:800; color: var(--text-dark);">No items match your active filters</h4>
                        <p style="font-size: 0.9rem; margin-top: 6px;">Try clearing search fields or broadening parameters!</p>
                    </div>
                `;
                return;
            }

            // Render active lists
            grid.innerHTML = filtered.map(item => {
                const isFav = favorites.includes(item.id) ? 'active' : '';
                const isUrgent = item.expiryMin <= 30 ? 'urgent' : '';
                
                return `
                    <div class="food-card reveal-scale active" data-id="${item.id}">
                        <span class="discount-badge">-${item.discountPercent}%</span>
                        <button class="fav-btn ${isFav}" onclick="toggleFavorite(${item.id}, this)">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        
                        <div class="card-img-wrapper" onclick="openDetailsModal(${item.id})">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        
                        <div class="card-body">
                            <span class="card-restaurant">${item.restaurant}</span>
                            <h3 class="card-title" onclick="openDetailsModal(${item.id})" style="cursor:pointer;">${item.name}</h3>
                            
                            <div class="card-meta">
                                <span class="meta-item">
                                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                    ${item.distance} km
                                </span>
                                <span class="meta-item">
                                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/></svg>
                                    ${item.qtyLeft} left
                                </span>
                            </div>
                            
                            <div class="card-timer-badge ${isUrgent}">
                                <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 10h-2V7h2v5zm0 4h-2v-2h2v2z"/></svg>
                                <span class="countdown-timer" data-minutes="${item.expiryMin}">Rescuing in ${item.expiryMin}m</span>
                            </div>
                            
                            <div class="card-footer">
                                <div class="card-price">
                                    <span class="price-original">Rp ${item.originalPrice.toLocaleString('id-ID')}</span>
                                    <span class="price-discount">Rp ${item.discountPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <button class="btn btn-primary clickable" onclick="addToCart(${item.id})" style="padding: 10px 20px; font-size: 0.85rem;">Add to Box</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Re-apply Awwwards cursor overlays & 3D tilt metrics
            if (window.refreshCursorListeners) window.refreshCursorListeners();
            if (window.refreshCardTilts) window.refreshCardTilts();
            
            // Re-init count trackers
            startTimerTickers();
        }, 500);
    }

    /* ==========================================================================
       4. TIMER TICKER COUNTDOWN LOOP
       ========================================================================== */
    function startTimerTickers() {
        if (countdownInterval) clearInterval(countdownInterval);
        
        countdownInterval = setInterval(() => {
            document.querySelectorAll('.countdown-timer').forEach(span => {
                let min = parseInt(span.getAttribute('data-minutes'));
                if (min > 1) {
                    min--;
                    span.setAttribute('data-minutes', min);
                    span.textContent = `Rescuing in ${min}m`;
                    
                    const badge = span.closest('.card-timer-badge');
                    if (min <= 30 && badge) {
                        badge.classList.add('urgent');
                    }
                } else {
                    span.textContent = "Window Expired!";
                    const badge = span.closest('.card-timer-badge');
                    if (badge) badge.classList.add('urgent');
                }
            });
        }, 60000);
    }

    /* ==========================================================================
       5. DETAILED VIEW POPUP MODAL
       ========================================================================== */
    window.openDetailsModal = function(id) {
        const item = foodProducts.find(x => x.id === id);
        if (!item) return;

        const overlay = document.querySelector('.modal-overlay');
        const modalImg = overlay.querySelector('.modal-hero-img');
        const modalRest = overlay.querySelector('.modal-restaurant-tag');
        const modalTitle = overlay.querySelector('.modal-title');
        const modalAller = overlay.querySelector('#modal-allergens');
        const modalPick = overlay.querySelector('#modal-pickup');
        const modalDiet = overlay.querySelector('#modal-dietary');
        const modalDesc = overlay.querySelector('.modal-desc');
        const modalActions = overlay.querySelector('.modal-actions');

        modalImg.src = item.image;
        modalRest.textContent = item.restaurant;
        modalTitle.textContent = item.name;
        modalAller.textContent = item.allergens;
        modalPick.textContent = item.pickupWindow;
        modalDiet.textContent = item.dietary;
        modalDesc.textContent = item.desc;
        
        modalActions.innerHTML = `
            <div class="card-price">
                <span class="price-original" style="font-size: 0.9rem;">Rp ${item.originalPrice.toLocaleString('id-ID')}</span>
                <span class="price-discount" style="font-size: 1.6rem;">Rp ${item.discountPrice.toLocaleString('id-ID')}</span>
            </div>
            <button class="btn btn-accent clickable" onclick="addToCart(${item.id}); closeModal();" style="padding: 12px 30px;">Add to Cart Box</button>
        `;

        overlay.classList.add('active');
        
        if (window.refreshCursorListeners) window.refreshCursorListeners();
    };

    window.closeModal = function() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.classList.remove('active');
    };

    const modalCloseBtn = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    /* ==========================================================================
       6. CART & WISHLIST STORAGE ACTIONS
       ========================================================================== */
    window.toggleFavorite = function(id, btn) {
        btn.classList.toggle('active');
        
        const index = favorites.indexOf(id);
        if (index > -1) {
            favorites.splice(index, 1);
            if (window.showSaveBiteToast) window.showSaveBiteToast("Removed from wishlist favorites", "alert");
        } else {
            favorites.push(id);
            if (window.showSaveBiteToast) window.showSaveBiteToast("Added to wishlist favorites!", "success");
        }
        localStorage.setItem('savebite_favs', JSON.stringify(favorites));
    };

    window.addToCart = function(id) {
        const item = foodProducts.find(x => x.id === id);
        if (!item) return;

        const cartItem = cart.find(x => x.id === id);
        if (cartItem) {
            cartItem.qty++;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                restaurant: item.restaurant,
                price: item.discountPrice,
                image: item.image,
                qty: 1
            });
        }

        localStorage.setItem('savebite_cart', JSON.stringify(cart));
        updateCartUI();
        openCartDrawer();
        
        if (window.showSaveBiteToast) window.showSaveBiteToast("Rescued food added to Box!", "success");
    };

    window.updateQty = function(id, delta) {
        const cartItem = cart.find(x => x.id === id);
        if (!cartItem) return;

        cartItem.qty += delta;
        if (cartItem.qty <= 0) {
            cart = cart.filter(x => x.id !== id);
        }

        localStorage.setItem('savebite_cart', JSON.stringify(cart));
        updateCartUI();
    };

    window.removeCartItem = function(id) {
        cart = cart.filter(x => x.id !== id);
        localStorage.setItem('savebite_cart', JSON.stringify(cart));
        updateCartUI();
        if (window.showSaveBiteToast) window.showSaveBiteToast("Item removed from Box", "alert");
    };

    function updateCartUI() {
        const cartItemsWrapper = document.querySelector('.cart-items-wrapper');
        const cartSubtotal = document.getElementById('cart-subtotal-val');
        const cartBadge = document.querySelector('.cart-badge-count');

        if (!cartItemsWrapper) return;

        if (cart.length === 0) {
            cartItemsWrapper.innerHTML = `
                <div class="cart-empty-state">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    <h4>Your rescue box is empty</h4>
                    <p style="font-size:0.85rem; margin-top:8px;">Claim closing hour pastries or bento packs to save them from being lost!</p>
                </div>
            `;
            if (cartSubtotal) cartSubtotal.textContent = "Rp 0";
            if (cartBadge) cartBadge.style.display = 'none';
            return;
        }

        let total = 0;
        let totalQty = 0;
        
        cartItemsWrapper.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            totalQty += item.qty;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <span class="cart-item-restaurant">${item.restaurant}</span>
                        <div class="cart-item-qty">
                            <button class="qty-btn clickable" onclick="updateQty(${item.id}, -1)">-</button>
                            <span style="font-weight:700;">${item.qty}</span>
                            <button class="qty-btn clickable" onclick="updateQty(${item.id}, 1)">+</button>
                            <button class="cart-item-remove clickable" onclick="removeCartItem(${item.id})">Remove</button>
                        </div>
                    </div>
                    <span class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
            `;
        }).join('');

        if (cartSubtotal) cartSubtotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        
        if (cartBadge) {
            cartBadge.textContent = totalQty;
            cartBadge.style.display = 'flex';
        }
        
        if (window.refreshCursorListeners) window.refreshCursorListeners();
    }

    /* ==========================================================================
       7. CART DRAWER ANIMATION TRIGGERS
       ========================================================================== */
    const cartToggle = document.querySelector('.floating-cart-toggle');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartCloseBtn = document.querySelector('.cart-close-btn');

    function openCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
        }
    }

    function closeCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }

    if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    window.checkoutCart = function() {
        if (cart.length === 0) return;
        
        if (window.showSaveBiteToast) {
            window.showSaveBiteToast("Rescue claimed! Check your pickup timer receipts.", "success");
        }
        
        cart = [];
        localStorage.setItem('savebite_cart', JSON.stringify(cart));
        updateCartUI();
        closeCartDrawer();
    };

    /* ==========================================================================
       8. FILTER LISTENERS & INITIALIZATION
       ========================================================================== */
    if (searchInput) searchInput.addEventListener('input', renderCatalog);
    if (sortSelect) sortSelect.addEventListener('change', renderCatalog);
    categoryCheckboxes.forEach(cb => cb.addEventListener('change', renderCatalog));

    if (priceSlider && priceVal) {
        priceSlider.addEventListener('input', () => {
            priceVal.textContent = `Rp ${parseInt(priceSlider.value).toLocaleString('id-ID')}`;
            renderCatalog();
        });
    }

    if (distSlider && distVal) {
        distSlider.addEventListener('input', () => {
            distVal.textContent = `${parseFloat(distSlider.value)} km`;
            renderCatalog();
        });
    }

    // Run initial renders
    renderCatalog();
    updateCartUI();

});
