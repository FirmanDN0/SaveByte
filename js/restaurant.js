document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INITIAL SIMULATED BUSINESS DATA
       ========================================================================== */
    let storeListings = [
        {
            id: 101,
            name: "Closing Sweet Croissant Selection (Box of 5)",
            category: "Bakery",
            priceOrig: 85000,
            priceDisc: 30000,
            qty: 4,
            expiryMin: 45,
            soldCount: 0,
            image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
            status: "Active"
        },
        {
            id: 102,
            name: "Crisp Organic Baguette Bundle (Set of 3)",
            category: "Bakery",
            priceOrig: 55000,
            priceDisc: 22000,
            qty: 3,
            expiryMin: 90,
            soldCount: 1,
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
            status: "Active"
        }
    ];

    // Live Aggregate Business Stats
    let totalEarnings = 175000;
    let totalWeightSaved = 18.5; // in kg
    let co2Prevented = 46.2; // in kg

    const grid = document.getElementById('inventory-grid');
    const form = document.getElementById('upload-surplus-form');

    // DOM Stat Nodes
    const earningsNode = document.getElementById('dash-earnings');
    const savedNode = document.getElementById('dash-saved');
    const countNode = document.getElementById('dash-active-count');
    const co2Node = document.getElementById('dash-co2');

    /* ==========================================================================
       2. DASHBOARD RENDERING SYSTEMS
       ========================================================================== */
    function renderInventory() {
        if (!grid) return;

        if (storeListings.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px 0; color: var(--text-muted);">
                    <svg viewBox="0 0 24 24" style="width: 52px; height: 52px; fill: currentColor; opacity: 0.3; margin-bottom: 14px;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    <h4 style="font-size: 1.25rem; font-weight:800; color: var(--text-dark);">No active listings listed</h4>
                    <p style="font-size: 0.9rem; margin-top: 6px;">Add surplus pastries or meals below to activate rescue tracks!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = storeListings.map(item => {
            const isSoldOut = item.status === 'Sold Out';
            const disableAttr = isSoldOut ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : '';
            
            return `
                <div class="food-card reveal-scale active tilt-element" data-id="${item.id}">
                    <span class="discount-badge" style="background-color: ${isSoldOut ? 'var(--text-muted)' : 'var(--accent)'};">
                        ${isSoldOut ? 'SOLD OUT' : `-${Math.round((1 - item.priceDisc / item.priceOrig) * 100)}%`}
                    </span>
                    
                    <div class="card-img-wrapper" style="${isSoldOut ? 'filter: grayscale(0.8);' : ''}">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    
                    <div class="card-body">
                        <span class="card-restaurant">${item.category} Category</span>
                        <h3 class="card-title" style="${isSoldOut ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${item.name}</h3>
                        
                        <div class="card-meta">
                            <span class="meta-item">
                                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/></svg>
                                Stock: ${item.qty} pcs
                            </span>
                            <span class="meta-item">
                                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/></svg>
                                Sold: ${item.soldCount}
                            </span>
                        </div>
                        
                        <div class="card-timer-badge">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 10h-2V7h2v5zm0 4h-2v-2h2v2z"/></svg>
                            <span>Pickup Window: ${item.expiryMin} mins remaining</span>
                        </div>
                        
                        <div class="card-footer" style="gap: 12px; align-items: stretch; flex-direction: column; border-top: 1.5px solid var(--grey-light); padding-top: 14px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                                <span class="price-original">Value Rp ${item.priceOrig.toLocaleString('id-ID')}</span>
                                <span class="price-discount" style="font-size:1.15rem;">Rp ${item.priceDisc.toLocaleString('id-ID')}</span>
                            </div>
                            <div style="display:flex; gap: 8px;">
                                <button class="btn btn-outline clickable" ${disableAttr} onclick="simulateItemSold(${item.id})" style="flex-grow:1; padding: 8px 0; font-size: 0.8rem;">Mark Sold</button>
                                <button class="btn btn-secondary clickable" onclick="removeItemList(${item.id})" style="padding: 8px 16px; font-size: 0.8rem; background-color: var(--grey-light); color: var(--text-dark);">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update statistics DOM summaries
        updateStatsUI();

        // Refresh Awwwards cursor binds & 3D tilt coordinates
        if (window.refreshCursorListeners) window.refreshCursorListeners();
        if (window.refreshCardTilts) window.refreshCardTilts();
    }

    /* ==========================================================================
       3. METRICS UPDATE CALCULATORS
       ========================================================================== */
    function updateStatsUI() {
        const activeCount = storeListings.filter(item => item.status === 'Active').length;
        
        if (earningsNode) earningsNode.textContent = `Rp ${totalEarnings.toLocaleString('id-ID')}`;
        if (savedNode) savedNode.textContent = `${totalWeightSaved.toFixed(1)} kg`;
        if (countNode) countNode.textContent = activeCount.toString();
        if (co2Node) co2Node.textContent = `${co2Prevented.toFixed(1)} kg`;
    }

    /* ==========================================================================
       4. SIMULATE ITEM SOLD ACTIONS
       ========================================================================== */
    window.simulateItemSold = function(id) {
        const item = storeListings.find(x => x.id === id);
        if (!item || item.status === 'Sold Out') return;

        // Perform dynamic state changes
        item.soldCount++;
        item.qty--;
        
        // Accumulate financial & eco-weight stats
        totalEarnings += item.priceDisc;
        // Average surplus meal weight estimated at ~0.5 kg
        totalWeightSaved += 0.5;
        // Methane avoidance cuts roughly 2.5 times weight in CO2
        co2Prevented += 1.25;

        if (item.qty <= 0) {
            item.status = 'Sold Out';
        }

        renderInventory();
        
        if (window.showSaveBiteToast) {
            window.showSaveBiteToast("Item successfully marked as SOLD! Earnings updated.", "success");
        }
    };

    /* ==========================================================================
       5. REMOVE LISTING ACTION
       ========================================================================== */
    window.removeItemList = function(id) {
        const confirmRemove = confirm("Are you sure you want to remove this surplus listing from SaveBite?");
        if (!confirmRemove) return;

        storeListings = storeListings.filter(x => x.id !== id);
        renderInventory();
        
        if (window.showSaveBiteToast) {
            window.showSaveBiteToast("Listing removed successfully.", "alert");
        }
    };

    /* ==========================================================================
       6. WIZARD FORM SUBMISSION & NEW LISTING CREATION
       ========================================================================== */
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('food-name').value;
            const category = document.getElementById('food-category').value;
            const priceOrig = parseInt(document.getElementById('food-price-orig').value);
            const priceDisc = parseInt(document.getElementById('food-price-disc').value);
            const qty = parseInt(document.getElementById('food-qty').value);
            const expiryMin = parseInt(document.getElementById('food-expiry').value);

            // Safety discount validation check
            if (priceDisc >= priceOrig) {
                alert("Discounted price must be less than original retail value!");
                return;
            }

            // High quality mock images matching category inputs
            let catImg = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"; // Bakery default
            if (category === 'Restaurant') {
                catImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
            } else if (category === 'Buffet') {
                catImg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
            } else if (category === 'Grocery') {
                catImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
            }

            const newListing = {
                id: Date.now(),
                name: name,
                category: category,
                priceOrig: priceOrig,
                priceDisc: priceDisc,
                qty: qty,
                expiryMin: expiryMin,
                soldCount: 0,
                image: catImg,
                status: "Active"
            };

            // Prepend new listing immediately
            storeListings.unshift(newListing);
            
            // Re-render
            renderInventory();
            
            // Reset form wizard inputs
            form.reset();

            if (window.showSaveBiteToast) {
                window.showSaveBiteToast("New surplus food listed LIVE on Marketplace!", "success");
            }
        });
    }

    // Store Profile Settings Form Submit handler
    window.handleStoreProfileSave = function(e) {
        e.preventDefault();
        
        const storeName = document.getElementById('store-name').value;
        
        // Dynamically update UI titles with new name
        const welcomeTitle = document.querySelector('.dash-welcome h1');
        if (welcomeTitle) welcomeTitle.textContent = storeName;
        
        const navMerchantName = document.getElementById('nav-merchant-name');
        if (navMerchantName) {
            // Get first two words or short form for nav
            const shortName = storeName.split(' ').slice(0, 2).join(' ');
            navMerchantName.textContent = shortName;
        }

        const avatarCircle = document.querySelector('.user-avatar-badge div');
        if (avatarCircle && storeName) {
            // Take initials
            const initials = storeName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            avatarCircle.textContent = initials;
        }
        
        if (window.showSaveBiteToast) {
            window.showSaveBiteToast("Profil toko berhasil disimpan!", "success");
        }
    };

    // Trigger Initial Render
    renderInventory();

});
