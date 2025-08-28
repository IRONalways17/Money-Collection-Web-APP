/**
 * Thank You Page JavaScript
 * Handles post-donation experience, impact visualization, and social sharing
 */

class ThankYouPage {
    constructor() {
        this.donationData = this.getDonationData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayDonationSummary();
        this.showImpactVisualization();
        this.loadRelatedCampaigns();
        this.triggerCelebration();
        this.animateElements();
    }

    getDonationData() {
        // Get donation data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const stored = localStorage.getItem('recentDonation');
        
        const data = {
            amount: urlParams.get('amount') || (stored ? JSON.parse(stored).amount : 500),
            campaign: urlParams.get('campaign') || (stored ? JSON.parse(stored).campaign : 'Education for All'),
            campaignId: urlParams.get('campaignId') || (stored ? JSON.parse(stored).campaignId : 'edu-001'),
            transactionId: urlParams.get('txn') || this.generateTransactionId(),
            donorName: urlParams.get('name') || 'Anonymous',
            timestamp: Date.now()
        };

        // Store for future reference
        localStorage.setItem('recentDonation', JSON.stringify(data));
        
        return data;
    }

    generateTransactionId() {
        const prefix = 'HF';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    setupEventListeners() {
        // Social sharing buttons
        document.getElementById('share-facebook')?.addEventListener('click', () => {
            this.shareOnFacebook();
        });

        document.getElementById('share-twitter')?.addEventListener('click', () => {
            this.shareOnTwitter();
        });

        document.getElementById('share-whatsapp')?.addEventListener('click', () => {
            this.shareOnWhatsApp();
        });

        document.getElementById('copy-link')?.addEventListener('click', () => {
            this.copyLink();
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSignup.bind(this));
        }
    }

    displayDonationSummary() {
        const { amount, campaign, transactionId } = this.donationData;

        // Update summary elements
        const summaryAmount = document.getElementById('summary-amount');
        const summaryCampaign = document.getElementById('summary-campaign');
        const summaryReference = document.getElementById('summary-reference');

        if (summaryAmount) summaryAmount.textContent = formatCurrency(amount);
        if (summaryCampaign) summaryCampaign.textContent = campaign;
        if (summaryReference) summaryReference.textContent = transactionId;

        // Update page title
        document.title = `Thank You for Your ₹${amount} Donation - HopeFund`;
    }

    showImpactVisualization() {
        const { amount, campaign } = this.donationData;
        const impactContainer = document.getElementById('impact-visualization');
        const impactMessage = document.getElementById('impact-message');

        if (!impactContainer || !impactMessage) return;

        // Calculate impact based on amount and campaign type
        const impact = this.calculateImpact(amount, campaign);
        
        // Create visual representation
        impactContainer.innerHTML = this.createImpactVisual(impact);
        
        // Update impact message
        const messageContent = impactMessage.querySelector('.message-content');
        if (messageContent) {
            messageContent.innerHTML = `
                <h3>Your ₹${formatCurrency(amount)} can help:</h3>
                <ul class="impact-list">
                    ${impact.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
    }

    calculateImpact(amount, campaign) {
        const impacts = {
            education: {
                perUnit: 100,
                units: [
                    { threshold: 1, text: 'Provide school supplies for {count} child', plural: 'Provide school supplies for {count} children' },
                    { threshold: 2, text: 'Fund {count} nutritious meals for students' },
                    { threshold: 5, text: 'Support {count} hours of quality education' }
                ]
            },
            healthcare: {
                perUnit: 200,
                units: [
                    { threshold: 1, text: 'Provide medical checkup for {count} person', plural: 'Provide medical checkups for {count} people' },
                    { threshold: 2, text: 'Fund {count} vaccination doses' },
                    { threshold: 3, text: 'Support {count} days of treatment' }
                ]
            },
            disaster: {
                perUnit: 300,
                units: [
                    { threshold: 1, text: 'Provide emergency kit for {count} family', plural: 'Provide emergency kits for {count} families' },
                    { threshold: 2, text: 'Fund {count} days of shelter' },
                    { threshold: 3, text: 'Support {count} relief packages' }
                ]
            },
            environment: {
                perUnit: 50,
                units: [
                    { threshold: 1, text: 'Plant {count} tree', plural: 'Plant {count} trees' },
                    { threshold: 10, text: 'Clean {count} kg of ocean waste' },
                    { threshold: 20, text: 'Protect {count} sq meters of forest' }
                ]
            }
        };

        // Determine campaign type from campaign name
        let type = 'education'; // default
        const campaignLower = campaign.toLowerCase();
        if (campaignLower.includes('health') || campaignLower.includes('medical')) type = 'healthcare';
        else if (campaignLower.includes('disaster') || campaignLower.includes('relief')) type = 'disaster';
        else if (campaignLower.includes('environment') || campaignLower.includes('tree') || campaignLower.includes('climate')) type = 'environment';

        const config = impacts[type];
        const baseUnits = Math.floor(amount / config.perUnit);

        return {
            type,
            totalAmount: amount,
            items: config.units.map(unit => {
                const count = Math.max(1, Math.floor(baseUnits * unit.threshold));
                const text = count === 1 && unit.text ? unit.text : (unit.plural || unit.text);
                return text.replace('{count}', count);
            })
        };
    }

    createImpactVisual(impact) {
        const { type, totalAmount, items } = impact;
        
        const icons = {
            education: '📚',
            healthcare: '🏥',
            disaster: '🆘',
            environment: '🌱'
        };

        return `
            <div class="impact-visual">
                <div class="impact-icon">
                    <span class="impact-emoji">${icons[type]}</span>
                </div>
                <div class="impact-progress">
                    <div class="progress-circle">
                        <svg class="progress-ring" width="120" height="120">
                            <circle class="progress-ring-circle" stroke="var(--primary-color)" stroke-width="4" fill="transparent" r="50" cx="60" cy="60"/>
                        </svg>
                        <div class="progress-text">
                            <span class="progress-amount">${formatCurrency(totalAmount)}</span>
                            <span class="progress-label">Impact</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadRelatedCampaigns() {
        const grid = document.getElementById('related-campaigns-grid');
        if (!grid) return;

        try {
            // Simulate loading related campaigns
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data for related campaigns
            const campaigns = [
                {
                    id: 'health-001',
                    title: 'Medical Care for Rural Communities',
                    description: 'Providing essential healthcare services to remote villages.',
                    image: '/images/campaigns/health-rural.jpg',
                    goal: 150000,
                    raised: 87500,
                    category: 'healthcare'
                },
                {
                    id: 'env-001',
                    title: 'Clean Water Initiative',
                    description: 'Installing water purification systems in underserved areas.',
                    image: '/images/campaigns/water-clean.jpg',
                    goal: 200000,
                    raised: 123000,
                    category: 'environment'
                },
                {
                    id: 'disaster-001',
                    title: 'Flood Relief Support',
                    description: 'Emergency aid for families affected by recent floods.',
                    image: '/images/campaigns/flood-relief.jpg',
                    goal: 300000,
                    raised: 245000,
                    category: 'disaster',
                    urgent: true
                }
            ];

            // Filter out the current campaign
            const filteredCampaigns = campaigns.filter(c => c.id !== this.donationData.campaignId);

            grid.innerHTML = filteredCampaigns.map(campaign => this.createCampaignCard(campaign)).join('');

        } catch (error) {
            console.error('Error loading related campaigns:', error);
            grid.innerHTML = `
                <div class="error-message">
                    <p>Unable to load related campaigns. Please try again later.</p>
                    <a href="/causes.html" class="btn btn-secondary">View All Campaigns</a>
                </div>
            `;
        }
    }

    createCampaignCard(campaign) {
        const progress = (campaign.raised / campaign.goal) * 100;
        const urgentBadge = campaign.urgent ? '<span class="campaign-badge urgent">Urgent</span>' : '';

        return `
            <div class="campaign-card">
                <div class="campaign-image">
                    <img src="${campaign.image}" alt="${campaign.title}" loading="lazy">
                    ${urgentBadge}
                </div>
                <div class="campaign-content">
                    <h3 class="campaign-title">${campaign.title}</h3>
                    <p class="campaign-description">${campaign.description}</p>
                    
                    <div class="campaign-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-stats">
                            <span class="raised">${formatCurrency(campaign.raised)} raised</span>
                            <span class="goal">of ${formatCurrency(campaign.goal)}</span>
                        </div>
                    </div>
                    
                    <div class="campaign-actions">
                        <a href="/causes.html?id=${campaign.id}" class="btn btn-primary">Donate Now</a>
                        <button class="btn btn-secondary btn-icon" onclick="shareCampaign('${campaign.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    triggerCelebration() {
        // Trigger confetti effect
        setTimeout(() => {
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                // Second burst
                setTimeout(() => {
                    confetti({
                        particleCount: 50,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 }
                    });
                }, 300);

                // Third burst
                setTimeout(() => {
                    confetti({
                        particleCount: 50,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 }
                    });
                }, 600);
            }
        }, 500);

        // Animate checkmark
        const checkmark = document.querySelector('.checkmark');
        if (checkmark) {
            setTimeout(() => {
                checkmark.classList.add('animate');
            }, 200);
        }
    }

    animateElements() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.step-card, .campaign-card, .summary-card').forEach(el => {
            observer.observe(el);
        });

        // Animate progress circles
        const progressRings = document.querySelectorAll('.progress-ring-circle');
        progressRings.forEach(ring => {
            const circumference = 2 * Math.PI * 50;
            ring.style.strokeDasharray = circumference;
            ring.style.strokeDashoffset = circumference;

            setTimeout(() => {
                ring.style.strokeDashoffset = circumference * 0.25; // 75% progress
            }, 1000);
        });
    }

    shareOnFacebook() {
        const { amount, campaign } = this.donationData;
        const text = `I just donated ₹${amount} to "${campaign}" on HopeFund! Join me in making a difference.`;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }

    shareOnTwitter() {
        const { amount, campaign } = this.donationData;
        const text = `I just donated ₹${amount} to "${campaign}" on @HopeFund! Every donation makes a difference. #MakeADifference #Donation`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }

    shareOnWhatsApp() {
        const { amount, campaign } = this.donationData;
        const text = `I just donated ₹${amount} to "${campaign}" on HopeFund! Check out this amazing platform for making a difference: ${window.location.origin}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.origin);
            showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error copying link:', error);
            showToast('Unable to copy link', 'error');
        }
    }

    async handleNewsletterSignup(event) {
        event.preventDefault();
        
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showToast('Successfully subscribed to our newsletter!', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Newsletter signup error:', error);
            showToast('Failed to subscribe. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// Global function for campaign sharing
window.shareCampaign = function(campaignId) {
    const text = `Check out this amazing campaign on HopeFund!`;
    const url = `${window.location.origin}/causes.html?id=${campaignId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'HopeFund Campaign',
            text: text,
            url: url
        });
    } else {
        // Fallback to copying link
        navigator.clipboard.writeText(url).then(() => {
            showToast('Campaign link copied to clipboard!', 'success');
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThankYouPage();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .thank-you-hero {
        background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
        color: white;
        padding: 8rem 0;
        text-align: center;
        position: relative;
        overflow: hidden;
        min-height: 80vh;
        display: flex;
        align-items: center;
    }

    .thank-you-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('/images/pattern.svg') repeat;
        opacity: 0.1;
        animation: float 20s ease-in-out infinite;
    }

    .thank-you-content {
        position: relative;
        z-index: 2;
    }

    .success-animation {
        margin-bottom: 3rem;
    }

    .checkmark-container {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .checkmark {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .checkmark.animate .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark.animate .checkmark-check {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    .checkmark-circle,
    .checkmark-check {
        stroke: white;
        stroke-width: 2;
        stroke-miterlimit: 10;
        fill: none;
    }

    @keyframes stroke {
        100% {
            stroke-dashoffset: 0;
        }
    }

    .thank-you-title {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        line-height: 1.2;
    }

    .thank-you-subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        max-width: 700px;
        margin: 0 auto 3rem;
        line-height: 1.6;
    }

    .donation-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .summary-card {
        background: rgba(255, 255, 255, 0.15);
        padding: 2rem;
        border-radius: 1rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease;
    }

    .summary-card:hover {
        transform: translateY(-5px);
    }

    .summary-icon {
        width: 3rem;
        height: 3rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .summary-icon svg {
        width: 1.5rem;
        height: 1.5rem;
        color: white;
    }

    .summary-details {
        flex: 1;
    }

    .summary-amount,
    .summary-campaign,
    .summary-reference {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        word-break: break-all;
    }

    .summary-label {
        font-size: 0.875rem;
        opacity: 0.8;
    }

    .impact-section {
        padding: 6rem 0;
        background: var(--bg-light);
    }

    .impact-visual {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3rem;
        margin: 3rem 0;
    }

    .impact-icon {
        font-size: 4rem;
        animation: bounce 2s infinite;
    }

    .progress-circle {
        position: relative;
        width: 120px;
        height: 120px;
    }

    .progress-ring {
        transform: rotate(-90deg);
    }

    .progress-ring-circle {
        transition: stroke-dashoffset 1s cubic-bezier(0.65, 0, 0.45, 1);
    }

    .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    .progress-amount {
        display: block;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
    }

    .progress-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .impact-message {
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 3rem auto 0;
    }

    .impact-message h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }

    .impact-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .impact-list li {
        padding: 0.75rem 0;
        padding-left: 2rem;
        position: relative;
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .impact-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }

    .next-steps {
        padding: 6rem 0;
    }

    .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 3rem;
        margin-top: 3rem;
    }

    .step-card {
        text-align: center;
        padding: 2rem;
        border-radius: 1rem;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        opacity: 0;
        transform: translateY(30px);
    }

    .step-card.animate-in {
        opacity: 1;
        transform: translateY(0);
        animation: slideUp 0.6s ease forwards;
    }

    .step-card:hover {
        transform: translateY(-10px);
    }

    .step-number {
        width: 4rem;
        height: 4rem;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin: 0 auto 1.5rem;
    }

    .step-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .step-description {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .sharing-section {
        padding: 6rem 0;
        background: var(--bg-light);
        text-align: center;
    }

    .sharing-title {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .sharing-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin-bottom: 3rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .sharing-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .share-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .share-btn.facebook {
        background: #1877F2;
        color: white;
    }

    .share-btn.twitter {
        background: #1DA1F2;
        color: white;
    }

    .share-btn.whatsapp {
        background: #25D366;
        color: white;
    }

    .share-btn.copy-link {
        background: var(--text-primary);
        color: white;
    }

    .share-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .share-btn svg {
        width: 1.25rem;
        height: 1.25rem;
    }

    .related-campaigns {
        padding: 6rem 0;
    }

    .campaigns-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }

    .campaign-card {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(30px);
    }

    .campaign-card.animate-in {
        opacity: 1;
        transform: translateY(0);
        animation: slideUp 0.6s ease forwards;
    }

    .campaign-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .campaign-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .campaign-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .campaign-card:hover .campaign-image img {
        transform: scale(1.05);
    }

    .campaign-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--error-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .campaign-content {
        padding: 2rem;
    }

    .campaign-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
        line-height: 1.4;
    }

    .campaign-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .campaign-progress {
        margin-bottom: 1.5rem;
    }

    .progress-bar {
        height: 0.5rem;
        background: var(--border-light);
        border-radius: 0.25rem;
        overflow: hidden;
        margin-bottom: 0.75rem;
    }

    .progress-fill {
        height: 100%;
        background: var(--gradient-primary);
        border-radius: 0.25rem;
        transition: width 1s ease;
    }

    .progress-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
    }

    .raised {
        font-weight: 500;
        color: var(--primary-color);
    }

    .goal {
        color: var(--text-tertiary);
    }

    .campaign-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .newsletter-section {
        padding: 6rem 0;
        background: var(--gradient-primary);
        color: white;
    }

    .newsletter-content {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
    }

    .newsletter-title {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .newsletter-subtitle {
        font-size: 1.125rem;
        opacity: 0.9;
        margin-bottom: 3rem;
        line-height: 1.6;
    }

    .newsletter-form .form-group {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .newsletter-input {
        flex: 1;
        max-width: 300px;
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
    }

    .newsletter-input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }

    .newsletter-disclaimer {
        font-size: 0.875rem;
        opacity: 0.8;
        margin: 0;
    }

    .loading-campaigns {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .error-message {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-15px,0);
        }
        70% {
            transform: translate3d(0,-7px,0);
        }
        90% {
            transform: translate3d(0,-2px,0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .thank-you-title {
            font-size: 2.5rem;
        }

        .thank-you-subtitle {
            font-size: 1.125rem;
        }

        .donation-summary {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .summary-card {
            padding: 1.5rem;
        }

        .impact-visual {
            flex-direction: column;
            gap: 2rem;
        }

        .steps-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .sharing-buttons {
            grid-template-columns: repeat(2, 1fr);
        }

        .campaigns-grid {
            grid-template-columns: 1fr;
        }

        .newsletter-form .form-group {
            flex-direction: column;
            align-items: center;
        }

        .newsletter-input {
            max-width: 100%;
        }
    }

    @media (max-width: 480px) {
        .thank-you-hero {
            padding: 6rem 0;
        }

        .thank-you-title {
            font-size: 2rem;
        }

        .sharing-buttons {
            flex-direction: column;
            align-items: center;
        }

        .share-btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
        }
    }
`;

document.head.appendChild(style);
