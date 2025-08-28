// About Page JavaScript

class AboutPage {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.setupScrollAnimations();
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
                    
                    // Special handling for impact section
                    if (entry.target.classList.contains('impact-section')) {
                        this.animateImpactCounters();
                    }
                    
                    // Special handling for values cards
                    if (entry.target.classList.contains('values-grid')) {
                        this.animateValueCards();
                    }
                    
                    // Special handling for team section
                    if (entry.target.classList.contains('team-grid')) {
                        this.animateTeamMembers();
                    }
                }
            });
        }, observerOptions);
        
        // Observe sections for animations
        const sections = document.querySelectorAll('.story-section, .values-section, .impact-section, .team-section');
        sections.forEach(section => observer.observe(section));
        
        // Observe specific elements
        const animatedElements = document.querySelectorAll('.values-grid, .team-grid');
        animatedElements.forEach(element => observer.observe(element));
    }
    
    animateCounters() {
        // This will be called when the impact section comes into view
        const counterElements = document.querySelectorAll('.impact-number[data-target]');
        
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
            utils.animateCounter(element, numericTarget, 3000);
        });
    }
    
    animateImpactCounters() {
        // Only animate if not already animated
        const impactSection = document.querySelector('.impact-section');
        if (!impactSection.classList.contains('counters-animated')) {
            impactSection.classList.add('counters-animated');
            this.animateCounters();
        }
    }
    
    animateValueCards() {
        const cards = document.querySelectorAll('.value-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    animateTeamMembers() {
        const members = document.querySelectorAll('.team-member');
        members.forEach((member, index) => {
            member.style.opacity = '0';
            member.style.transform = 'scale(0.9) translateY(20px)';
            
            setTimeout(() => {
                member.style.transition = 'all 0.8s ease-out';
                member.style.opacity = '1';
                member.style.transform = 'scale(1) translateY(0)';
            }, index * 150);
        });
    }
    
    setupScrollAnimations() {
        // Add scroll-triggered animations for various elements
        const parallaxElements = document.querySelectorAll('.story-visual, .about-hero-content');
        
        window.addEventListener('scroll', utils.debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            parallaxElements.forEach(element => {
                if (this.isElementInViewport(element)) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });
        }, 10));
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }
}

// Timeline Animation for Story Section
class StoryTimeline {
    constructor() {
        this.timelineData = [
            {
                year: '2024',
                title: 'HopeFund Founded',
                description: 'Started as a passion project to connect donors with verified causes'
            },
            {
                year: '2024',
                title: 'First Campaign',
                description: 'Successfully funded our first education campaign for rural children'
            },
            {
                year: '2024',
                title: 'Technology Integration',
                description: 'Integrated Google Pay for seamless and secure donation processing'
            },
            {
                year: '2025',
                title: 'Growing Impact',
                description: 'Expanding reach across India with enhanced platform features'
            }
        ];
        
        this.createTimeline();
    }
    
    createTimeline() {
        const timelineContainer = document.querySelector('.story-timeline');
        if (!timelineContainer) return;
        
        const timelineHTML = this.timelineData.map((item, index) => `
            <div class="timeline-item" data-index="${index}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-year">${item.year}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `).join('');
        
        timelineContainer.innerHTML = timelineHTML;
        
        // Animate timeline items when they come into view
        this.observeTimelineItems();
    }
    
    observeTimelineItems() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });
        
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Testimonials Carousel (if needed in future)
class TestimonialsCarousel {
    constructor() {
        this.testimonials = [
            {
                name: 'Priya Sharma',
                role: 'Regular Donor',
                image: '/images/testimonial-1.jpg',
                quote: 'HopeFund makes it so easy to contribute to causes I care about. The transparency gives me confidence that my donations are making a real difference.'
            },
            {
                name: 'Rajesh Kumar',
                role: 'Campaign Organizer',
                image: '/images/testimonial-2.jpg',
                quote: 'Creating a campaign on HopeFund was straightforward, and the platform helped us reach our goal faster than we expected. Amazing community support!'
            },
            {
                name: 'Dr. Anjali Patel',
                role: 'Healthcare Professional',
                image: '/images/testimonial-3.jpg',
                quote: 'We have used HopeFund to raise funds for medical emergencies. The quick processing and reliable platform have been lifesaving for our patients.'
            }
        ];
        
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        const container = document.querySelector('.testimonials-container');
        if (!container) return;
        
        this.render();
        this.setupAutoRotation();
    }
    
    render() {
        const container = document.querySelector('.testimonials-container');
        const testimonial = this.testimonials[this.currentIndex];
        
        container.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-quote">
                    <svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <p>"${testimonial.quote}"</p>
                </div>
                <div class="testimonial-author">
                    <img src="${testimonial.image}" alt="${testimonial.name}" class="author-avatar">
                    <div class="author-info">
                        <div class="author-name">${testimonial.name}</div>
                        <div class="author-role">${testimonial.role}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupAutoRotation() {
        setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }
    
    nextTestimonial() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.render();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AboutPage();
    
    // Initialize timeline if container exists
    if (document.querySelector('.story-timeline')) {
        new StoryTimeline();
    }
    
    // Initialize testimonials if container exists
    if (document.querySelector('.testimonials-container')) {
        new TestimonialsCarousel();
    }
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                utils.smoothScrollTo(target);
            }
        });
    });
});

