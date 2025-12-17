// ============================================
// POLAROID CAMERA SYSTEM
// Capture photos with front camera, develop at home
// ============================================

import { state } from '../core/state.js';
import { Storage } from '../core/storage.js';

class PolaroidSystem {
  constructor() {
    this.maxPhotos = 20;
    this.stream = null;
    this.videoElement = null;
    this.cameraModal = null;
  }
  
  init() {
    this.addCameraButtonToFountain();
    this.setupHomeGallery();
    console.log('✅ Polaroid system initialized');
  }
  
  // Add camera button to fountain location
  addCameraButtonToFountain() {
    const fountainPage = document.getElementById('fountain');
    if (!fountainPage) {
      console.warn('⚠️ Fountain page not found for Polaroid system');
      return;
    }
    
    // Check if button already exists
    if (document.getElementById('polaroid-camera-btn')) return;
    
    // Create camera button
    const button = document.createElement('button');
    button.id = 'polaroid-camera-btn';
    button.className = 'polaroid-camera-btn';
    button.innerHTML = '📷';
    button.title = 'Take a Polaroid';
    button.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      width: 60px;
      height: 60px;
      background: #f5f5dc;
      border: 4px solid #8b7355;
      border-radius: 8px;
      font-size: 2rem;
      cursor: pointer;
      z-index: 100;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => {
      this.openCamera();
    });
    
