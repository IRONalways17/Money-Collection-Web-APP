// Causes Page JavaScript

class CausesPage {
    constructor() {
        this.campaigns = [];
        this.filteredCampaigns = [];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.filters = {
            search: '',
            category: '',
            sort: 'recent'
        };
        this.currentView = 'grid';
        
        this.init();
    }
    
    async init() {
        try {
            this.setupEventListeners();
            this.parseURLParams();
            await this.loadCampaigns();
            this.applyFilters();
            this.renderCampaigns();
            this.updateUI();
        } catch (error) {
            console.error('Failed to initialize causes page:', error);
            this.renderError();
        }
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-campaigns');
        searchInput.addEventListener('input', utils.debounce((e) => {
            this.filters.search = e.target.value.trim();
            this.applyFilters();
            this.renderCampaigns();
            this.updateURL();
        }, 300));
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
            this.renderCampaigns();
            this.updateURL();
        });
        
        // Sort filter
        const sortFilter = document.getElementById('sort-filter');
        sortFilter.addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applyFilters();
            this.renderCampaigns();
            this.updateURL();
        });
        
        // Clear filters
        const clearFilters = document.getElementById('clear-filters');
        clearFilters.addEventListener('click', () => {
            this.clearAllFilters();
        });
        
        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.closest('.view-btn').dataset.view);
            });
        });
        
        // Load more
        const loadMoreBtn = document.getElementById('load-more-btn');
        loadMoreBtn.addEventListener('click', () => {
            this.loadMoreCampaigns();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        searchInput.focus();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.clearAllFilters();
                        break;
                }
            }
        });
    }
    
    parseURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('search')) {
            this.filters.search = params.get('search');
            document.getElementById('search-campaigns').value = this.filters.search;
        }
        
        if (params.get('category')) {
            this.filters.category = params.get('category');
            document.getElementById('category-filter').value = this.filters.category;
        }
        
        if (params.get('sort')) {
            this.filters.sort = params.get('sort');
            document.getElementById('sort-filter').value = this.filters.sort;
        }
        
        if (params.get('view')) {
            this.currentView = params.get('view');
        }
    }
    
    async loadCampaigns() {
        try {
            // In a real app, this would fetch from Firestore
            // For demo purposes, using expanded static data
            this.campaigns = [
                {
                    id: 'education-001',
                    title: 'Education for Underprivileged Children',
                    description: 'Help provide quality education and school supplies to children in rural communities who cannot afford basic educational needs. Your donation will directly support classroom materials, books, uniforms, and nutritious meals.',
                    image: '/images/education-campaign.jpg',
                    category: 'education',
                    raised: 45000,
                    goal: 100000,
                    donorsCount: 127,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    urgent: false,
                    location: 'Rural Maharashtra',
                    organizerName: 'Shiksha Foundation',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'healthcare-002',
                    title: 'Emergency Medical Support',
                    description: 'Urgent medical assistance for families affected by recent natural disasters who need immediate healthcare support. Funds will cover emergency treatments, medications, and medical equipment.',
                    image: '/images/healthcare-campaign.jpg',
                    category: 'healthcare',
                    raised: 78000,
                    goal: 150000,
                    donorsCount: 234,
                    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                    urgent: true,
                    location: 'Kerala',
                    organizerName: 'Health Relief India',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'disaster-003',
                    title: 'Flood Relief Operations',
                    description: 'Immediate relief supplies including food, water, and temporary shelter for families displaced by recent flooding. Every rupee helps provide essential survival items.',
                    image: '/images/disaster-campaign.jpg',
                    category: 'disaster',
                    raised: 92000,
                    goal: 200000,
                    donorsCount: 456,
                    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    urgent: true,
                    location: 'Assam',
                    organizerName: 'Disaster Response Team',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'environment-004',
                    title: 'Plant Trees for Future Generations',
                    description: 'Large-scale tree plantation drive to combat climate change and restore degraded forest areas. Help us plant 10,000 trees and create green corridors.',
                    image: '/images/environment-campaign.jpg',
                    category: 'environment',
                    raised: 35000,
                    goal: 80000,
                    donorsCount: 89,
                    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                    urgent: false,
                    location: 'Rajasthan',
                    organizerName: 'Green Earth Initiative',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'community-005',
                    title: 'Clean Water Access Project',
                    description: 'Installing water purification systems in remote villages that lack access to clean drinking water. This project will benefit over 500 families.',
                    image: '/images/water-campaign.jpg',
                    category: 'community',
                    raised: 67000,
                    goal: 120000,
                    donorsCount: 178,
                    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                    urgent: false,
                    location: 'Odisha',
                    organizerName: 'Water for All',
                    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'education-006',
                    title: 'Computer Lab for Government School',
                    description: 'Setting up a modern computer lab with high-speed internet for a government school in rural area. This will help bridge the digital divide for 300+ students.',
                    image: '/images/computer-lab-campaign.jpg',
                    category: 'education',
                    raised: 25000,
                    goal: 75000,
                    donorsCount: 67,
                    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
                    urgent: false,
                    location: 'Bihar',
                    organizerName: 'Digital Education Trust',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'healthcare-007',
                    title: 'Cancer Treatment Support',
                    description: 'Supporting cancer patients from economically weaker sections with treatment costs, medications, and post-treatment care. Every contribution saves lives.',
                    image: '/images/cancer-campaign.jpg',
                    category: 'healthcare',
                    raised: 156000,
                    goal: 300000,
                    donorsCount: 623,
                    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    urgent: true,
                    location: 'Mumbai',
                    organizerName: 'Hope Cancer Care',
                    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'disaster-008',
                    title: 'Earthquake Relief Fund',
                    description: 'Emergency relief and rehabilitation support for earthquake victims. Providing temporary shelters, food, medical aid, and helping families rebuild their lives.',
                    image: '/images/earthquake-campaign.jpg',
                    category: 'disaster',
                    raised: 89000,
                    goal: 250000,
                    donorsCount: 345,
                    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                    urgent: true,
                    location: 'Uttarakhand',
                    organizerName: 'Earthquake Relief Society',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                }
            ];
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (error) {
            console.error('Failed to load campaigns:', error);
            throw error;
        }
    }
    
    applyFilters() {
        this.filteredCampaigns = this.campaigns.filter(campaign => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const matchesSearch = 
                    campaign.title.toLowerCase().includes(searchTerm) ||
                    campaign.description.toLowerCase().includes(searchTerm) ||
                    campaign.location.toLowerCase().includes(searchTerm) ||
                    campaign.organizerName.toLowerCase().includes(searchTerm);
                
                if (!matchesSearch) return false;
            }
            
            // Category filter
            if (this.filters.category && campaign.category !== this.filters.category) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        this.sortCampaigns();
        
        // Reset pagination
        this.currentPage = 1;
        
        // Update filter tags
        this.updateFilterTags();
    }
    
    sortCampaigns() {
        switch (this.filters.sort) {
            case 'recent':
                this.filteredCampaigns.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'urgent':
                this.filteredCampaigns.sort((a, b) => {
                    if (a.urgent && !b.urgent) return -1;
                    if (!a.urgent && b.urgent) return 1;
                    return b.createdAt - a.createdAt;
                });
                break;
            case 'popular':
                this.filteredCampaigns.sort((a, b) => b.donorsCount - a.donorsCount);
                break;
            case 'progress':
                this.filteredCampaigns.sort((a, b) => {
                    const progressA = (a.raised / a.goal) * 100;
                    const progressB = (b.raised / b.goal) * 100;
                    return progressB - progressA;
                });
                break;
            case 'amount':
                this.filteredCampaigns.sort((a, b) => b.goal - a.goal);
                break;
        }
    }
    
    renderCampaigns() {
        const container = document.getElementById('campaigns-container');
        const loadMoreContainer = document.getElementById('load-more-container');
        const noResults = document.getElementById('no-results');
        
        if (this.filteredCampaigns.length === 0) {
            container.style.display = 'none';
            loadMoreContainer.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        noResults.style.display = 'none';
        
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const campaignsToShow = this.filteredCampaigns.slice(startIndex, endIndex);
        
        const campaignsHTML = campaignsToShow.map(campaign => {
            const campaignCard = new Components.CampaignCard(campaign);
            return campaignCard.render();
        }).join('');
        
        container.innerHTML = campaignsHTML;
        
        // Update view style
        container.className = `campaigns-${this.currentView}`;
        
        // Show/hide load more button
        if (endIndex < this.filteredCampaigns.length) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
        
        // Add animations
        this.animateCampaignCards();
    }
    
    loadMoreCampaigns() {
        this.currentPage++;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = this.currentPage * this.itemsPerPage;
        const newCampaigns = this.filteredCampaigns.slice(startIndex, endIndex);
        
        if (newCampaigns.length > 0) {
            const container = document.getElementById('campaigns-container');
            const newCampaignsHTML = newCampaigns.map(campaign => {
                const campaignCard = new Components.CampaignCard(campaign);
                return campaignCard.render();
            }).join('');
            
            container.insertAdjacentHTML('beforeend', newCampaignsHTML);
            
            // Animate new cards
            const newCards = container.querySelectorAll('.campaign-card:nth-last-child(-n+' + newCampaigns.length + ')');
            newCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
        
        // Update load more button visibility
        const loadMoreContainer = document.getElementById('load-more-container');
        if (endIndex >= this.filteredCampaigns.length) {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    animateCampaignCards() {
        const cards = document.querySelectorAll('.campaign-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    updateFilterTags() {
        const container = document.getElementById('active-filters');
        const tags = [];
        
        if (this.filters.search) {
            tags.push({
                type: 'search',
                label: `Search: "${this.filters.search}"`,
                value: this.filters.search
            });
        }
        
        if (this.filters.category) {
            const categoryName = this.getCategoryName(this.filters.category);
            tags.push({
                type: 'category',
                label: `Category: ${categoryName}`,
                value: this.filters.category
            });
        }
        
        if (tags.length > 0) {
            const tagsHTML = tags.map(tag => `
                <span class="filter-tag active" data-type="${tag.type}" data-value="${tag.value}">
                    ${tag.label}
                    <button class="tag-remove" onclick="causesPage.removeFilter('${tag.type}', '${tag.value}')" aria-label="Remove filter">×</button>
                </span>
            `).join('');
            
            container.innerHTML = tagsHTML;
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }
    
    removeFilter(type, value) {
        switch (type) {
            case 'search':
                this.filters.search = '';
                document.getElementById('search-campaigns').value = '';
                break;
            case 'category':
                this.filters.category = '';
                document.getElementById('category-filter').value = '';
                break;
        }
        
        this.applyFilters();
        this.renderCampaigns();
        this.updateURL();
    }
    
    clearAllFilters() {
        this.filters = {
            search: '',
            category: '',
            sort: 'recent'
        };
        
        document.getElementById('search-campaigns').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('sort-filter').value = 'recent';
        
        this.applyFilters();
        this.renderCampaigns();
        this.updateURL();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update container class
        const container = document.getElementById('campaigns-container');
        container.className = `campaigns-${view}`;
        
        this.updateURL();
    }
    
    updateUI() {
        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (this.filteredCampaigns.length === 0) {
            resultsCount.textContent = 'No campaigns found';
        } else if (this.filteredCampaigns.length === 1) {
            resultsCount.textContent = '1 campaign found';
        } else {
            resultsCount.textContent = `${this.filteredCampaigns.length} campaigns found`;
        }
        
        // Update view toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });
    }
    
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.filters.search) params.set('search', this.filters.search);
        if (this.filters.category) params.set('category', this.filters.category);
        if (this.filters.sort !== 'recent') params.set('sort', this.filters.sort);
        if (this.currentView !== 'grid') params.set('view', this.currentView);
        
        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newURL);
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
    
    renderError() {
        const container = document.getElementById('campaigns-container');
        container.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: var(--space-16); color: var(--neutral-600);">
                <svg style="width: 64px; height: 64px; margin-bottom: var(--space-4); color: var(--neutral-400);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>Unable to load campaigns</h3>
                <p>Please check your internet connection and try again.</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// Global function for clearing filters (used in template)
window.clearAllFilters = function() {
    if (window.causesPage) {
        window.causesPage.clearAllFilters();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.causesPage = new CausesPage();
});

// Additional CSS for list/grid view (add to components.css if needed)
const additionalStyles = `
.campaigns-list {
    display: flex !important;
    flex-direction: column;
    gap: var(--space-6);
}

.campaigns-list .campaign-card {
    display: flex;
    flex-direction: row;
    height: auto;
}

.campaigns-list .campaign-image {
    width: 300px;
    height: 200px;
    flex-shrink: 0;
}

.campaigns-list .campaign-content {
    flex: 1;
    padding: var(--space-6);
}

.view-btn {
    padding: var(--space-2);
    background: transparent;
    border: 1px solid var(--neutral-300);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.view-btn:hover {
    background: var(--neutral-100);
}

.view-btn.active {
    background: var(--primary-500);
    color: white;
    border-color: var(--primary-500);
}

.view-toggle {
    display: flex;
    gap: var(--space-1);
}

.campaigns-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8);
}

.results-info {
    color: var(--neutral-600);
    font-weight: var(--font-weight-medium);
}

.no-results {
    text-align: center;
    padding: var(--space-20);
    color: var(--neutral-600);
}

.no-results-content {
    max-width: 400px;
    margin: 0 auto;
}

.no-results-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto var(--space-4);
    color: var(--neutral-400);
}

.search-container {
    position: relative;
    max-width: 300px;
}

.search-btn {
    position: absolute;
    right: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--neutral-500);
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.search-btn:hover {
    color: var(--primary-500);
    background: var(--primary-50);
}

.tag-remove {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    margin-left: var(--space-2);
    font-weight: bold;
    padding: 0 var(--space-1);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.tag-remove:hover {
    background: rgba(255, 255, 255, 0.2);
}

.page-header {
    padding: calc(80px + var(--space-16)) 0 var(--space-16);
    background: linear-gradient(135deg, var(--primary-50), var(--neutral-50));
    text-align: center;
}

.page-title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--neutral-900);
    margin-bottom: var(--space-4);
}

.page-subtitle {
    font-size: var(--font-size-lg);
    color: var(--neutral-600);
    max-width: 600px;
    margin: 0 auto;
}

.filters-section {
    padding: var(--space-12) 0;
    background: white;
}

.campaigns-section {
    padding: var(--space-16) 0;
    background: var(--neutral-50);
}

.quick-stats {
    padding: var(--space-12) 0;
    background: white;
    border-top: 1px solid var(--neutral-200);
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-8);
    text-align: center;
}

.stat-item {
    padding: var(--space-4);
}

.stat-value {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--primary-600);
    margin-bottom: var(--space-2);
}

.stat-label {
    font-size: var(--font-size-base);
    color: var(--neutral-600);
    font-weight: var(--font-weight-medium);
}

.load-more-container {
    text-align: center;
    padding: var(--space-8) 0;
}

@media screen and (max-width: 768px) {
    .campaigns-list .campaign-card {
        flex-direction: column;
    }
    
    .campaigns-list .campaign-image {
        width: 100%;
        height: 200px;
    }
    
    .campaigns-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
    }
    
    .search-container {
        max-width: none;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
