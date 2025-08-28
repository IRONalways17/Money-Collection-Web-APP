// UI Components for HopeFund

// Navigation Component
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.header = document.querySelector('.header');
        
        this.init();
    }
    
    init() {
        this.setupMobileToggle();
        this.setupScrollEffect();
        this.setupActiveLinks();
    }
    
    setupMobileToggle() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu when pressing escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        const isActive = this.navMenu.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', isActive);
        
        // Animate hamburger
        const hamburgers = this.navToggle.querySelectorAll('.hamburger');
        hamburgers.forEach(hamburger => {
            hamburger.style.transform = isActive ? 'rotate(45deg)' : '';
        });
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        const hamburgers = this.navToggle.querySelectorAll('.hamburger');
        hamburgers.forEach(hamburger => {
            hamburger.style.transform = '';
        });
    }
    
    setupScrollEffect() {
        if (this.header) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', utils.debounce(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
                
                lastScrollY = currentScrollY;
            }, 10));
        }
    }
    
    setupActiveLinks() {
        const links = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

// Campaign Card Component
class CampaignCard {
    constructor(data) {
        this.data = data;
    }
    
    render() {
        const progress = utils.calculatePercentage(this.data.raised, this.data.goal);
        const urgentClass = this.data.urgent ? 'urgent' : this.data.category;
        
        return `
            <div class="campaign-card" data-id="${this.data.id}">
                <div class="campaign-image" style="background-image: url('${this.data.image}')">
                    <span class="campaign-badge ${urgentClass}">
                        ${this.data.urgent ? 'Urgent' : this.getCategoryName(this.data.category)}
                    </span>
                </div>
                <div class="campaign-content">
                    <h3 class="campaign-title">${utils.sanitizeInput(this.data.title)}</h3>
                    <p class="campaign-description">${utils.sanitizeInput(this.data.description)}</p>
                    
                    <div class="campaign-progress">
                        <div class="progress-info">
                            <span class="raised-amount">${utils.formatCurrency(this.data.raised)}</span>
                            <span class="progress-percentage">${progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="goal-amount">Goal: ${utils.formatCurrency(this.data.goal)}</div>
                    </div>
                    
                    <div class="campaign-meta">
                        <span class="donors-count">${this.data.donorsCount || 0} donors</span>
                        <span class="time-left">${this.getTimeLeft()}</span>
                    </div>
                    
                    <div class="campaign-actions">
                        <button class="btn btn-primary btn-campaign-primary" onclick="openDonationModal('${this.data.id}')">
                            Donate Now
                        </button>
                        <button class="btn-campaign-secondary" onclick="shareCampaign('${this.data.id}')" aria-label="Share campaign">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCategoryName(category) {
        const categories = {
            education: 'Education',
            healthcare: 'Healthcare',
            disaster: 'Disaster Relief',
            environment: 'Environment',
            community: 'Community'
        };
        return categories[category] || 'Other';
    }
    
    getTimeLeft() {
        if (!this.data.deadline) return '';
        
        const now = new Date();
        const deadline = new Date(this.data.deadline);
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Campaign ended';
        if (diffDays === 0) return 'Last day';
        if (diffDays === 1) return '1 day left';
        return `${diffDays} days left`;
    }
}

// Modal Component
class Modal {
    constructor(options = {}) {
        this.options = {
            closeOnOverlayClick: true,
            closeOnEscape: true,
            ...options
        };
        
        this.isOpen = false;
        this.overlay = null;
        this.modal = null;
    }
    
    create(content, title = '') {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-modal', 'true');
        if (title) {
            this.modal.setAttribute('aria-labelledby', 'modal-title');
        }
        
        this.modal.innerHTML = `
            <div class="modal-header">
                ${title ? `<h2 class="modal-title" id="modal-title">${title}</h2>` : ''}
                <button class="modal-close" aria-label="Close modal">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        
        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);
        
        this.setupEventListeners();
        return this;
    }
    
    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());
        
        if (this.options.closeOnOverlayClick) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
        
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', this.handleEscape.bind(this));
        }
    }
    
    handleEscape(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }
    
    open() {
        if (this.overlay) {
            this.isOpen = true;
            this.overlay.classList.add('show');
            
            // Focus management
            const firstFocusable = this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        return this;
    }
    
    close() {
        if (this.overlay) {
            this.isOpen = false;
            this.overlay.classList.remove('show');
            
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                document.body.style.overflow = '';
                document.removeEventListener('keydown', this.handleEscape);
            }, 300);
        }
        return this;
    }
}

