// ============================================
// GAME MANAGER
// Manages all minigames
// ============================================

import { state } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { Inventory } from '../systems/inventory.js';
import { Dialogue } from '../systems/dialogue.js';
import { i18n } from '../core/i18n.js';

class GameManager {
  constructor() {
    // Game configurations
    this.games = {
      'home': { collectible: 'key' },
      'snails': { collectible: null }, // Nesquik and snail added directly in game code
      'bunker': { collectible: 'blanket' },

      'tanke': { collectible: 'pasxa' },
      'fountain': { collectible: 'camera' },
      'oma-opa-morg': { collectible: 'yellow-shorts' },

      'oma-shelya': { collectible: null }, // Dialogue encounter, no collectible
      'hustadt-dub': { collectible: null }
    };
  }
  
  // Start a game
  startGame(gameId) {
    const page = document.getElementById(gameId);
    if (!page) return;
    
    // Hide play overlay
    const overlay = page.querySelector('.play-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    
    // Mark as played
    state.markGamePlayed(gameId);
    
    // Initialize the game (calls old minigames.js function)
    if (typeof window.initGamesForPage === 'function') {
      window.initGamesForPage(gameId);
    }
    
    console.log(`🎮 Started game: ${gameId}`);
  }
  
  // Mark game as won
  markWon(gameId) {
    const game = this.games[gameId];
    if (!game) return;

    const collectible = game.collectible;

    // Update state
    state.markGameWon(gameId, collectible);

    // Add to inventory (Inventory will show "collected" message)
    if (collectible) {
      Inventory.addItem(collectible);
    }

    // Save
    Storage.saveState();

    console.log(`✅ Game won: ${gameId}`);
  }
  
  // Mark game as lost
  markLost(gameId) {
    state.markGamePlayed(gameId);
    
    const message = i18n.t('messages.gameLost');
    this.flashMessage(message);
    
    console.log(`❌ Game lost: ${gameId}`);
  }
  
  // Check if game was won
  hasWon(gameId) {
    return state.gameProgress.gamesWon[gameId] === true;
  }
  
  // Check if game was played
  hasPlayed(gameId) {
    return state.gameProgress.gamesPlayed[gameId] === true;
  }
  
  // Get collectible for game
  getCollectible(gameId) {
    return this.games[gameId]?.collectible || null;
  }
  
  // Flash message helper
  flashMessage(msg, duration = 1800) {
    const el = document.createElement('div');
    el.className = 'flash-message';
    el.textContent = msg;
    
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), duration);
  }
}

export const Games = new GameManager();

// Expose globally for legacy code compatibility
window.gameManager = {
  markWon: (gameId) => Games.markWon(gameId),
  markLost: (gameId) => Games.markLost(gameId),
  hasWon: (gameId) => Games.hasWon(gameId),
  games: Games.games
};

// Global function for legacy compatibility
window.startGame = (gameId) => Games.startGame(gameId);
window.flashMessage = (msg, duration) => Games.flashMessage(msg, duration);
