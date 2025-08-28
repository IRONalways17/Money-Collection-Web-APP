// Main JavaScript for HopeFund Homepage

class HomePage {
    constructor() {
        this.campaigns = [];
        this.statistics = {};
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadStatistics();
            await this.loadFeaturedCampaigns();
            this.animateCounters();
            this.setupIntersectionObserver();
        } catch (error) {
            console.error('Failed to initialize homepage:', error);
        }
    }
    
    async loadStatistics() {
        try {
            // In a real app, this would fetch from Firestore
            // For demo purposes, using static data
            this.statistics = {
                livesImpacted: 12547,
                totalDonations: 23456789,
                activeCampaigns: 156,
                countriesReached: 89
            };
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Failed to load statistics:', error);
            // Use fallback data
            this.statistics = {
                livesImpacted: 10000,
                totalDonations: 20000000,
                activeCampaigns: 100,
                countriesReached: 50
            };
        }
    }
    
    async loadFeaturedCampaigns() {
        try {
            // In a real app, this would fetch from Firestore
            // For demo purposes, using static data
            this.campaigns = [
                {
                    id: 'education-001',
                    title: 'Education for Underprivileged Children',
                    description: 'Help provide quality education and school supplies to children in rural communities who cannot afford basic educational needs.',
                    image: '/images/education-campaign.jpg',
                    category: 'education',
                    raised: 45000,
                    goal: 100000,
                    donorsCount: 127,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    urgent: false
                },
                {
                    id: 'healthcare-002',
                    title: 'Emergency Medical Support',
                    description: 'Urgent medical assistance for families affected by recent natural disasters who need immediate healthcare support.',
                    image: '/images/healthcare-campaign.jpg',
                    category: 'healthcare',
                    raised: 78000,
                    goal: 150000,
                    donorsCount: 234,
                    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                    urgent: true
                },
                {
                    id: 'disaster-003',
                    title: 'Flood Relief Operations',
                    description: 'Immediate relief supplies including food, water, and temporary shelter for families displaced by recent flooding.',
                    image: '/images/disaster-campaign.jpg',
                    category: 'disaster',
                    raised: 92000,
                    goal: 200000,
                    donorsCount: 456,
                    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                    urgent: true
                }
            ];
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.renderFeaturedCampaigns();
            
        } catch (error) {
            console.error('Failed to load campaigns:', error);
            this.renderCampaignError();
        }
    }
    
    renderFeaturedCampaigns() {
        const container = document.getElementById('featured-campaigns');
        if (!container) return;
        
        const campaignsHTML = this.campaigns.map(campaign => {
            const campaignCard = new Components.CampaignCard(campaign);
            return campaignCard.render();
        }).join('');
        
        container.innerHTML = campaignsHTML;
        
        // Add fade-in animation
        const cards = container.querySelectorAll('.campaign-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    renderCampaignError() {
        const container = document.getElementById('featured-campaigns');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-state" style="text-align: center; padding: var(--space-16); color: var(--neutral-600);">
                <svg style="width: 64px; height: 64px; margin-bottom: var(--space-4); color: var(--neutral-400);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>Unable to load campaigns</h3>
                <p>Please check your internet connection and try again.</p>
                <button class="btn btn-outline" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
    
    animateCounters() {
        const counterElements = document.querySelectorAll('.stat-number[data-target]');
        
        counterElements.forEach(element => {
            const target = element.dataset.target;
            let numericTarget;
            
            // Parse different number formats
            if (target.includes('₹')) {
                numericTarget = parseInt(target.replace(/[₹,]/g, ''));
            } else if (target.includes(',')) {
                numericTarget = parseInt(target.replace(/,/g, ''));
            } else {
                numericTarget = parseInt(target);
            }
            
            // Use the utility function to animate
            utils.animateCounter(element, numericTarget);
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special handling for stats section
                    if (entry.target.classList.contains('stats')) {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);
        
        // Observe sections for animations
        const sections = document.querySelectorAll('.stats, .featured-campaigns, .cta-section');
        sections.forEach(section => observer.observe(section));
    }
}

// Newsletter Subscription
class NewsletterSubscription {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const emailInput = this.form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!utils.isValidEmail(email)) {
            utils.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        try {
            utils.showLoading();
            
            // In a real app, this would save to Firestore
            await this.subscribeEmail(email);
            
            utils.showToast('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
            
        } catch (error) {
            utils.handleError(error, 'Failed to subscribe. Please try again.');
        } finally {
            utils.hideLoading();
        }
    }
    
    async subscribeEmail(email) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, this would call a Firebase function
        console.log('Subscribing email:', email);
        
        // Store in Firestore (pseudo code)
        // await db.collection('newsletter').add({
        //     email,
        //     subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
        //     active: true
        // });
    }
}

// Search Functionality
class SearchHandler {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        
        if (this.searchInput) {
            this.init();
        }
    }
    
    init() {
        this.searchInput.addEventListener('input', utils.debounce(this.handleSearch.bind(this), 300));
        
        if (this.searchButton) {
            this.searchButton.addEventListener('click', this.handleSearchButton.bind(this));
        }
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearchButton();
            }
        });
    }
    
    handleSearch(e) {
        const query = e.target.value.trim();
        
        if (query.length >= 3) {
            this.performSearch(query);
        }
    }
    
    handleSearchButton() {
        const query = this.searchInput.value.trim();
        if (query) {
            // Redirect to causes page with search query
            window.location.href = `/causes.html?search=${encodeURIComponent(query)}`;
        }
    }
    
    async performSearch(query) {
        // This would typically search campaigns in Firestore
        console.log('Searching for:', query);
        
        // Show search suggestions or redirect to results page
        // For now, just redirect to causes page
    }
}