// Donation Form Component
class DonationForm {
    constructor(campaignId) {
        this.campaignId = campaignId;
        this.selectedAmount = null;
        this.paymentMethod = 'googlepay';
        this.googlePayClient = null;
        
        this.init();
    }
    
    init() {
        this.initializeGooglePay();
    }
    
    async initializeGooglePay() {
        try {
            const paymentsClient = new google.payments.api.PaymentsClient({
                environment: googlepayConfig.environment
            });
            
            const isReadyToPay = await paymentsClient.isReadyToPay({
                apiVersion: googlepayConfig.apiVersion,
                apiVersionMinor: googlepayConfig.apiVersionMinor,
                allowedPaymentMethods: googlepayConfig.allowedPaymentMethods
            });
            
            if (isReadyToPay.result) {
                this.googlePayClient = paymentsClient;
            }
        } catch (error) {
            console.error('Google Pay initialization failed:', error);
        }
    }
    
    render() {
        return `
            <form class="donation-form" id="donation-form">
                <div class="form-group">
                    <label class="form-label">Select Amount</label>
                    <div class="amount-selector">
                        <div class="amount-option" data-amount="500">₹500</div>
                        <div class="amount-option" data-amount="1000">₹1,000</div>
                        <div class="amount-option" data-amount="2000">₹2,000</div>
                        <div class="amount-option" data-amount="5000">₹5,000</div>
                        <div class="custom-amount">
                            <input type="number" class="form-input" id="custom-amount" placeholder="Enter custom amount" min="1">
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label required" for="donor-name">Your Name</label>
                    <input type="text" class="form-input" id="donor-name" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label required" for="donor-email">Email Address</label>
                    <input type="email" class="form-input" id="donor-email" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="donor-phone">Phone Number (Optional)</label>
                    <input type="tel" class="form-input" id="donor-phone">
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="anonymous-donation"> Donate anonymously
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Payment Method</label>
                    <div class="payment-methods">
                        <div class="payment-method selected" data-method="googlepay">
                            <img src="/images/google-pay-icon.svg" alt="Google Pay" class="payment-icon">
                            <div class="payment-info">
                                <div class="payment-name">Google Pay</div>
                                <div class="payment-description">Quick and secure payment</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="closeDonationModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="donate-btn">
                        Donate Now
                    </button>
                </div>
            </form>
        `;
    }
    
