// ============================================
// NAVIGATION SYSTEM
// Page & Location Navigation
// ============================================

import { state } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { Dialogue } from './dialogue.js';

class NavigationManager {
  constructor() {
    this.currentPage = null;
    this.transitionSpeed = 500;
  }
  
  init() {
    this.setupNavigationButtons();
    console.log('✅ Navigation initialized');
  }
  
  // Navigate to a page/location
  navigateTo(pageId) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(pageId);
    
    if (!targetPage) {
      console.error(`Page ${pageId} not found`);
      return;
    }
    
    // Don't navigate if already on this page
    if (currentPage === targetPage && currentPage.classList.contains('active')) return;
    
    // Hide ALL pages first
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    targetPage.classList.add('active');
    
    // Update state
    state.player.currentLocation = pageId;
    this.currentPage = pageId;
    
    // Show Steve greeting on every location (DISABLED)
    if (false && this.isGameLocation(pageId)) {
      setTimeout(() => {
        // Custom Steve greeting - no dialogue system needed
        this.showSteveGreeting();
      }, 500);
      
      state.visitLocation(pageId);
      
      // Check if home should be unlocked
      if (state.session.homeUnlocked && !this.hasShownHomeMessage) {
        this.hasShownHomeMessage = true;
        setTimeout(() => {
          Dialogue.show('after_7_locations');
        }, 1000);
      }
    }
    
    // Initialize game for this page (if exists)
    if (typeof window.initGamesForPage === 'function') {
      window.initGamesForPage(pageId);
    }
    
    // Save state
    Storage.saveState();
    
    console.log(`📍 Navigated to: ${pageId}`);
  }
  
  // Check if a page is a game location
  isGameLocation(pageId) {
    const gameLocations = [
      'home', 'snails', 'bunker', 'krivaya', 
      'tanke', 'fountain', 'oma-opa-morg', 
      'oma-opa-shnol', 'hustadt-dub'
    ];
    return gameLocations.includes(pageId);
  }
  
  // Setup all navigation buttons
  setupNavigationButtons() {
    // Arrow buttons & back buttons
    const buttons = document.querySelectorAll('.arrow-btn, .back-btn, .map-hotspot');
    console.log(`🔧 Setup ${buttons.length} navigation buttons`);
    
    buttons.forEach(btn => {
      const target = btn.dataset.target;
      const isLocked = btn.classList.contains('locked');
      
      if (target === 'snails') {
        console.log(`🐌 Snails button found - locked: ${isLocked}`);
      }
      
      btn.addEventListener('click', (e) => {
        console.log(`🖱️ Click on button: ${target}, locked: ${btn.classList.contains('locked')}`);
        
        // Skip locked hotspots
        if (btn.classList.contains('locked')) {
          console.log('🔒 Location locked');
          return;
        }
        
        if (target) {
          this.navigateTo(target);
        }
      });
    });
  }
  
  // Get current page
  getCurrentPage() {
    return this.currentPage;
  }
  
  // Show Steve greeting with effect
  showSteveGreeting() {
    // Remove any existing greeting
    const existing = document.querySelector('.steve-greeting');
    if (existing) existing.remove();
    
    // Create greeting element
    const greeting = document.createElement('div');
    greeting.className = 'steve-greeting';
    greeting.innerHTML = `
      <img src="/assets/sprites/people/steveSprite.png" alt="Steve" class="steve-sprite" />
      <div class="steve-bubble">Hey!</div>
    `;
    
    document.body.appendChild(greeting);
    
    // Animate in
    requestAnimationFrame(() => {
      greeting.classList.add('show');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      greeting.classList.remove('show');
      setTimeout(() => greeting.remove(), 500);
    }, 3000);
  }
}

export const Navigation = new NavigationManager();
