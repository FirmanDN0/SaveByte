document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CORE INITIALIZATION & LOADERS
       ========================================================================== */
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 600);
        });
        
        // Fallback safety in case load event takes too long
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 2000);
    }

    // Active path page nav highlighter
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPath = (link.getAttribute('href') || '').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile Hamburger Toggle Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on navigation click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Sticky Scroll Navigation Header Toggles
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. SMOOTH SCREEN SWEEP PAGE TRANSITIONS
       ========================================================================== */
    // Create and append page transition overlay in DOM if not present
    let sweepOverlay = document.querySelector('.page-transition-overlay');
    if (!sweepOverlay) {
        sweepOverlay = document.createElement('div');
        sweepOverlay.className = 'page-transition-overlay sweep-in';
        sweepOverlay.innerHTML = `
            <div class="page-transition-logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12 3C8.2 3 6 5.3 6 8.3c0 3.8 3.8 6.8 6 8.3 2.3-1.5 6-4.5 6-8.3C18 5.3 15.8 3 12 3zm0 9c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                </svg>
                <span>SaveBite</span>
            </div>
        `;
        document.body.appendChild(sweepOverlay);
    } else {
        sweepOverlay.classList.add('sweep-in');
    }

    // Play slide-out transition on load to reveal page contents
    window.addEventListener('load', () => {
        setTimeout(() => {
            sweepOverlay.classList.remove('sweep-in');
            sweepOverlay.classList.add('sweep-out');
            
            // Clean up class after animation ends
            setTimeout(() => {
                sweepOverlay.classList.remove('sweep-out');
            }, 600);
        }, 300);
    });

    // Fallback in case load event takes too long
    setTimeout(() => {
        if (sweepOverlay.classList.contains('sweep-in')) {
            sweepOverlay.classList.remove('sweep-in');
            sweepOverlay.classList.add('sweep-out');
            setTimeout(() => {
                sweepOverlay.classList.remove('sweep-out');
            }, 600);
        }
    }, 1500);

    // Intercept clicks on local navigation links to trigger sweep transitions
    document.querySelectorAll('a').forEach(anchor => {
        const href = anchor.getAttribute('href');
        const target = anchor.getAttribute('target');
        
        // Only target internal HTML links, ignore anchors, javascript triggers
        if (href && href.endsWith('.html') && (!target || target === '_self')) {
            anchor.addEventListener('click', (e) => {
                // Ensure it's not pointing to the exact current page to prevent lock
                const currentFile = window.location.pathname.split('/').pop() || 'index.html';
                const hrefFile = href.split('/').pop();
                if (hrefFile === currentFile) return;

                e.preventDefault();
                
                // Trigger cursor hide
                const cursor = document.querySelector('.custom-cursor');
                const cursorRing = document.querySelector('.custom-cursor-ring');
                if (cursor) cursor.style.opacity = '0';
                if (cursorRing) cursorRing.style.opacity = '0';

                // Slide overlay in (from translateX(-100%) to 0%)
                sweepOverlay.classList.add('sweep-in');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 550);
            });
        }
    });

    /* ==========================================================================
       3. AWWWARDS-STYLE MORPHING CURSOR
       ========================================================================== */
    let cursor = document.querySelector('.custom-cursor');
    let cursorRing = document.querySelector('.custom-cursor-ring');

    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
    }
    if (!cursorRing) {
        cursorRing = document.createElement('div');
        cursorRing.className = 'custom-cursor-ring';
        cursorRing.innerHTML = `<span class="cursor-text">VIEW</span>`;
        document.body.appendChild(cursorRing);
    }

    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
    });

    // Spring delay loop for outer ring coordinates
    function updateRing() {
        const dx = cursorX - ringX;
        const dy = cursorY - ringY;
        
        // Easing factor to create smooth trail
        ringX += dx * 0.15;
        ringY += dy * 0.15;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(updateRing);
    }
    updateRing();

    // Context-sensitive hover expansions
    function applyCursorHovers() {
        const textElement = cursorRing.querySelector('.cursor-text');
        
        // Standard Link / Buttons Expansion hovers
        document.querySelectorAll('a, button, select, input[type="range"], .clickable').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorRing.classList.add('hovered');
                if (textElement) {
                    textElement.textContent = 'OPEN';
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
                cursorRing.classList.remove('accent-hover');
            });
        });

        // Food Card Images (Large morph + "RESCUE" text)
        document.querySelectorAll('.card-img-wrapper img, .hero-main-img, .modal-hero-img').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorRing.classList.add('hovered');
                if (textElement) {
                    textElement.textContent = 'RESCUE';
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
            });
        });

        // Action Highlights (Wishlists and Adding Carts triggers)
        document.querySelectorAll('.fav-btn, .btn-accent, .floating-cart-toggle').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorRing.classList.add('hovered');
                cursorRing.classList.add('accent-hover');
                if (textElement) {
                    textElement.textContent = 'LOVE';
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
                cursorRing.classList.remove('accent-hover');
            });
        });
    }
    applyCursorHovers();

    // Expose hovers dynamically to marketplace templates
    window.refreshCursorListeners = applyCursorHovers;

    /* ==========================================================================
       4. SUBTLE PARALLAX CARD TILT
       ========================================================================== */
    function applyCardTiltListeners() {
        document.querySelectorAll('.food-card, .stat-box, .sdg-card, .dev-card, .dash-stat-card, .tilt-element').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                // Very subtle tilt intensity
                const angleX = (yc - y) / 25; 
                const angleY = (x - xc) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-3px)`;
                card.style.transition = 'transform 0.15s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                card.style.transition = 'transform 0.4s ease';
            });
        });
    }
    applyCardTiltListeners();
    window.refreshCardTilts = applyCardTiltListeners;

    /* ==========================================================================
       5. VIEWPORT SCROLL REVEAL OBSERVERS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger stat counting animations on reveal
                const counters = entry.target.querySelectorAll('.stat-counter');
                counters.forEach(counter => animateCounter(counter));
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       6. DYNAMIC STAT COUNT-UP MOTOR
       ========================================================================== */
    function animateCounter(counter) {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000; // time in ms
        const start = 0;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Cubic Easing Out formulation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * (target - start) + start);
            
            // Formatting output
            if (target >= 100000) {
                counter.textContent = currentVal.toLocaleString('id-ID') + suffix;
            } else {
                counter.textContent = currentVal + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    /* ==========================================================================
       7. TESTIMONIAL SLIDER IMPLEMENTATION
       ========================================================================== */
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');

    if (testimonialTrack && testimonialItems.length > 0) {
        let currentIndex = 0;
        
        function updateTestimonialSlider() {
            testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
                updateTestimonialSlider();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % testimonialItems.length;
                updateTestimonialSlider();
            });
        }
    }

    /* ==========================================================================
       8. GLOBAL NOTIFICATIONS TOAST
       ========================================================================== */
    window.showSaveBiteToast = function(message, type = 'success') {
        let toast = document.querySelector('.sb-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'sb-toast';
            // Styling toast directly
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 30px;
                background-color: var(--text-dark);
                color: var(--bg-cream);
                padding: 16px 28px;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                font-family: 'Outfit', sans-serif;
                font-weight: 700;
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 99999;
                transform: translateY(150px);
                opacity: 0;
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }

        const successSVG = `
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:#4BB543;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        `;
        const alertSVG = `
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:var(--accent);"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        `;

        toast.innerHTML = (type === 'success' ? successSVG : alertSVG) + `<span>${message}</span>`;
        
        // Show Toast
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 50);

        // Auto Hide
        setTimeout(() => {
            toast.style.transform = 'translateY(150px)';
            toast.style.opacity = '0';
        }, 3000);
    };

});
