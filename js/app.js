// Smart Tour - Main Application JavaScript

class SmartTourApp {
    constructor() {
        this.currentLanguage = 'en';
        this.userLocation = null;
        this.walletConnected = false;
        this.selectedInterests = [];
        this.currentItinerary = null;
        this.chatHistory = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAOS();
        this.setupLanguageSelector();
        this.setupNavigation();
        this.setupLocationServices();
        this.setupWalletConnection();
        this.setupItineraryBuilder();
        this.setupMarketplace();
        this.setupSearch();
        this.setupModals();
        this.setupFeedbackForm();
        
        console.log('Smart Tour App initialized successfully');
    }

    // Animation on Scroll
    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.getElementById('hamburger')?.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Hero actions
        document.getElementById('start-tour')?.addEventListener('click', this.startTour.bind(this));
        document.getElementById('explore-demo')?.addEventListener('click', this.exploreDemo.bind(this));
        
        // Location search
        document.getElementById('search-location')?.addEventListener('click', this.searchLocation.bind(this));
        document.getElementById('location-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchLocation();
        });
        
        // Itinerary generation
        document.getElementById('generate-itinerary')?.addEventListener('click', this.generateItinerary.bind(this));
        
        // Interest tags
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', this.toggleInterest.bind(this));
        });
        
        // Marketplace tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', this.switchMarketplaceTab.bind(this));
        });
        
        // AR/VR buttons
        document.getElementById('ar-preview')?.addEventListener('click', this.openARPreview.bind(this));
        document.getElementById('vr-tour')?.addEventListener('click', this.openVRTour.bind(this));
        
        // Analytics controls
        document.getElementById('time-range')?.addEventListener('change', this.updateAnalytics.bind(this));
        document.getElementById('region-filter')?.addEventListener('change', this.updateAnalytics.bind(this));
        
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Language Selector
    setupLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.updateLanguage();
            });
        }
    }

    updateLanguage() {
        const translations = {
            en: {
                'nav-home': 'Home',
                'nav-itinerary': 'AI Itinerary',
                'nav-marketplace': 'Marketplace',
                'nav-maps': 'Interactive Maps',
                'nav-analytics': 'Analytics',
                'nav-chat': 'Chat Assistant',
                'hero-title': 'Smart Tour',
                'hero-subtitle': 'AI-Powered Tourism Experience',
                'start-journey': 'Start Your Journey',
                'view-demo': 'View Demo'
            },
            es: {
                'nav-home': 'Inicio',
                'nav-itinerary': 'Itinerario IA',
                'nav-marketplace': 'Mercado',
                'nav-maps': 'Mapas Interactivos',
                'nav-analytics': 'Analíticas',
                'nav-chat': 'Asistente Chat',
                'hero-title': 'Smart Tour',
                'hero-subtitle': 'Experiencia Turística con IA',
                'start-journey': 'Iniciar Viaje',
                'view-demo': 'Ver Demo'
            },
            fr: {
                'nav-home': 'Accueil',
                'nav-itinerary': 'Itinéraire IA',
                'nav-marketplace': 'Marché',
                'nav-maps': 'Cartes Interactives',
                'nav-analytics': 'Analyses',
                'nav-chat': 'Assistant Chat',
                'hero-title': 'Smart Tour',
                'hero-subtitle': 'Expérience Touristique IA',
                'start-journey': 'Commencer Voyage',
                'view-demo': 'Voir Démo'
            }
        };

        const currentTranslations = translations[this.currentLanguage] || translations.en;
        
        Object.keys(currentTranslations).forEach(key => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(el => {
                el.textContent = currentTranslations[key];
            });
        });
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    // Location Services
    setupLocationServices() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.updateLocationInfo();
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    this.showNotification('Location access denied. Some features may be limited.', 'warning');
                }
            );
        }
    }

    updateLocationInfo() {
        if (this.userLocation) {
            // Update real-time info with user's location
            this.updateWeatherInfo();
            this.updateLocalTime();
            this.updateTransportInfo();
        }
    }

    async updateWeatherInfo() {
        try {
            // Simulate weather API call
            const weatherData = {
                temperature: Math.floor(Math.random() * 30) + 10,
                condition: 'sunny'
            };
            
            const tempElement = document.getElementById('weather-temp');
            if (tempElement) {
                tempElement.textContent = `${weatherData.temperature}°C`;
            }
        } catch (error) {
            console.error('Weather update failed:', error);
        }
    }

    updateLocalTime() {
        const timeElement = document.getElementById('local-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }
    }

    updateTransportInfo() {
        const transportElement = document.getElementById('transport-status');
        if (transportElement) {
            // Simulate transport status
            const statuses = ['Available', 'Limited', 'Delayed'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            transportElement.textContent = randomStatus;
        }
    }

    // Wallet Connection
    setupWalletConnection() {
        const walletBtn = document.getElementById('wallet-connect');
        if (walletBtn) {
            walletBtn.addEventListener('click', this.connectWallet.bind(this));
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                
                if (accounts.length > 0) {
                    this.walletConnected = true;
                    const walletBtn = document.getElementById('wallet-connect');
                    walletBtn.innerHTML = '<i class="fas fa-wallet"></i> Connected';
                    walletBtn.style.background = 'var(--success-color)';
                    
                    this.showNotification('Wallet connected successfully!', 'success');
                }
            } else {
                this.showNotification('Please install MetaMask or another Web3 wallet', 'error');
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);
            this.showNotification('Failed to connect wallet', 'error');
        }
    }

    // Itinerary Builder
    setupItineraryBuilder() {
        // Interest selection is handled in setupEventListeners
        // Date validation
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        
        if (startDate && endDate) {
            startDate.addEventListener('change', () => {
                endDate.min = startDate.value;
            });
        }
    }

    toggleInterest(event) {
        const tag = event.target;
        const interest = tag.dataset.interest;
        
        if (this.selectedInterests.includes(interest)) {
            this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
            tag.classList.remove('active');
        } else {
            this.selectedInterests.push(interest);
            tag.classList.add('active');
        }
    }

    async generateItinerary() {
        const destination = document.getElementById('destination-input').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const travelStyle = document.getElementById('travel-style').value;
        
        if (!destination || !startDate || !endDate) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        if (this.selectedInterests.length === 0) {
            this.showNotification('Please select at least one interest', 'warning');
            return;
        }
        
        // Show loading state
        const generateBtn = document.getElementById('generate-itinerary');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        try {
            // Simulate AI itinerary generation
            await this.simulateAIGeneration();
            
            const itinerary = this.createSampleItinerary(destination, startDate, endDate, travelStyle);
            this.displayItinerary(itinerary);
            
            this.showNotification('Itinerary generated successfully!', 'success');
        } catch (error) {
            console.error('Itinerary generation failed:', error);
            this.showNotification('Failed to generate itinerary. Please try again.', 'error');
        } finally {
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    }

    async simulateAIGeneration() {
        // Simulate AI processing time
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    createSampleItinerary(destination, startDate, endDate, travelStyle) {
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        
        const activities = {
            culture: ['Museum Visit', 'Historical Site Tour', 'Cultural Center', 'Art Gallery'],
            nature: ['Nature Walk', 'Botanical Garden', 'Scenic Viewpoint', 'Wildlife Spotting'],
            adventure: ['Hiking Trail', 'Adventure Park', 'Water Sports', 'Rock Climbing'],
            food: ['Local Restaurant', 'Food Market Tour', 'Cooking Class', 'Wine Tasting'],
            history: ['Historical Monument', 'Heritage Site', 'Archaeological Site', 'Historical Museum'],
            nightlife: ['Local Bar', 'Night Market', 'Live Music Venue', 'Cultural Show'],
            shopping: ['Local Market', 'Artisan Shop', 'Shopping District', 'Craft Center'],
            relaxation: ['Spa Treatment', 'Beach Time', 'Park Visit', 'Meditation Center']
        };
        
        const itinerary = [];
        
        for (let day = 1; day <= days; day++) {
            const dayActivities = [];
            const selectedActivities = this.selectedInterests.map(interest => 
                activities[interest] || []
            ).flat();
            
            // Select 3-4 activities per day
            const numActivities = Math.min(4, Math.max(3, selectedActivities.length));
            const shuffled = selectedActivities.sort(() => 0.5 - Math.random());
            
            for (let i = 0; i < numActivities; i++) {
                if (shuffled[i]) {
                    dayActivities.push({
                        time: `${9 + i * 2}:00`,
                        activity: shuffled[i],
                        duration: '2 hours',
                        location: `${destination} ${i + 1}`,
                        cost: travelStyle === 'luxury' ? '$50-100' : travelStyle === 'mid-range' ? '$25-50' : '$10-25'
                    });
                }
            }
            
            itinerary.push({
                day: day,
                date: new Date(new Date(startDate).getTime() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                activities: dayActivities
            });
        }
        
        return {
            destination,
            startDate,
            endDate,
            travelStyle,
            interests: this.selectedInterests,
            days,
            itinerary
        };
    }

    displayItinerary(itinerary) {
        const timeline = document.getElementById('itinerary-timeline');
        if (!timeline) return;
        
        this.currentItinerary = itinerary;
        
        timeline.innerHTML = `
            <div class="itinerary-header">
                <h4>${itinerary.destination} - ${itinerary.days} Days</h4>
                <p>${itinerary.startDate} to ${itinerary.endDate}</p>
            </div>
            <div class="itinerary-days">
                ${itinerary.itinerary.map(day => `
                    <div class="day-card">
                        <div class="day-header">
                            <h5>Day ${day.day} - ${day.date}</h5>
                        </div>
                        <div class="day-activities">
                            ${day.activities.map(activity => `
                                <div class="activity-item">
                                    <div class="activity-time">${activity.time}</div>
                                    <div class="activity-details">
                                        <h6>${activity.activity}</h6>
                                        <p>📍 ${activity.location}</p>
                                        <p>⏱️ ${activity.duration} • 💰 ${activity.cost}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Marketplace
    setupMarketplace() {
        // Tab switching is handled in setupEventListeners
        this.loadMarketplaceData();
    }

    switchMarketplaceTab(event) {
        const tabBtn = event.target;
        const category = tabBtn.dataset.category;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.category-content').forEach(content => content.classList.remove('active'));
        document.getElementById(category).classList.add('active');
    }

    loadMarketplaceData() {
        // Simulate loading marketplace data
        console.log('Loading marketplace data...');
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('location-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearchInput.bind(this));
            searchInput.addEventListener('click', this.handleSearchClick.bind(this));
            searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
        }
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (event) => {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.contains(event.target)) {
                this.hideSearchSuggestions();
            }
        });
    }

    handleSearchInput(event) {
        const query = event.target.value;
        if (query.length > 2) {
            this.showSearchSuggestions(query);
        } else {
            this.hideSearchSuggestions();
        }
    }

    handleSearchClick(event) {
        const query = event.target.value;
        if (query.length === 0) {
            this.showPopularDestinations();
        } else if (query.length > 2) {
            this.showSearchSuggestions(query);
        }
    }

    handleSearchFocus(event) {
        const query = event.target.value;
        if (query.length === 0) {
            this.showPopularDestinations();
        } else if (query.length > 2) {
            this.showSearchSuggestions(query);
        }
    }

    showPopularDestinations() {
        const popularDestinations = [
            { name: 'Ranchi, Jharkhand', type: 'city', icon: 'fas fa-city' },
            { name: 'Jamshedpur, Jharkhand', type: 'city', icon: 'fas fa-city' },
            { name: 'Dhanbad, Jharkhand', type: 'city', icon: 'fas fa-city' },
            { name: 'Betla National Park', type: 'wildlife', icon: 'fas fa-tree' },
            { name: 'Netarhat, Jharkhand', type: 'hillstation', icon: 'fas fa-mountain' },
            { name: 'Hazaribagh Wildlife Sanctuary', type: 'wildlife', icon: 'fas fa-leaf' },
            { name: 'Dumka, Jharkhand', type: 'cultural', icon: 'fas fa-mountain' },
            { name: 'Deoghar, Jharkhand', type: 'religious', icon: 'fas fa-temple' }
        ];
        
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = `
                <div class="suggestions-header">
                    <h4>Popular Destinations in Jharkhand</h4>
                </div>
                ${popularDestinations.map(destination => `
                    <div class="suggestion-item" data-suggestion="${destination.name}">
                        <i class="${destination.icon}"></i>
                        <div class="suggestion-content">
                            <span class="suggestion-name">${destination.name}</span>
                            <span class="suggestion-type">${destination.type}</span>
                        </div>
                    </div>
                `).join('')}
            `;
            
            // Add click handlers
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('location-input').value = item.dataset.suggestion;
                    this.hideSearchSuggestions();
                    this.searchLocation();
                });
            });
            
            suggestionsContainer.style.display = 'block';
        }
    }

    showSearchSuggestions(query) {
        const suggestions = [
            'Ranchi, Jharkhand',
            'Jamshedpur, Jharkhand',
            'Dhanbad, Jharkhand',
            'Bokaro, Jharkhand',
            'Hazaribagh, Jharkhand',
            'Dumka, Jharkhand',
            'Netarhat, Jharkhand',
            'Betla National Park',
            'Hazaribagh Wildlife Sanctuary',
            'Khunti, Jharkhand',
            'Giridih, Jharkhand',
            'Deoghar, Jharkhand'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" data-suggestion="${suggestion}">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${suggestion}</span>
                </div>
            `).join('');
            
            // Add click handlers
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('location-input').value = item.dataset.suggestion;
                    this.hideSearchSuggestions();
                    this.searchLocation();
                });
            });
            
            suggestionsContainer.style.display = 'block';
        }
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    searchLocation() {
        const location = document.getElementById('location-input').value;
        if (location) {
            this.showNotification(`Searching for ${location}...`, 'info');
            // Implement actual search logic here
        }
    }

    // Modals
    setupModals() {
        // Blockchain transaction modal
        const blockchainModal = document.getElementById('blockchain-modal');
        const blockchainClose = blockchainModal?.querySelector('.modal-close');
        
        if (blockchainClose) {
            blockchainClose.addEventListener('click', () => {
                blockchainModal.classList.remove('active');
            });
        }
        
        // AR/VR modal
        const arVrModal = document.getElementById('ar-vr-modal');
        const arVrClose = arVrModal?.querySelector('.modal-close');
        
        if (arVrClose) {
            arVrClose.addEventListener('click', () => {
                arVrModal.classList.remove('active');
            });
        }
        
        // Close modals when clicking outside
        [blockchainModal, arVrModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });
            }
        });
    }

    // AR/VR Functions
    openARPreview() {
        const modal = document.getElementById('ar-vr-modal');
        if (modal) {
            modal.classList.add('active');
            this.initializeAR();
        }
    }

    openVRTour() {
        const modal = document.getElementById('ar-vr-modal');
        if (modal) {
            modal.classList.add('active');
            this.initializeVR();
        }
    }

    initializeAR() {
        // Initialize AR functionality
        console.log('Initializing AR preview...');
        // Implementation would go here
    }

    initializeVR() {
        // Initialize VR functionality
        console.log('Initializing VR tour...');
        // Implementation would go here
    }

    // Analytics
    updateAnalytics() {
        const timeRange = document.getElementById('time-range').value;
        const region = document.getElementById('region-filter').value;
        
        console.log(`Updating analytics for ${timeRange} in ${region}`);
        // Implement analytics update logic
    }

    // Hero Actions
    startTour() {
        this.scrollToSection('itinerary');
    }

    exploreDemo() {
        this.scrollToSection('maps');
    }

    // Utility Functions
    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Handle responsive adjustments
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    // Feedback Form Functionality
    setupFeedbackForm() {
        const feedbackForm = document.getElementById('feedback-form');
        const loadMoreReviewsBtn = document.getElementById('load-more-reviews');
        
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', this.handleFeedbackSubmit.bind(this));
        }
        
        if (loadMoreReviewsBtn) {
            loadMoreReviewsBtn.addEventListener('click', this.loadMoreReviews.bind(this));
        }
    }

    handleFeedbackSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const feedbackData = {
            name: formData.get('name'),
            email: formData.get('email'),
            location: formData.get('location'),
            rating: formData.get('rating'),
            type: formData.get('type'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'yes',
            timestamp: new Date().toISOString()
        };
        
        // Validate required fields
        if (!feedbackData.name || !feedbackData.email || !feedbackData.rating || !feedbackData.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        this.showNotification('Submitting your feedback...', 'info');
        
        setTimeout(() => {
            // In a real application, you would send this data to your server
            console.log('Feedback submitted:', feedbackData);
            
            // Show success message
            this.showNotification('Thank you for your feedback! We appreciate your input.', 'success');
            
            // Reset form
            event.target.reset();
            
            // Add the new review to the reviews list (simulation)
            this.addNewReview(feedbackData);
            
        }, 1500);
    }

    addNewReview(feedbackData) {
        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList) return;
        
        const newReview = document.createElement('div');
        newReview.className = 'review-item';
        newReview.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4>${feedbackData.name}</h4>
                        <span class="review-location">Visited ${feedbackData.location || 'Jharkhand'}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${this.generateStarRating(feedbackData.rating)}
                </div>
            </div>
            <p class="review-text">"${feedbackData.message}"</p>
            <span class="review-date">Just now</span>
        `;
        
        // Insert at the beginning of the reviews list
        reviewsList.insertBefore(newReview, reviewsList.firstChild);
        
        // Update overall rating (simulation)
        this.updateOverallRating();
    }

    generateStarRating(rating) {
        const stars = [];
        const fullStars = parseInt(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push('<i class="fas fa-star"></i>');
            } else if (i === fullStars && hasHalfStar) {
                stars.push('<i class="fas fa-star-half-alt"></i>');
            } else {
                stars.push('<i class="far fa-star"></i>');
            }
        }
        
        return stars.join('');
    }

    updateOverallRating() {
        // In a real application, this would calculate the average from all reviews
        // For now, we'll just simulate a slight increase
        const ratingNumber = document.querySelector('.rating-number');
        const ratingCount = document.querySelector('.rating-count');
        
        if (ratingNumber && ratingCount) {
            const currentRating = parseFloat(ratingNumber.textContent);
            const currentCount = parseInt(ratingCount.textContent.match(/\d+/)[0]);
            
            // Simulate a slight rating increase
            const newRating = Math.min(5.0, currentRating + 0.01);
            const newCount = currentCount + 1;
            
            ratingNumber.textContent = newRating.toFixed(1);
            ratingCount.textContent = `Based on ${newCount} reviews`;
        }
    }

    loadMoreReviews() {
        const loadMoreBtn = document.getElementById('load-more-reviews');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
        }
        
        // Simulate loading more reviews
        setTimeout(() => {
            const reviewsList = document.querySelector('.reviews-list');
            if (reviewsList) {
                const additionalReviews = [
                    {
                        name: 'Suresh Patel',
                        location: 'Visited Hazaribagh',
                        rating: 5,
                        message: 'The wildlife sanctuary was breathtaking! Perfect for photography enthusiasts.',
                        date: '1 month ago'
                    },
                    {
                        name: 'Meera Das',
                        location: 'Visited Giridih',
                        rating: 4,
                        message: 'Great cultural experience. The local guides were very knowledgeable about tribal history.',
                        date: '1 month ago'
                    }
                ];
                
                additionalReviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.className = 'review-item';
                    reviewElement.innerHTML = `
                        <div class="review-header">
                            <div class="reviewer-info">
                                <div class="reviewer-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="reviewer-details">
                                    <h4>${review.name}</h4>
                                    <span class="review-location">${review.location}</span>
                                </div>
                            </div>
                            <div class="review-rating">
                                ${this.generateStarRating(review.rating)}
                            </div>
                        </div>
                        <p class="review-text">"${review.message}"</p>
                        <span class="review-date">${review.date}</span>
                    `;
                    
                    reviewsList.appendChild(reviewElement);
                });
            }
            
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Reviews';
                loadMoreBtn.disabled = false;
            }
        }, 1000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartTourApp = new SmartTourApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartTourApp;
}