// Additional CSS for About page animations
const aboutPageStyles = `
.about-hero {
    padding: calc(80px + var(--space-20)) 0 var(--space-20);
    background: linear-gradient(135deg, var(--primary-50), var(--neutral-50));
    text-align: center;
    position: relative;
    overflow: hidden;
}

.about-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/hero-pattern.svg') repeat;
    opacity: 0.03;
    pointer-events: none;
}

.about-title {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    color: var(--neutral-900);
    margin-bottom: var(--space-6);
    line-height: var(--line-height-tight);
}

.about-subtitle {
    font-size: var(--font-size-xl);
    color: var(--neutral-600);
    max-width: 800px;
    margin: 0 auto;
    line-height: var(--line-height-relaxed);
}

.story-section {
    padding: var(--space-20) 0;
    background: white;
}

.story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    align-items: center;
}

.story-content h2 {
    font-size: var(--font-size-3xl);
    color: var(--neutral-900);
    margin-bottom: var(--space-6);
}

.story-lead {
    font-size: var(--font-size-lg);
    color: var(--primary-600);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-6);
    line-height: var(--line-height-relaxed);
}

.story-content p {
    color: var(--neutral-700);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--space-4);
}

.story-visual {
    position: relative;
}

.story-image {
    border-radius: var(--radius-2xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    transform: rotate(2deg);
    transition: transform var(--transition-slow);
}

.story-image:hover {
    transform: rotate(0deg) scale(1.02);
}

.story-image img {
    width: 100%;
    height: auto;
    display: block;
}

.values-section {
    padding: var(--space-20) 0;
    background: var(--neutral-50);
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-8);
}

.value-card {
    background: white;
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-md);
    text-align: center;
    transition: all var(--transition-normal);
    border: 1px solid var(--neutral-200);
}

.value-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.value-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--space-6);
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
}

.value-icon svg {
    width: 40px;
    height: 40px;
    color: var(--primary-600);
}

.value-title {
    font-size: var(--font-size-xl);
    color: var(--neutral-900);
    margin-bottom: var(--space-4);
}

.value-description {
    color: var(--neutral-600);
    line-height: var(--line-height-relaxed);
}

.impact-section {
    padding: var(--space-24) 0;
    background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    color: white;
    text-align: center;
}

.impact-title {
    color: white;
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-4);
}

.impact-subtitle {
    font-size: var(--font-size-lg);
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: var(--space-16);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.impact-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-12);
}

.impact-stat {
    text-align: center;
}

.impact-number {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    color: white;
    margin-bottom: var(--space-2);
    line-height: 1;
}

.impact-label {
    font-size: var(--font-size-xl);
    color: rgba(255, 255, 255, 0.95);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-3);
}

.impact-description {
    font-size: var(--font-size-base);
    color: rgba(255, 255, 255, 0.8);
    line-height: var(--line-height-relaxed);
}

.team-section {
    padding: var(--space-20) 0;
    background: white;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-12);
    justify-items: center;
}

.team-member {
    background: var(--neutral-50);
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
    text-align: center;
    transition: all var(--transition-normal);
    border: 1px solid var(--neutral-200);
    max-width: 350px;
}

.team-member:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    background: white;
}

.member-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto var(--space-6);
    border-radius: var(--radius-full);
    overflow: hidden;
    border: 4px solid var(--primary-200);
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.member-name {
    font-size: var(--font-size-xl);
    color: var(--neutral-900);
    margin-bottom: var(--space-2);
}

.member-role {
    color: var(--primary-600);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-4);
}

.member-bio {
    color: var(--neutral-600);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--space-6);
}

.member-social {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
}

.member-social a {
    padding: var(--space-2);
    background: var(--primary-100);
    color: var(--primary-600);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
}

.member-social a:hover {
    background: var(--primary-500);
    color: white;
    transform: translateY(-2px);
}

@media screen and (max-width: 968px) {
    .about-title {
        font-size: var(--font-size-4xl);
    }
    
    .story-grid {
        grid-template-columns: 1fr;
        gap: var(--space-12);
    }
    
    .story-visual {
        order: -1;
    }
    
    .values-grid {
        grid-template-columns: 1fr;
        gap: var(--space-6);
    }
    
    .impact-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-8);
    }
    
    .impact-number {
        font-size: var(--font-size-4xl);
    }
}

@media screen and (max-width: 480px) {
    .about-hero {
        padding: calc(70px + var(--space-12)) 0 var(--space-12);
    }
    
    .about-title {
        font-size: var(--font-size-3xl);
    }
    
    .about-subtitle {
        font-size: var(--font-size-lg);
    }
    
    .impact-stats {
        grid-template-columns: 1fr;
        gap: var(--space-6);
    }
    
    .impact-number {
        font-size: var(--font-size-3xl);
    }
    
    .team-member {
        padding: var(--space-6);
    }
    
    .member-avatar {
        width: 100px;
        height: 100px;
    }
}

/* Animation classes */
.animate-in {
    animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = aboutPageStyles;
document.head.appendChild(styleSheet);