    setupEventListeners() {
        const form = document.getElementById('donation-form');
        const amountOptions = form.querySelectorAll('.amount-option');
        const customAmountInput = form.querySelector('#custom-amount');
        const donateBtn = form.querySelector('#donate-btn');
        
        // Amount selection
        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                amountOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedAmount = parseInt(option.dataset.amount);
                customAmountInput.value = '';
                this.updateDonateButton();
            });
        });
        
        // Custom amount input
        customAmountInput.addEventListener('input', () => {
            amountOptions.forEach(opt => opt.classList.remove('selected'));
            this.selectedAmount = parseInt(customAmountInput.value);
            this.updateDonateButton();
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processDonation();
        });
    }
    
    updateDonateButton() {
        const donateBtn = document.getElementById('donate-btn');
        if (this.selectedAmount && this.selectedAmount > 0) {
            donateBtn.textContent = `Donate ${utils.formatCurrency(this.selectedAmount)}`;
            donateBtn.disabled = false;
        } else {
            donateBtn.textContent = 'Donate Now';
            donateBtn.disabled = true;
        }
    }
    
    async processDonation() {
        if (!this.selectedAmount || this.selectedAmount <= 0) {
            utils.showToast('Please select a donation amount', 'error');
            return;
        }
        
        const form = document.getElementById('donation-form');
        const formData = new FormData(form);
        const donorName = form.querySelector('#donor-name').value.trim();
        const donorEmail = form.querySelector('#donor-email').value.trim();
        const donorPhone = form.querySelector('#donor-phone').value.trim();
        const anonymous = form.querySelector('#anonymous-donation').checked;
        
        // Validation
        if (!donorName) {
            utils.showToast('Please enter your name', 'error');
            return;
        }
        
        if (!utils.isValidEmail(donorEmail)) {
            utils.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (donorPhone && !utils.isValidPhone(donorPhone)) {
            utils.showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        try {
            utils.showLoading();
            
            if (this.googlePayClient) {
                await this.processGooglePayDonation({
                    amount: this.selectedAmount,
                    donorName,
                    donorEmail,
                    donorPhone,
                    anonymous,
                    campaignId: this.campaignId
                });
            } else {
                throw new Error('Payment method not available');
            }
        } catch (error) {
            utils.handleError(error, 'Payment failed. Please try again.');
        } finally {
            utils.hideLoading();
        }
    }
    
    async processGooglePayDonation(donationData) {
        const paymentDataRequest = {
            ...googlepayConfig,
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: donationData.amount.toString(),
                currencyCode: 'INR',
                totalPriceLabel: 'Donation'
            }
        };
        
        try {
            const paymentData = await this.googlePayClient.loadPaymentData(paymentDataRequest);
            
            // Send payment data to backend for processing
            const response = await this.submitDonation({
                ...donationData,
                paymentData
            });
            
            if (response.success) {
                this.showSuccessMessage(donationData);
                closeDonationModal();
            } else {
                throw new Error(response.error || 'Payment processing failed');
            }
        } catch (error) {
            if (error.statusCode === 'CANCELED') {
                // User canceled the payment
                return;
            }
            throw error;
        }
    }
    
    async submitDonation(donationData) {
        try {
            const submitDonation = functions.httpsCallable('submitDonation');
            const result = await submitDonation(donationData);
            return result.data;
        } catch (error) {
            console.error('Donation submission error:', error);
            throw error;
        }
    }
    
    showSuccessMessage(donationData) {
        const modal = new Modal();
        const content = `
            <div class="text-center">
                <div style="font-size: 4rem; color: var(--success); margin-bottom: var(--space-4);">🎉</div>
                <h3>Thank You for Your Generous Donation!</h3>
                <p>Your donation of <strong>${utils.formatCurrency(donationData.amount)}</strong> has been processed successfully.</p>
                <p>You will receive a confirmation email shortly at <strong>${donationData.donorEmail}</strong></p>
                <p class="text-sm text-neutral-600" style="margin-top: var(--space-6);">
                    Your contribution makes a real difference in someone's life. Thank you for being part of our mission.
                </p>
            </div>
        `;
        
        modal.create(content, 'Donation Successful').open();
        
        // Redirect to thank you page after a delay
        setTimeout(() => {
            window.location.href = `/thank-you.html?amount=${donationData.amount}&campaign=${this.campaignId}`;
        }, 3000);
    }
}

// Global functions for modal handling
window.openDonationModal = function(campaignId) {
    const donationForm = new DonationForm(campaignId);
    const modal = new Modal();
    
    modal.create(donationForm.render(), 'Make a Donation').open();
    donationForm.setupEventListeners();
};

window.closeDonationModal = function() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
};

window.shareCampaign = function(campaignId) {
    const url = `${window.location.origin}/donate.html?id=${campaignId}`;
    const title = 'Help support this important cause';
    
    if (navigator.share) {
        navigator.share({
            title,
            url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        utils.copyToClipboard(url);
        utils.showToast('Campaign link copied to clipboard', 'success');
    }
};

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new Navigation();
});

// Export components
window.Components = {
    Navigation,
    CampaignCard,
    Modal,
    DonationForm
};