    fountainPage.appendChild(button);
    console.log('📷 Camera button added to fountain');
  }
  
  // Open camera modal
  async openCamera() {
    console.log('📷 Opening camera...');
    
    // Create modal
    this.cameraModal = document.createElement('div');
    this.cameraModal.id = 'polaroid-camera-modal';
    this.cameraModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.95);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    `;
    
    // Video element
    this.videoElement = document.createElement('video');
    this.videoElement.autoplay = true;
    this.videoElement.playsInline = true;
    this.videoElement.style.cssText = `
      width: 80%;
      max-width: 600px;
      border: 8px solid #f5f5dc;
      border-radius: 12px;
      transform: scaleX(-1);
    `;
    
    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    `;
    
    // Capture button
    const captureBtn = document.createElement('button');
    captureBtn.textContent = '📸 Capture';
    captureBtn.className = 'action-btn';
    captureBtn.style.cssText = `
      padding: 15px 40px;
      font-size: 1.2rem;
      font-family: 'Nineteen Ninety Seven', monospace;
      background: #00ff88;
      color: #000;
      border: 3px solid #000;
      cursor: pointer;
      box-shadow: 4px 4px 0 #000;
      transition: all 0.1s;
    `;
    captureBtn.addEventListener('click', () => this.capturePhoto());
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '❌ Close';
    closeBtn.className = 'action-btn';
    closeBtn.style.cssText = `
      padding: 15px 40px;
      font-size: 1.2rem;
      font-family: 'Nineteen Ninety Seven', monospace;
      background: #ff5555;
      color: #fff;
      border: 3px solid #000;
      cursor: pointer;
      box-shadow: 4px 4px 0 #000;
      transition: all 0.1s;
    `;
    closeBtn.addEventListener('click', () => this.closeCamera());
    
    buttonContainer.appendChild(captureBtn);
    buttonContainer.appendChild(closeBtn);
    
    this.cameraModal.appendChild(this.videoElement);
    this.cameraModal.appendChild(buttonContainer);
    document.body.appendChild(this.cameraModal);
    
    // Request camera access
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      this.videoElement.srcObject = this.stream;
      console.log('✅ Camera access granted');
    } catch (error) {
      console.error('❌ Camera access denied:', error);
      this.closeCamera();
      window.flashMessage && window.flashMessage('Camera access denied!', 3000);
    }
  }
  
  // Capture photo from video stream
  capturePhoto() {
    if (!this.videoElement || !this.stream) {
      console.error('❌ No video stream available');
      return;
    }
    
    console.log('📸 Capturing photo...');
    
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Flip horizontally (mirror image)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // Draw video frame
    ctx.drawImage(this.videoElement, 0, 0);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Save to storage
    this.savePhoto(imageData);
    
    // Close camera
    this.closeCamera();
    
    // Show success message
    window.flashMessage && window.flashMessage('📷 Polaroid captured! Visit home to develop it.', 3000);
  }
  
  // Save photo to localStorage
  savePhoto(imageData) {
    // Initialize photos array if not exists
    if (!state.gameProgress.photos) {
      state.gameProgress.photos = [];
    }
    
    // Create photo object
    const photo = {
      id: Date.now(),
      imageData: imageData,
      timestamp: Date.now(),
      developing: true,
      capturedAt: 'fountain'
    };
    
    // Add photo
    state.gameProgress.photos.push(photo);
    
    // Limit to maxPhotos (remove oldest if exceeded)
    if (state.gameProgress.photos.length > this.maxPhotos) {
      state.gameProgress.photos = state.gameProgress.photos.slice(-this.maxPhotos);
    }
    
    // Update photo count
    state.gameProgress.photosToken = state.gameProgress.photos.length;
    
    // Save to storage
    Storage.saveState();
    
    console.log(`✅ Photo saved (total: ${state.gameProgress.photos.length})`);
  }
  
  // Close camera and cleanup
  closeCamera() {
    // Stop video stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Remove modal
    if (this.cameraModal) {
      this.cameraModal.remove();
      this.cameraModal = null;
    }
    
    this.videoElement = null;
    
    console.log('📷 Camera closed');
  }
  
  // Setup gallery at home location
  setupHomeGallery() {
    const homePage = document.getElementById('home');
    if (!homePage) {
      console.warn('⚠️ Home page not found for Polaroid gallery');
      return;
    }
    
    // Check if gallery already exists
    if (document.getElementById('polaroid-gallery')) return;
    
    // Create gallery container
    const gallery = document.createElement('div');
    gallery.id = 'polaroid-gallery';
    gallery.style.cssText = `
      position: absolute;
      top: 100px;
      right: 20px;
      width: 350px;
      max-height: 70vh;
      background: #f5f5dc;
      border: 4px solid #8b7355;
      border-radius: 8px;
      padding: 20px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    `;
    
    const title = document.createElement('h3');
    title.textContent = '📷 Polaroid Memories';
    title.style.cssText = `
      margin: 0 0 15px 0;
      font-family: 'Nineteen Ninety Seven', monospace;
      font-size: 1.2rem;
      color: #333;
      text-align: center;
    `;
    
    const photoGrid = document.createElement('div');
    photoGrid.id = 'polaroid-grid';
    photoGrid.style.cssText = `
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    `;
    
    gallery.appendChild(title);
    gallery.appendChild(photoGrid);
    homePage.appendChild(gallery);
    
    console.log('🖼️ Gallery added to home');
    
    // Listen for page changes to update gallery
    this.observeHomePage();
  }
  
  // Observe home page visibility
  observeHomePage() {
    const homePage = document.getElementById('home');
    if (!homePage) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (homePage.classList.contains('active')) {
            this.updateGallery();
          }
        }
      });
    });
    
    observer.observe(homePage, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Initial update if already active
    if (homePage.classList.contains('active')) {
      this.updateGallery();
    }
  }
  
  // Update gallery with photos
  updateGallery() {
    const photoGrid = document.getElementById('polaroid-grid');
    if (!photoGrid) return;
    
    // Get photos from state
    const photos = state.gameProgress.photos || [];
    
    if (photos.length === 0) {
      photoGrid.innerHTML = '<p style="text-align:center;color:#666;">No photos yet. Visit the fountain to take some!</p>';
      return;
    }
    
    // Clear grid
    photoGrid.innerHTML = '';
    
    // Render photos (newest first)
    const reversedPhotos = [...photos].reverse();
    
    reversedPhotos.forEach((photo, index) => {
      const polaroidFrame = document.createElement('div');
      polaroidFrame.className = 'polaroid-frame';
      polaroidFrame.style.cssText = `
        background: #fff;
        padding: 12px 12px 40px 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        border-radius: 4px;
        position: relative;
      `;
      
      const img = document.createElement('img');
      img.src = photo.imageData;
      img.style.cssText = `
        width: 100%;
        height: auto;
        display: block;
        ${photo.developing ? 'opacity: 0; animation: developPhoto 2s ease-out forwards;' : 'opacity: 1;'}
      `;
      
      const caption = document.createElement('div');
      caption.textContent = new Date(photo.timestamp).toLocaleDateString('de-DE');
      caption.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: #666;
      `;
      
      polaroidFrame.appendChild(img);
      polaroidFrame.appendChild(caption);
      photoGrid.appendChild(polaroidFrame);
      
      // Mark as developed after animation
      if (photo.developing) {
        setTimeout(() => {
          photo.developing = false;
          Storage.saveState();
        }, 2000);
      }
    });
    
    console.log(`🖼️ Gallery updated (${photos.length} photos)`);
  }
}

// Inject developing animation
const style = document.createElement('style');
style.textContent = `
  @keyframes developPhoto {
    0% {
      opacity: 0;
      filter: brightness(2) contrast(0.5);
    }
    50% {
      opacity: 0.5;
      filter: brightness(1.5) contrast(0.8);
    }
    100% {
      opacity: 1;
      filter: brightness(1) contrast(1);
    }
  }
`;
document.head.appendChild(style);

// Initialize and export
export const Polaroid = new PolaroidSystem();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Polaroid.init());
} else {
  Polaroid.init();
}
