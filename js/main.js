// ============================================
// MAIN APP - Entry Point
// Orchestriert alle Module
// ============================================

import { CONFIG } from './config.js';
import { state } from './core/state.js';
import { Storage } from './core/storage.js';
import { i18n } from './core/i18n.js';
import { Dialogue } from './systems/dialogue.js';
import { Navigation } from './systems/navigation.js';
import { Inventory } from './systems/inventory.js';
import { Games } from './systems/game-manager.js';
import CharacterDialogue from './systems/character-dialogue.js';
import GameFlow from './systems/game-flow.js';

class App {
  constructor() {
    this.initialized = false;
    this.currentPage = null;
  }
  
  async init() {
    console.log('🚀 Initializing Diasite...');
    
    try {
      // 1. Load State from Storage
      const hasExistingState = await Storage.loadState();
      
      // 2. Redirect to welcome if no name
      if (!state.player.name || state.player.name.trim() === '') {
        console.log('❌ No player name found - redirecting to welcome.html');
        window.location.href = 'welcome.html';
        return;
      }
      
      console.log('✅ Player found:', state.player.name);
      
      // 3. Load Language
      await i18n.loadLanguage(state.player.language || CONFIG.defaultLanguage);
      
      // 4. Initialize Systems
      Navigation.init();
      Inventory.init();
      
      // 5. Check if URL has a hash for direct navigation
      const hash = window.location.hash.substring(1); // Remove the #
      if (hash) {
        console.log(`🔗 Navigating to ${hash} from URL hash`);
        Navigation.navigateTo(hash);
      } else {
        // Show landing page (we already have a name)
        this.showLandingPage();
      }
      
      // 6. Setup Event Listeners
      this.setupEventListeners();
      
      // 7. Mark app as ready
      document.body.classList.add('app-ready');
      
      this.initialized = true;
      console.log('✅ Diasite initialized');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      document.body.classList.add('app-ready'); // Show even on error
    }
  }
  
  // Show Welcome Screen (first visit)
  showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const landingPage = document.getElementById('landing-page');
    
    if (welcomeScreen && landingPage) {
      // Force remove all active states first
      document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
      });
      
      // Then activate welcome screen
      welcomeScreen.classList.remove('hidden');
      welcomeScreen.classList.add('active');
      
      console.log('✅ Welcome screen shown');
      
      // Setup welcome screen
      this.setupWelcomeScreen();
    } else {
      console.error('❌ Welcome screen or landing page not found');
    }
  }
  
  // Show Landing Page (returning visitor)
  showLandingPage() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const landingPage = document.getElementById('landing-page');
    
    if (welcomeScreen && landingPage) {
      welcomeScreen.classList.remove('active');
      welcomeScreen.classList.add('hidden');
      landingPage.classList.add('active');
    }
    
    this.currentPage = 'landing-page';
  }
  
  // Setup Welcome Screen
  setupWelcomeScreen() {
    const nameInput = document.getElementById('player-name-input');
    const startBtn = document.getElementById('welcome-start-btn');
    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Update UI text
    this.updateWelcomeScreenText();
    
    // Language buttons
    langBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        await i18n.switchLanguage(lang);
        
        // Update active state
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update text
        this.updateWelcomeScreenText();
      });
    });
    
    // Name input validation
    nameInput.addEventListener('input', () => {
      startBtn.disabled = nameInput.value.trim().length === 0;
    });
    
    // Start button
    startBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (name) {
        state.setPlayerName(name);
        Storage.saveState();
        
        // Add first guestbook entry
        Storage.saveGuestbookEntry({
          name: name,
          message: 'Erste Besuch / Первый визит',
          type: 'first_visit'
        });
        
        // Transition to landing page
        this.transitionToLandingPage();
      }
    });
    
    // Enter key support
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !startBtn.disabled) {
        startBtn.click();
      }
    });
    
    // Focus input
    setTimeout(() => nameInput.focus(), 500);
  }
  
  updateWelcomeScreenText() {
    const title = document.getElementById('welcome-title');
    const question = document.getElementById('welcome-question');
    const input = document.getElementById('player-name-input');
    const btn = document.getElementById('welcome-start-btn');
    
    if (title) title.textContent = i18n.t('welcome.title');
    if (question) question.textContent = i18n.t('welcome.question');
    if (input) input.placeholder = i18n.t('welcome.placeholder');
    if (btn) btn.textContent = i18n.t('welcome.start');
  }
  
  // Transition from Welcome to Landing
  transitionToLandingPage() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const landingPage = document.getElementById('landing-page');
    
    // Fade out welcome
    welcomeScreen.style.transition = 'opacity 0.5s';
    welcomeScreen.style.opacity = '0';
    
    setTimeout(() => {
      welcomeScreen.classList.remove('active');
      welcomeScreen.classList.add('hidden');
      landingPage.classList.add('active');
      
      this.currentPage = 'landing-page';
    }, 500);
  }
  
  // Setup global event listeners
  setupEventListeners() {
    // Language change
    window.addEventListener('languageChanged', () => {
      this.updateUILanguage();
    });
    
    // Game won event (from inline game scripts)
    window.addEventListener('gameWon', (event) => {
      const { gameId } = event.detail;
      console.log(`🎮 Game won event received: ${gameId}`);

      // Games.markWon will handle adding the collectible to inventory
      if (Games) {
        Games.markWon(gameId);
      }
    });
    
    // Save state periodically
    setInterval(() => {
      if (this.initialized) {
        Storage.saveState();
      }
    }, 30000);
  }
  
  // Update all UI text when language changes
  updateUILanguage() {
    // Update inventory
    const inventoryTitle = document.querySelector('.inventory-title');
    if (inventoryTitle) {
      inventoryTitle.textContent = i18n.t('ui.inventory');
    }
    
    // Update instructions panel
    const instructionText = document.querySelector('.instruction-text');
    if (instructionText) {
      instructionText.textContent = i18n.t('ui.stillNeed');
    }
    
    // Update collectibles list
    this.updateCollectiblesList();
    
    // Update back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.textContent = i18n.t('ui.back');
    });
    
    // Update play buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.textContent = i18n.t('ui.play');
    });
  }
  
  updateCollectiblesList() {
    Inventory.updateUncollectedList();
  }
}

// Initialize app when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for global access
window.DiasiteApp = app;
window.DiasiteState = state;
window.DiasiteGames = Games;
window.DiasiteInventory = Inventory;
window.DiasiteNavigation = Navigation;

export default app;