// Page Analytics
class Analytics {
    constructor() {
        this.sessionStart = Date.now();
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupScrollTracking();
        this.setupClickTracking();
        this.setupFormTracking();
        
        // Track session duration on page unload
        window.addEventListener('beforeunload', () => {
            this.trackSessionDuration();
        });
    }
    
    trackPageView() {
        // In a real app, this would send to analytics service
        console.log('Page view tracked:', {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });
    }
    
    setupScrollTracking() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const trackedMilestones = new Set();
        
        window.addEventListener('scroll', utils.debounce(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.trackEvent('scroll_milestone', { percentage: milestone });
                }
            });
        }, 100));
    }
    
    setupClickTracking() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn');
            if (button) {
                this.trackEvent('button_click', {
                    text: button.textContent.trim(),
                    className: button.className,
                    location: this.getElementPath(button)
                });
            }
            
            const link = e.target.closest('a');
            if (link && link.href) {
                this.trackEvent('link_click', {
                    href: link.href,
                    text: link.textContent.trim(),
                    external: !link.href.startsWith(window.location.origin)
                });
            }
        });
    }
    
    setupFormTracking() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.trackEvent('form_submit', {
                    formId: form.id || 'unknown',
                    action: form.action || 'unknown'
                });
            }
        });
    }
    
    trackEvent(eventName, properties = {}) {
        console.log('Event tracked:', {
            event: eventName,
            properties,
            timestamp: new Date().toISOString()
        });
        
        // In a real app, send to analytics service
        // Example: gtag('event', eventName, properties);
    }
    
    trackSessionDuration() {
        const duration = Date.now() - this.sessionStart;
        this.trackEvent('session_duration', {
            duration: Math.round(duration / 1000) // in seconds
        });
    }
    
    getElementPath(element) {
        const path = [];
        while (element && element !== document.body) {
            const selector = element.tagName.toLowerCase();
            if (element.id) {
                path.unshift(`${selector}#${element.id}`);
                break;
            } else if (element.className) {
                path.unshift(`${selector}.${element.className.split(' ')[0]}`);
            } else {
                path.unshift(selector);
            }
            element = element.parentElement;
        }
        return path.join(' > ');
    }
}

// Initialize homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HomePage();
    new NewsletterSubscription();
    new SearchHandler();
    new Analytics();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                utils.smoothScrollTo(target);
            }
        });
    });
    
    // Add loading states for external links
    document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach(link => {
        link.addEventListener('click', function() {
            this.textContent = 'Loading...';
        });
    });
});

// Export for global access
window.HomePage = HomePage;
