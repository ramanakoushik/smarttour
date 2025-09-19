// Smart Tour - Interactive Maps and AR/VR Integration

class SmartTourMaps {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentLocation = null;
        this.arSession = null;
        this.vrScene = null;
        this.isARSupported = false;
        this.isVRSupported = false;
        
        this.init();
    }

    init() {
        this.checkARVRSupport();
        this.initializeMap();
        this.setupEventListeners();
        this.loadTouristData();
        this.setupRealTimeUpdates();
    }

    checkARVRSupport() {
        // Check for AR support
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                this.isARSupported = supported;
                console.log('AR support:', supported);
            });
        }

        // Check for VR support
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                this.isVRSupported = supported;
                console.log('VR support:', supported);
            });
        }

        // Check for WebXR
        if ('xr' in navigator) {
            console.log('WebXR is supported');
        } else {
            console.log('WebXR not supported, using fallback AR/VR');
        }
    }

    initializeMap() {
        // Initialize Leaflet map
        this.map = L.map('interactive-map').setView([23.3441, 85.3096], 8); // Default to Jharkhand center

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add custom controls
        this.addMapControls();
        
        // Add click handler
        this.map.on('click', this.onMapClick.bind(this));
        
        // Add location found handler
        this.map.on('locationfound', this.onLocationFound.bind(this));
        this.map.on('locationerror', this.onLocationError.bind(this));

        console.log('Map initialized successfully');
    }

    addMapControls() {
        // Add custom control for AR/VR
        const arVrControl = L.control({ position: 'topright' });
        
        arVrControl.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'ar-vr-control');
            div.innerHTML = `
                <button class="btn btn-vr" id="map-ar-btn" title="AR Preview">
                    <i class="fas fa-mobile-alt"></i>
                </button>
                <button class="btn btn-vr" id="map-vr-btn" title="VR Tour">
                    <i class="fas fa-vr-cardboard"></i>
                </button>
            `;
            
            // Add event listeners
            div.querySelector('#map-ar-btn').addEventListener('click', this.startARPreview.bind(this));
            div.querySelector('#map-vr-btn').addEventListener('click', this.startVRTour.bind(this));
            
            return div;
        };
        
        arVrControl.addTo(this.map);

        // Add layer control
        this.layerControl = L.control.layers(null, null, { position: 'topleft' }).addTo(this.map);
    }

    setupEventListeners() {
        // Layer controls
        document.querySelectorAll('input[data-layer]').forEach(checkbox => {
            checkbox.addEventListener('change', this.toggleLayer.bind(this));
        });

        // AR/VR buttons
        document.getElementById('ar-preview')?.addEventListener('click', this.startARPreview.bind(this));
        document.getElementById('vr-tour')?.addEventListener('click', this.startVRTour.bind(this));

        // Location services
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 15);
                    this.addUserLocationMarker();
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            );
        }
    }

    loadTouristData() {
        // Jharkhand tourist attractions data
        const attractions = [
            {
                id: 1,
                name: 'Betla National Park',
                lat: 23.9167,
                lng: 84.1167,
                type: 'attraction',
                category: 'wildlife',
                description: 'Famous for tigers, elephants, and diverse wildlife',
                rating: 4.8,
                price: '₹100',
                hours: '6:00 AM - 6:00 PM',
                arModel: 'betla-park-model.glb',
                vrTour: 'betla-park-tour'
            },
            {
                id: 2,
                name: 'Netarhat Hill Station',
                lat: 23.4833,
                lng: 84.2667,
                type: 'attraction',
                category: 'nature',
                description: 'Queen of Chotanagpur with scenic beauty',
                rating: 4.6,
                price: 'Free',
                hours: '24/7',
                arModel: 'netarhat-model.glb',
                vrTour: 'netarhat-tour'
            },
            {
                id: 3,
                name: 'Hazaribagh Wildlife Sanctuary',
                lat: 24.0000,
                lng: 85.3500,
                type: 'attraction',
                category: 'wildlife',
                description: 'Bird watching paradise with diverse flora and fauna',
                rating: 4.5,
                price: '₹50',
                hours: '6:00 AM - 5:00 PM',
                arModel: 'hazaribagh-model.glb',
                vrTour: 'hazaribagh-tour'
            },
            {
                id: 4,
                name: 'Ranchi Waterfalls',
                lat: 23.3441,
                lng: 85.3096,
                type: 'attraction',
                category: 'nature',
                description: 'Beautiful waterfalls including Hundru and Jonha Falls',
                rating: 4.4,
                price: 'Free',
                hours: '6:00 AM - 6:00 PM',
                arModel: 'ranchi-falls-model.glb',
                vrTour: 'ranchi-falls-tour'
            },
            {
                id: 5,
                name: 'Jagannath Temple, Ranchi',
                lat: 23.3441,
                lng: 85.3096,
                type: 'attraction',
                category: 'culture',
                description: 'Ancient temple with beautiful architecture',
                rating: 4.3,
                price: 'Free',
                hours: '5:00 AM - 9:00 PM',
                arModel: 'jagannath-temple-model.glb',
                vrTour: 'jagannath-temple-tour'
            }
        ];

        // Jharkhand restaurants data
        const restaurants = [
            {
                id: 6,
                name: 'Tribal Food Court',
                lat: 23.3441,
                lng: 85.3096,
                type: 'restaurant',
                category: 'food',
                description: 'Authentic tribal cuisine and local delicacies',
                rating: 4.5,
                price: '₹200-400',
                hours: '11:00 AM - 10:00 PM',
                cuisine: 'Tribal'
            },
            {
                id: 7,
                name: 'Jharkhandi Thali',
                lat: 22.8046,
                lng: 86.2029,
                type: 'restaurant',
                category: 'food',
                description: 'Traditional Jharkhand thali with local flavors',
                rating: 4.4,
                price: '₹150-300',
                hours: '12:00 PM - 9:00 PM',
                cuisine: 'Jharkhandi'
            },
            {
                id: 8,
                name: 'Forest Cafe',
                lat: 23.9167,
                lng: 84.1167,
                type: 'restaurant',
                category: 'food',
                description: 'Organic food near Betla National Park',
                rating: 4.6,
                price: '₹300-500',
                hours: '7:00 AM - 8:00 PM',
                cuisine: 'Organic'
            }
        ];

        // Jharkhand transport data
        const transport = [
            {
                id: 9,
                name: 'Ranchi Railway Station',
                lat: 23.3441,
                lng: 85.3096,
                type: 'transport',
                category: 'station',
                description: 'Main railway station connecting Jharkhand',
                rating: 4.2,
                price: 'Varies',
                hours: '24/7'
            },
            {
                id: 10,
                name: 'Jamshedpur Railway Station',
                lat: 22.8046,
                lng: 86.2029,
                type: 'transport',
                category: 'station',
                description: 'Steel city railway station',
                rating: 4.3,
                price: 'Varies',
                hours: '24/7'
            },
            {
                id: 11,
                name: 'Birsa Munda Airport',
                lat: 23.3142,
                lng: 85.3213,
                type: 'transport',
                category: 'airport',
                description: 'Domestic airport serving Ranchi',
                rating: 4.1,
                price: 'Varies',
                hours: '6:00 AM - 10:00 PM'
            }
        ];

        this.touristData = { attractions, restaurants, transport };
        this.addMarkersToMap();
    }

    addMarkersToMap() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Add attraction markers
        this.touristData.attractions.forEach(attraction => {
            const marker = this.createMarker(attraction);
            this.markers.push(marker);
            this.map.addLayer(marker);
        });

        // Add restaurant markers
        this.touristData.restaurants.forEach(restaurant => {
            const marker = this.createMarker(restaurant);
            this.markers.push(marker);
            this.map.addLayer(marker);
        });

        // Add transport markers
        this.touristData.transport.forEach(station => {
            const marker = this.createMarker(station);
            this.markers.push(marker);
            this.map.addLayer(marker);
        });
    }

    createMarker(location) {
        const icon = this.getMarkerIcon(location.type);
        
        const marker = L.marker([location.lat, location.lng], { icon })
            .bindPopup(this.createPopupContent(location))
            .on('click', () => this.onMarkerClick(location));

        return marker;
    }

    getMarkerIcon(type) {
        const iconConfigs = {
            attraction: { icon: 'fas fa-camera', color: '#e74c3c' },
            restaurant: { icon: 'fas fa-utensils', color: '#f39c12' },
            transport: { icon: 'fas fa-bus', color: '#3498db' },
            accommodation: { icon: 'fas fa-bed', color: '#9b59b6' }
        };

        const config = iconConfigs[type] || iconConfigs.attraction;
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${config.color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <i class="${config.icon}"></i>
            </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    createPopupContent(location) {
        const arVrButtons = location.arModel || location.vrTour ? `
            <div class="popup-actions">
                ${location.arModel ? `<button class="btn btn-sm btn-vr" onclick="window.smartTourMaps.startARPreview('${location.arModel}')">
                    <i class="fas fa-mobile-alt"></i> AR
                </button>` : ''}
                ${location.vrTour ? `<button class="btn btn-sm btn-vr" onclick="window.smartTourMaps.startVRTour('${location.vrTour}')">
                    <i class="fas fa-vr-cardboard"></i> VR
                </button>` : ''}
            </div>
        ` : '';

        return `
            <div class="location-popup">
                <h4>${location.name}</h4>
                <p>${location.description}</p>
                <div class="location-details">
                    <div class="detail-item">
                        <i class="fas fa-star"></i>
                        <span>${location.rating}/5</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${location.price}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${location.hours}</span>
                    </div>
                </div>
                ${arVrButtons}
            </div>
        `;
    }

    toggleLayer(event) {
        const layerType = event.target.dataset.layer;
        const isChecked = event.target.checked;

        if (isChecked) {
            this.showLayer(layerType);
        } else {
            this.hideLayer(layerType);
        }
    }

    showLayer(layerType) {
        this.markers.forEach(marker => {
            const location = marker.location;
            if (location && location.type === layerType) {
                this.map.addLayer(marker);
            }
        });
    }

    hideLayer(layerType) {
        this.markers.forEach(marker => {
            const location = marker.location;
            if (location && location.type === layerType) {
                this.map.removeLayer(marker);
            }
        });
    }

    onMapClick(event) {
        const { lat, lng } = event.latlng;
        this.updateLocationInfo(lat, lng);
    }

    onMarkerClick(location) {
        this.updateLocationInfo(location.lat, location.lng, location);
    }

    updateLocationInfo(lat, lng, location = null) {
        const locationInfo = document.getElementById('location-info');
        if (!locationInfo) return;

        if (location) {
            locationInfo.innerHTML = `
                <h4>${location.name}</h4>
                <p>${location.description}</p>
                <div class="location-meta">
                    <span class="rating">⭐ ${location.rating}/5</span>
                    <span class="price">💰 ${location.price}</span>
                    <span class="hours">🕒 ${location.hours}</span>
                </div>
                ${location.arModel || location.vrTour ? `
                    <div class="ar-vr-actions">
                        ${location.arModel ? `<button class="btn btn-sm btn-vr" onclick="window.smartTourMaps.startARPreview('${location.arModel}')">
                            <i class="fas fa-mobile-alt"></i> AR Preview
                        </button>` : ''}
                        ${location.vrTour ? `<button class="btn btn-sm btn-vr" onclick="window.smartTourMaps.startVRTour('${location.vrTour}')">
                            <i class="fas fa-vr-cardboard"></i> VR Tour
                        </button>` : ''}
                    </div>
                ` : ''}
            `;
        } else {
            locationInfo.innerHTML = `
                <h4>Coordinates</h4>
                <p>Lat: ${lat.toFixed(6)}</p>
                <p>Lng: ${lng.toFixed(6)}</p>
                <button class="btn btn-sm btn-primary" onclick="window.smartTourMaps.addCustomMarker(${lat}, ${lng})">
                    <i class="fas fa-plus"></i> Add Marker
                </button>
            `;
        }
    }

    addUserLocationMarker() {
        if (!this.currentLocation) return;

        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div style="background-color: #2ecc71; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <i class="fas fa-user"></i>
            </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const userMarker = L.marker([this.currentLocation.lat, this.currentLocation.lng], { icon: userIcon })
            .bindPopup('Your current location')
            .addTo(this.map);

        this.markers.push(userMarker);
    }

    addCustomMarker(lat, lng) {
        const customMarker = L.marker([lat, lng])
            .bindPopup('Custom marker')
            .addTo(this.map);

        this.markers.push(customMarker);
    }

    onLocationFound(event) {
        this.currentLocation = {
            lat: event.latlng.lat,
            lng: event.latlng.lng
        };
        this.addUserLocationMarker();
    }

    onLocationError(event) {
        console.log('Location error:', event.message);
    }

    // AR/VR Functions
    async startARPreview(modelName = null) {
        if (!this.isARSupported) {
            this.showARVRModal('AR Preview', 'AR is not supported on this device');
            return;
        }

        try {
            this.showARVRModal('AR Preview', 'Initializing AR...');
            
            if (modelName) {
                await this.loadARModel(modelName);
            } else {
                await this.startGenericAR();
            }
        } catch (error) {
            console.error('AR initialization failed:', error);
            this.showARVRModal('AR Preview', 'Failed to initialize AR');
        }
    }

    async startVRTour(tourName = null) {
        if (!this.isVRSupported) {
            this.showARVRModal('VR Tour', 'VR is not supported on this device');
            return;
        }

        try {
            this.showARVRModal('VR Tour', 'Initializing VR...');
            
            if (tourName) {
                await this.loadVRTour(tourName);
            } else {
                await this.startGenericVR();
            }
        } catch (error) {
            console.error('VR initialization failed:', error);
            this.showARVRModal('VR Tour', 'Failed to initialize VR');
        }
    }

    async loadARModel(modelName) {
        // Simulate loading AR model
        const container = document.getElementById('ar-vr-container');
        if (container) {
            container.innerHTML = `
                <div class="ar-model-viewer">
                    <h4>Loading ${modelName}...</h4>
                    <div class="loading-spinner"></div>
                    <p>Position your device to view the 3D model in AR</p>
                </div>
            `;
        }

        // Simulate model loading
        setTimeout(() => {
            if (container) {
                container.innerHTML = `
                    <div class="ar-model-viewer">
                        <h4>${modelName.replace('.glb', '')}</h4>
                        <div class="ar-placeholder">
                            <i class="fas fa-cube"></i>
                            <p>3D Model loaded in AR</p>
                            <p>Move your device around to explore</p>
                        </div>
                    </div>
                `;
            }
        }, 2000);
    }

    async loadVRTour(tourName) {
        // Simulate loading VR tour
        const container = document.getElementById('ar-vr-container');
        if (container) {
            container.innerHTML = `
                <div class="vr-tour-viewer">
                    <h4>Loading ${tourName}...</h4>
                    <div class="loading-spinner"></div>
                    <p>Preparing immersive VR experience</p>
                </div>
            `;
        }

        // Simulate tour loading
        setTimeout(() => {
            if (container) {
                container.innerHTML = `
                    <div class="vr-tour-viewer">
                        <h4>${tourName.replace('-tour', '')} VR Tour</h4>
                        <div class="vr-placeholder">
                            <i class="fas fa-vr-cardboard"></i>
                            <p>VR Tour loaded</p>
                            <p>Use VR headset or mobile device to explore</p>
                        </div>
                    </div>
                `;
            }
        }, 2000);
    }

    async startGenericAR() {
        const container = document.getElementById('ar-vr-container');
        if (container) {
            container.innerHTML = `
                <div class="ar-generic-viewer">
                    <h4>AR Experience</h4>
                    <div class="ar-placeholder">
                        <i class="fas fa-mobile-alt"></i>
                        <p>Point your camera at a flat surface</p>
                        <p>Tap to place virtual objects</p>
                    </div>
                </div>
            `;
        }
    }

    async startGenericVR() {
        const container = document.getElementById('ar-vr-container');
        if (container) {
            container.innerHTML = `
                <div class="vr-generic-viewer">
                    <h4>VR Experience</h4>
                    <div class="vr-placeholder">
                        <i class="fas fa-vr-cardboard"></i>
                        <p>Put on your VR headset</p>
                        <p>Use controllers to navigate</p>
                    </div>
                </div>
            `;
        }
    }

    showARVRModal(title, message) {
        const modal = document.getElementById('ar-vr-modal');
        if (modal) {
            const container = document.getElementById('ar-vr-container');
            if (container) {
                container.innerHTML = `
                    <div class="ar-vr-message">
                        <h4>${title}</h4>
                        <p>${message}</p>
                    </div>
                `;
            }
            modal.classList.add('active');
        }
    }

    setupRealTimeUpdates() {
        // Update real-time information every 30 seconds
        setInterval(() => {
            this.updateRealTimeInfo();
        }, 30000);

        // Initial update
        this.updateRealTimeInfo();
    }

    updateRealTimeInfo() {
        this.updateWeatherInfo();
        this.updateTransportInfo();
        this.updateLocalTime();
    }

    async updateWeatherInfo() {
        try {
            // Simulate weather API call
            const weatherData = {
                temperature: Math.floor(Math.random() * 30) + 10,
                condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
                humidity: Math.floor(Math.random() * 40) + 40
            };

            const tempElement = document.getElementById('weather-temp');
            if (tempElement) {
                tempElement.textContent = `${weatherData.temperature}°C`;
            }
        } catch (error) {
            console.error('Weather update failed:', error);
        }
    }

    updateTransportInfo() {
        const statuses = ['Available', 'Limited', 'Delayed', 'Suspended'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const transportElement = document.getElementById('transport-status');
        if (transportElement) {
            transportElement.textContent = randomStatus;
        }
    }

    updateLocalTime() {
        const timeElement = document.getElementById('local-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }
    }

    // Utility Methods
    getDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    findNearbyLocations(lat, lng, radius = 5) {
        return this.touristData.attractions.filter(attraction => {
            const distance = this.getDistance(lat, lng, attraction.lat, attraction.lng);
            return distance <= radius;
        });
    }

    // Export/Import functionality
    exportMapData() {
        const mapData = {
            center: this.map.getCenter(),
            zoom: this.map.getZoom(),
            markers: this.markers.map(marker => ({
                lat: marker.getLatLng().lat,
                lng: marker.getLatLng().lng,
                popup: marker.getPopup().getContent()
            }))
        };

        const dataStr = JSON.stringify(mapData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'smart-tour-map-data.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importMapData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const mapData = JSON.parse(e.target.result);
                this.map.setView([mapData.center.lat, mapData.center.lng], mapData.zoom);
                
                // Clear existing markers
                this.markers.forEach(marker => this.map.removeLayer(marker));
                this.markers = [];
                
                // Add imported markers
                mapData.markers.forEach(markerData => {
                    const marker = L.marker([markerData.lat, markerData.lng])
                        .bindPopup(markerData.popup)
                        .addTo(this.map);
                    this.markers.push(marker);
                });
            } catch (error) {
                console.error('Failed to import map data:', error);
            }
        };
        reader.readAsText(file);
    }
}

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartTourMaps = new SmartTourMaps();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartTourMaps;
}
