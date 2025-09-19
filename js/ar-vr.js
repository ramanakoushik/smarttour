// Smart Tour - AR/VR Integration and 3D Experiences

class SmartTourARVR {
    constructor() {
        this.arSession = null;
        this.vrSession = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.models = new Map();
        this.isARSupported = false;
        this.isVRSupported = false;
        this.isWebXRSupported = false;
        
        this.init();
    }

    init() {
        this.checkSupport();
        this.initializeThreeJS();
        this.setupEventListeners();
        this.load3DModels();
    }

    checkSupport() {
        // Check for WebXR support
        if ('xr' in navigator) {
            this.isWebXRSupported = true;
            
            // Check for AR support
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                this.isARSupported = supported;
                console.log('AR support:', supported);
                this.updateARButton();
            });

            // Check for VR support
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                this.isVRSupported = supported;
                console.log('VR support:', supported);
                this.updateVRButton();
            });
        } else {
            console.log('WebXR not supported, using fallback AR/VR');
            this.setupFallbackARVR();
        }
    }

    setupEventListeners() {
        // AR/VR modal controls
        const startARVRBtn = document.getElementById('start-ar-vr');
        const fullscreenBtn = document.getElementById('fullscreen-ar-vr');
        const modalClose = document.querySelector('#ar-vr-modal .modal-close');

        if (startARVRBtn) {
            startARVRBtn.addEventListener('click', this.startARVRSession.bind(this));
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', this.toggleFullscreen.bind(this));
        }

        if (modalClose) {
            modalClose.addEventListener('click', this.closeARVRModal.bind(this));
        }

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    initializeThreeJS() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting
        this.setupLighting();
        
        // Add basic scene objects
        this.setupScene();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for AR/VR
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }

    setupScene() {
        // Add a ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add some basic 3D objects for testing
        this.addTestObjects();
    }

    addTestObjects() {
        // Add a cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 1, -5);
        cube.castShadow = true;
        this.scene.add(cube);

        // Add a sphere
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(3, 1, -5);
        sphere.castShadow = true;
        this.scene.add(sphere);

        // Add a cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
        const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(-3, 1, -5);
        cylinder.castShadow = true;
        this.scene.add(cylinder);
    }

    load3DModels() {
        // Load tourist attraction models
        const models = [
            { name: 'statue-liberty', url: 'models/statue-liberty.glb' },
            { name: 'eiffel-tower', url: 'models/eiffel-tower.glb' },
            { name: 'colosseum', url: 'models/colosseum.glb' },
            { name: 'taj-mahal', url: 'models/taj-mahal.glb' }
        ];

        models.forEach(model => {
            this.loadGLTFModel(model.name, model.url);
        });
    }

    loadGLTFModel(name, url) {
        // Simulate loading 3D models
        // In a real implementation, you would use GLTFLoader
        console.log(`Loading 3D model: ${name} from ${url}`);
        
        // Create a placeholder model
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        const model = new THREE.Mesh(geometry, material);
        
        this.models.set(name, model);
    }

    async startARVRSession() {
        const container = document.getElementById('ar-vr-container');
        if (!container) return;

        try {
            if (this.isARSupported) {
                await this.startARSession();
            } else if (this.isVRSupported) {
                await this.startVRSession();
            } else {
                this.startFallbackSession();
            }
        } catch (error) {
            console.error('Failed to start AR/VR session:', error);
            this.showError('Failed to start AR/VR session');
        }
    }

    async startARSession() {
        try {
            this.arSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local'],
                optionalFeatures: ['hit-test', 'dom-overlay']
            });

            this.renderer.xr.enabled = true;
            this.renderer.xr.setReferenceSpaceType('local');
            
            const container = document.getElementById('ar-vr-container');
            if (container) {
                container.appendChild(this.renderer.domElement);
            }

            this.arSession.addEventListener('end', this.onARSessionEnd.bind(this));
            
            await this.renderer.xr.setSession(this.arSession);
            this.startRenderLoop();
            
            this.updateARVRStatus('AR session started');
        } catch (error) {
            console.error('AR session failed:', error);
            throw error;
        }
    }

    async startVRSession() {
        try {
            this.vrSession = await navigator.xr.requestSession('immersive-vr');
            
            this.renderer.xr.enabled = true;
            this.renderer.xr.setReferenceSpaceType('local-floor');
            
            const container = document.getElementById('ar-vr-container');
            if (container) {
                container.appendChild(this.renderer.domElement);
            }

            this.vrSession.addEventListener('end', this.onVRSessionEnd.bind(this));
            
            await this.renderer.xr.setSession(this.vrSession);
            this.startRenderLoop();
            
            this.updateARVRStatus('VR session started');
        } catch (error) {
            console.error('VR session failed:', error);
            throw error;
        }
    }

    startFallbackSession() {
        const container = document.getElementById('ar-vr-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
            this.startRenderLoop();
            this.updateARVRStatus('3D viewer started');
        }
    }

    startRenderLoop() {
        const animate = () => {
            if (this.renderer.xr.isPresenting) {
                this.renderer.setAnimationLoop(this.render.bind(this));
            } else {
                requestAnimationFrame(animate);
                this.render();
            }
        };
        animate();
    }

    render() {
        // Rotate objects for demo
        this.scene.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'BoxGeometry') {
                child.rotation.x += 0.01;
                child.rotation.y += 0.01;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    onARSessionEnd() {
        this.arSession = null;
        this.renderer.xr.enabled = false;
        this.updateARVRStatus('AR session ended');
        this.cleanup();
    }

    onVRSessionEnd() {
        this.vrSession = null;
        this.renderer.xr.enabled = false;
        this.updateARVRStatus('VR session ended');
        this.cleanup();
    }

    cleanup() {
        const container = document.getElementById('ar-vr-container');
        if (container && this.renderer.domElement.parentNode === container) {
            container.removeChild(this.renderer.domElement);
        }
    }

    setupFallbackARVR() {
        // Setup fallback for devices without WebXR support
        this.isARSupported = true; // Enable fallback AR
        this.isVRSupported = true; // Enable fallback VR
        this.updateARButton();
        this.updateVRButton();
    }

    updateARButton() {
        const arBtn = document.getElementById('ar-preview');
        if (arBtn) {
            if (this.isARSupported) {
                arBtn.disabled = false;
                arBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> AR Preview';
            } else {
                arBtn.disabled = true;
                arBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> AR Not Supported';
            }
        }
    }

    updateVRButton() {
        const vrBtn = document.getElementById('vr-tour');
        if (vrBtn) {
            if (this.isVRSupported) {
                vrBtn.disabled = false;
                vrBtn.innerHTML = '<i class="fas fa-vr-cardboard"></i> VR Tour';
            } else {
                vrBtn.disabled = true;
                vrBtn.innerHTML = '<i class="fas fa-vr-cardboard"></i> VR Not Supported';
            }
        }
    }

    updateARVRStatus(message) {
        const statusElement = document.querySelector('#ar-vr-modal .ar-vr-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log('AR/VR Status:', message);
    }

    toggleFullscreen() {
        const container = document.getElementById('ar-vr-container');
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Failed to enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    closeARVRModal() {
        const modal = document.getElementById('ar-vr-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // End any active sessions
        if (this.arSession) {
            this.arSession.end();
        }
        if (this.vrSession) {
            this.vrSession.end();
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    showError(message) {
        const container = document.getElementById('ar-vr-container');
        if (container) {
            container.innerHTML = `
                <div class="ar-vr-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Error</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="window.smartTourARVR.closeARVRModal()">
                        Close
                    </button>
                </div>
            `;
        }
    }

    // Tourist Attraction AR/VR Experiences
    async loadTouristAttraction(attractionName) {
        const model = this.models.get(attractionName);
        if (model) {
            this.scene.add(model);
            this.updateARVRStatus(`Loaded ${attractionName}`);
        } else {
            console.log(`Model not found: ${attractionName}`);
            this.createPlaceholderAttraction(attractionName);
        }
    }

    createPlaceholderAttraction(attractionName) {
        // Create a placeholder 3D model for the attraction
        const geometry = new THREE.BoxGeometry(2, 4, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const attraction = new THREE.Mesh(geometry, material);
        attraction.position.set(0, 2, -5);
        attraction.castShadow = true;
        
        // Add attraction name
        const textGeometry = new THREE.TextGeometry(attractionName, {
            size: 0.5,
            height: 0.1
        });
        const textMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 4, 0);
        attraction.add(text);
        
        this.scene.add(attraction);
        this.updateARVRStatus(`Created placeholder for ${attractionName}`);
    }

    // Interactive AR/VR Features
    addInteractiveElements() {
        // Add clickable elements for AR/VR
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                this.handleObjectClick(object);
            }
        });
    }

    handleObjectClick(object) {
        // Handle clicks on 3D objects
        console.log('Clicked on object:', object);
        
        // Add visual feedback
        object.material.color.setHex(0xff0000);
        setTimeout(() => {
            object.material.color.setHex(0x00ff00);
        }, 500);
        
        this.updateARVRStatus('Object clicked!');
    }

    // AR/VR Tour System
    createTourPath(waypoints) {
        const path = new THREE.CatmullRomCurve3(waypoints);
        const geometry = new THREE.TubeGeometry(path, 100, 0.1, 8, false);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const tourPath = new THREE.Mesh(geometry, material);
        
        this.scene.add(tourPath);
        return path;
    }

    startGuidedTour(attractions) {
        const waypoints = attractions.map(attraction => 
            new THREE.Vector3(attraction.x, attraction.y, attraction.z)
        );
        
        const tourPath = this.createTourPath(waypoints);
        this.animateCameraAlongPath(tourPath);
    }

    animateCameraAlongPath(path) {
        const duration = 10000; // 10 seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const point = path.getPoint(progress);
            this.camera.position.copy(point);
            this.camera.lookAt(path.getPoint(progress + 0.01));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    // AR/VR UI Elements
    createARVRUI() {
        const uiContainer = document.createElement('div');
        uiContainer.className = 'ar-vr-ui';
        uiContainer.innerHTML = `
            <div class="ar-vr-controls">
                <button class="ui-btn" id="reset-view">
                    <i class="fas fa-home"></i>
                </button>
                <button class="ui-btn" id="toggle-info">
                    <i class="fas fa-info"></i>
                </button>
                <button class="ui-btn" id="take-screenshot">
                    <i class="fas fa-camera"></i>
                </button>
            </div>
            <div class="ar-vr-info" id="ar-vr-info">
                <h4>AR/VR Experience</h4>
                <p>Use your device to explore the 3D environment</p>
            </div>
        `;
        
        document.body.appendChild(uiContainer);
        this.setupUIEventListeners();
    }

    setupUIEventListeners() {
        const resetBtn = document.getElementById('reset-view');
        const infoBtn = document.getElementById('toggle-info');
        const screenshotBtn = document.getElementById('take-screenshot');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', this.resetView.bind(this));
        }
        
        if (infoBtn) {
            infoBtn.addEventListener('click', this.toggleInfo.bind(this));
        }
        
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', this.takeScreenshot.bind(this));
        }
    }

    resetView() {
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        this.updateARVRStatus('View reset');
    }

    toggleInfo() {
        const infoElement = document.getElementById('ar-vr-info');
        if (infoElement) {
            infoElement.style.display = infoElement.style.display === 'none' ? 'block' : 'none';
        }
    }

    takeScreenshot() {
        const canvas = this.renderer.domElement;
        const link = document.createElement('a');
        link.download = `smart-tour-screenshot-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        this.updateARVRStatus('Screenshot saved');
    }

    // Performance Optimization
    optimizePerformance() {
        // Reduce quality for mobile devices
        if (this.isMobileDevice()) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.camera.fov = 60; // Reduce FOV for better performance
            this.camera.updateProjectionMatrix();
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Accessibility Features
    addAccessibilityFeatures() {
        // Add keyboard controls
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.camera.position.z -= 0.5;
                    break;
                case 'ArrowDown':
                    this.camera.position.z += 0.5;
                    break;
                case 'ArrowLeft':
                    this.camera.position.x -= 0.5;
                    break;
                case 'ArrowRight':
                    this.camera.position.x += 0.5;
                    break;
                case ' ':
                    event.preventDefault();
                    this.resetView();
                    break;
            }
        });
    }
}

// Initialize AR/VR when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartTourARVR = new SmartTourARVR();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartTourARVR;
}
