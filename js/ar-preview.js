import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

class ARPreview {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.raycaster = new THREE.Raycaster();
        this.touchPosition = new THREE.Vector2();
        this.arSession = null;
        this.placedObjects = [];
        
        this.init();
    }
    
    async init() {
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        
        // Add AR button
        document.body.appendChild(ARButton.createButton(this.renderer, {
            requiredFeatures: ['hit-test'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: document.body }
        }));
        
        // Setup lights
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        light.position.set(0.5, 1, 0.25);
        this.scene.add(light);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Handle touch events
        window.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
        
        // Start AR session
        this.renderer.setAnimationLoop((timestamp, frame) => this.render(timestamp, frame));
    }
    
    async startARSession() {
        try {
            this.arSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test'],
                optionalFeatures: ['dom-overlay'],
                domOverlay: { root: document.body }
            });
            
            // Setup session
            await this.renderer.xr.setSession(this.arSession);
            
            // Create reticle for placement
            this.createReticle();
            
        } catch (error) {
            console.error('Failed to start AR session:', error);
            this.showARError();
        }
    }
    
    createReticle() {
        const geometry = new THREE.RingGeometry(0.15, 0.2, 32);
        const material = new THREE.MeshBasicMaterial();
        this.reticle = new THREE.Mesh(geometry, material);
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;
        this.scene.add(this.reticle);
    }
    
    async loadModel(modelUrl, scale = 1) {
        // Implementation would depend on the model format (GLTF, OBJ, etc.)
        // This is a placeholder for demonstration
        const geometry = new THREE.BoxGeometry(0.2 * scale, 0.2 * scale, 0.2 * scale);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.model = new THREE.Mesh(geometry, material);
        
        return this.model;
    }
    
    placeObject(position, rotation) {
        if (!this.model) return;
        
        const object = this.model.clone();
        object.position.copy(position);
        object.rotation.copy(rotation);
        
        this.scene.add(object);
        this.placedObjects.push(object);
        
        return object;
    }
    
    updateObjectTexture(object, texture) {
        if (!object) return;
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(texture, (loadedTexture) => {
            object.material.map = loadedTexture;
            object.material.needsUpdate = true;
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onTouchStart(event) {
        if (!this.arSession) return;
        
        event.preventDefault();
        
        this.touchPosition.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
        this.touchPosition.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.touchPosition, this.camera);
        
        // Check if we hit an existing object
        const intersects = this.raycaster.intersectObjects(this.placedObjects);
        
        if (intersects.length > 0) {
            // Handle interaction with existing object
            this.handleObjectInteraction(intersects[0].object);
        } else if (this.reticle.visible) {
            // Place new object
            const position = new THREE.Vector3();
            const rotation = new THREE.Euler();
            this.reticle.getWorldPosition(position);
            this.reticle.getWorldQuaternion(rotation);
            
            this.placeObject(position, rotation);
        }
    }
    
    handleObjectInteraction(object) {
        // Create interaction menu
        const menu = document.createElement('div');
        menu.className = 'ar-interaction-menu';
        menu.innerHTML = `
            <button class="move">Move</button>
            <button class="rotate">Rotate</button>
            <button class="scale">Scale</button>
            <button class="delete">Delete</button>
        `;
        
        // Position menu near object
        const screenPosition = this.getScreenPosition(object);
        menu.style.left = screenPosition.x + 'px';
        menu.style.top = screenPosition.y + 'px';
        
        document.body.appendChild(menu);
        
        // Handle menu interactions
        menu.querySelector('.move').onclick = () => this.startMoving(object);
        menu.querySelector('.rotate').onclick = () => this.startRotating(object);
        menu.querySelector('.scale').onclick = () => this.startScaling(object);
        menu.querySelector('.delete').onclick = () => {
            this.scene.remove(object);
            this.placedObjects = this.placedObjects.filter(obj => obj !== object);
            menu.remove();
        };
        
        // Remove menu when clicking outside
        const removeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        };
        document.addEventListener('click', removeMenu);
    }
    
    getScreenPosition(object) {
        const vector = object.position.clone();
        vector.project(this.camera);
        
        vector.x = (vector.x + 1) * window.innerWidth / 2;
        vector.y = (-vector.y + 1) * window.innerHeight / 2;
        
        return vector;
    }
    
    startMoving(object) {
        // Implement object movement logic
    }
    
    startRotating(object) {
        // Implement object rotation logic
    }
    
    startScaling(object) {
        // Implement object scaling logic
    }
    
    render(timestamp, frame) {
        if (this.renderer.xr.isPresenting) {
            if (frame) {
                const referenceSpace = this.renderer.xr.getReferenceSpace();
                const session = frame.session;
                
                // Perform hit test
                if (session.requestHitTest) {
                    const hits = frame.getHitTestResults(session.requestHitTest(
                        new XRRay(new XRRigidTransform())
                    ));
                    
                    if (hits.length) {
                        const hit = hits[0];
                        const hitPose = hit.getPose(referenceSpace);
                        
                        this.reticle.visible = true;
                        this.reticle.matrix.fromArray(hitPose.transform.matrix);
                    } else {
                        this.reticle.visible = false;
                    }
                }
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    showARError() {
        const error = document.createElement('div');
        error.className = 'ar-error';
        error.innerHTML = `
            <h2>AR Not Available</h2>
            <p>Your device doesn't support AR features. Please try using a compatible device.</p>
        `;
        document.body.appendChild(error);
    }
    
    takeARSnapshot() {
        return this.renderer.domElement.toDataURL('image/png');
    }
    
    dispose() {
        if (this.arSession) {
            this.arSession.end();
        }
        
        this.renderer.dispose();
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

export default ARPreview;
