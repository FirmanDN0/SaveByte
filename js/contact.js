document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. FAQ SMOOTH HEIGHT ACCORDIONS
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');

        if (header && body) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items for a clean unified experience
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-body').style.maxHeight = '0px';
                    }
                });

                if (!isActive) {
                    item.classList.add('active');
                    // Calculate scrollHeight dynamically for perfect smooth transition animation
                    body.style.maxHeight = `${body.scrollHeight}px`;
                    
                    if (window.showSaveBiteToast) {
                        window.showSaveBiteToast("FAQ expanded", "success");
                    }
                } else {
                    item.classList.remove('active');
                    body.style.maxHeight = '0px';
                }
            });
        }
    });

    /* ==========================================================================
       2. INQUIRY FORM SUCCESS OVERLAY DIALOGS
       ========================================================================== */
    const contactForm = document.getElementById('contact-us-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subjectVal = document.getElementById('contact-subject').value;

            // Generate Subject Category labels
            let categoryLabel = "General Support";
            if (subjectVal === 'business') {
                categoryLabel = "Merchant Partner Portal Onboarding";
            } else if (subjectVal === 'collaboration') {
                categoryLabel = "Sustainability Media Collaboration";
            }

            // Create success glassmodal popup dynamically in DOM
            let successModal = document.querySelector('.contact-success-overlay');
            if (!successModal) {
                successModal = document.createElement('div');
                successModal.className = 'contact-success-overlay';
                successModal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(18, 36, 30, 0.45);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                `;
                document.body.appendChild(successModal);
            }

            successModal.innerHTML = `
                <div class="glass-card reveal-scale active" style="
                    max-width: 520px;
                    width: 90%;
                    background-color: var(--bg-white);
                    padding: 44px;
                    border-radius: var(--radius-lg);
                    text-align: center;
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--shadow-lg);
                ">
                    <div class="floating-icon" style="
                        width: 72px;
                        height: 72px;
                        border-radius: 50%;
                        background-color: var(--primary-light);
                        color: var(--primary);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 28px;
                    ">
                        <svg viewBox="0 0 24 24" style="width: 36px; height: 36px; fill: currentColor;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                    <h3 style="font-family:'Outfit'; font-size: 1.85rem; margin-bottom:14px; font-weight:800;">Message Received, ${name}!</h3>
                    <p style="font-size:0.95rem; color: var(--text-muted); margin-bottom: 28px; line-height: 1.5;">
                        Your inquiry regarding <strong>${categoryLabel}</strong> has been logged. An onboarding coordinator will contact you at <strong>${email}</strong> within 12 business hours.
                    </p>
                    <button class="btn btn-primary clickable" onclick="closeContactSuccess()" style="padding: 12px 36px; width: 100%;">Return to SaveBite</button>
                </div>
            `;

            // Open Success dialog
            successModal.style.visibility = 'visible';
            successModal.style.opacity = '1';

            // Clear inputs
            contactForm.reset();

            // Refresh Awwwards custom pointer tracking
            if (window.refreshCursorListeners) window.refreshCursorListeners();
        });
    }

    window.closeContactSuccess = function() {
        const successModal = document.querySelector('.contact-success-overlay');
        if (successModal) {
            successModal.style.opacity = '0';
            setTimeout(() => {
                successModal.style.visibility = 'hidden';
            }, 400);
        }
    };

});
