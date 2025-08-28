/**
 * Contact Page JavaScript
 * Handles contact form submission, validation, and interactive elements
 */

class ContactPage {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.chatButton = document.getElementById('open-chat');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeFAQ();
        this.initializeFormValidation();
        this.animateElements();
    }

    setupEventListeners() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Real-time validation
        const inputs = this.form?.querySelectorAll('input, select, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Chat button
        if (this.chatButton) {
            this.chatButton.addEventListener('click', this.openChat.bind(this));
        }

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber.bind(this));
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        // Validate all fields
        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            this.showLoading();
            this.disableForm();

            // Simulate API call - replace with actual endpoint
            await this.submitContactForm(data);

            // Show success message
            this.showSuccess();
            this.resetForm();

        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showError('Failed to send message. Please try again or contact us directly.');
        } finally {
            this.hideLoading();
            this.enableForm();
        }
    }

    async submitContactForm(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real application, you would submit to Firebase Functions
        // const functions = firebase.functions();
        // const submitContact = functions.httpsCallable('submitContactForm');
        // return await submitContact(data);

        console.log('Contact form submitted:', data);
        return { success: true };
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Custom validations
        const email = document.getElementById('email');
        if (email.value && !this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }

        const phone = document.getElementById('phone');
        if (phone.value && !this.isValidPhone(phone.value)) {
            this.showFieldError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (isRequired && !value) {
            this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
            return false;
        }

        // Type-specific validation
        if (value) {
            switch (field.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        this.showFieldError(field, 'Please enter a valid email address');
                        return false;
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        this.showFieldError(field, 'Please enter a valid phone number');
                        return false;
                    }
                    break;
            }

            // Length validation
            if (field.name === 'message' && value.length < 10) {
                this.showFieldError(field, 'Message must be at least 10 characters long');
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Indian phone number validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    formatPhoneNumber(event) {
        let value = event.target.value.replace(/\D/g, '');
        
        // Indian phone number formatting
        if (value.startsWith('91')) {
            value = '+91 ' + value.substring(2);
        } else if (value.length === 10) {
            value = '+91 ' + value;
        }
        
        event.target.value = value;
    }

    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'none';
        }
    }

    disableForm() {
        const inputs = this.form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    enableForm() {
        const inputs = this.form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }

    showSuccess() {
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    }

    showError(message) {
        showToast(message, 'error');
    }

    resetForm() {
        this.form.reset();
        
        // Clear all field errors
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    openChat() {
        // Simulate opening chat widget
        showToast('Chat feature coming soon! Please use the contact form or email us directly.', 'info');
    }

    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.style.maxHeight = '0';
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = '0';
                    item.classList.remove('active');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    item.classList.add('active');
                }
            });
        });
    }

    initializeFormValidation() {
        // Add required field indicators
        const requiredLabels = document.querySelectorAll('.form-label.required');
        requiredLabels.forEach(label => {
            if (!label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.textContent = ' *';
                indicator.setAttribute('aria-label', 'required');
                label.appendChild(indicator);
            }
        });

        // Character counter for message field
        const messageField = document.getElementById('message');
        if (messageField) {
            this.addCharacterCounter(messageField);
        }
    }

    addCharacterCounter(textarea) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.textContent = `0 / ${maxLength}`;
        
        textarea.parentNode.appendChild(counter);
        textarea.setAttribute('maxlength', maxLength);
        
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            counter.textContent = `${length} / ${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        });
    }

    animateElements() {
        // Animate contact methods
        const methodCards = document.querySelectorAll('.method-card');
        methodCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });

        // Animate form sections
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.animationDelay = `${index * 0.05}s`;
            group.classList.add('fade-in-up');
        });

        // Parallax effect for hero section
        const hero = document.querySelector('.contact-hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .contact-hero {
        background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
        color: white;
        padding: 8rem 0 4rem;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .contact-hero::before {
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

    .contact-title {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .contact-subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .contact-methods {
        padding: 6rem 0;
        background: var(--bg-light);
    }

    .methods-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }

    .method-card {
        background: white;
        padding: 2.5rem 2rem;
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .method-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--gradient-primary);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .method-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .method-card:hover::before {
        transform: scaleX(1);
    }

    .method-icon {
        width: 4rem;
        height: 4rem;
        margin: 0 auto 1.5rem;
        padding: 1rem;
        background: var(--gradient-primary);
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .method-icon svg {
        width: 2rem;
        height: 2rem;
    }

    .method-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .method-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .method-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s ease;
    }

    .method-link:hover {
        color: var(--primary-dark);
    }

    .chat-button {
        background: none;
        border: none;
        color: var(--primary-color);
        font-weight: 500;
        cursor: pointer;
        transition: color 0.3s ease;
    }

    .chat-button:hover {
        color: var(--primary-dark);
    }

    .contact-form-section {
        padding: 6rem 0;
    }

    .contact-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 4rem;
        align-items: start;
    }

    .contact-form-container {
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .form-header {
        margin-bottom: 2rem;
    }

    .form-header h2 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .form-header p {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .required-indicator {
        color: var(--error-color);
    }

    .form-input,
    .form-select,
    .form-textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: white;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1);
    }

    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-textarea {
        resize: vertical;
        min-height: 120px;
    }

    .field-error {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .field-error::before {
        content: '⚠';
    }

    .character-counter {
        text-align: right;
        font-size: 0.875rem;
        color: var(--text-tertiary);
        margin-top: 0.5rem;
    }

    .character-counter.warning {
        color: var(--warning-color);
    }

    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        cursor: pointer;
        line-height: 1.6;
    }

    .checkbox-label input[type="checkbox"] {
        margin-top: 0.25rem;
        accent-color: var(--primary-color);
    }

    .checkbox-text a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .checkbox-text a:hover {
        text-decoration: underline;
    }

    .contact-info {
        position: sticky;
        top: 2rem;
    }

    .info-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }

    .info-card h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }

    .info-links {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .info-links li {
        margin-bottom: 0.75rem;
    }

    .info-links a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .info-links a:hover {
        color: var(--primary-color);
    }

    .support-hours {
        space-y: 0.75rem;
    }

    .hours-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-light);
    }

    .hours-row:last-child {
        border-bottom: none;
    }

    .day {
        font-weight: 500;
        color: var(--text-primary);
    }

    .time {
        color: var(--text-secondary);
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-link {
        width: 2.5rem;
        height: 2.5rem;
        background: var(--bg-light);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        transition: all 0.3s ease;
    }

    .social-link:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
    }

    .social-link svg {
        width: 1.25rem;
        height: 1.25rem;
    }

    .faq-section {
        padding: 6rem 0;
        background: var(--bg-light);
    }

    .faq-grid {
        display: grid;
        gap: 1rem;
        margin-top: 3rem;
    }

    .faq-item {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;
    }

    .faq-item.active {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .faq-question {
        width: 100%;
        padding: 1.5rem 2rem;
        background: none;
        border: none;
        text-align: left;
        font-size: 1.125rem;
        font-weight: 500;
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s ease;
    }

    .faq-question:hover {
        background-color: var(--bg-light);
    }

    .faq-icon {
        width: 1.5rem;
        height: 1.5rem;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }

    .faq-item.active .faq-icon {
        transform: rotate(180deg);
    }

    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .faq-answer p {
        padding: 0 2rem 1.5rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
    }

    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(30px);
    }

    @keyframes fadeInUp {
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
        .contact-title {
            font-size: 2.5rem;
        }

        .contact-subtitle {
            font-size: 1.125rem;
        }

        .methods-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .contact-form-container {
            padding: 2rem;
        }

        .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .info-card {
            padding: 1.5rem;
        }
    }

    @media (max-width: 480px) {
        .contact-hero {
            padding: 6rem 0 3rem;
        }

        .contact-title {
            font-size: 2rem;
        }

        .method-card {
            padding: 2rem 1.5rem;
        }

        .contact-form-container {
            padding: 1.5rem;
        }

        .social-links {
            justify-content: center;
        }
    }
`;

document.head.appendChild(style);
