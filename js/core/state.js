// ============================================
// STATE MANAGEMENT
// Single Source of Truth für App-State
// ============================================

import { CONFIG } from '../config.js';

class GameState {
  constructor() {
    // Player Data
    this.player = {
      name: '',
      language: CONFIG.defaultLanguage,
      currentLocation: 'welcome', // Start bei Welcome Screen
      inventory: ['magnifying-glass'], // Start with magnifying glass
      visitedLocations: [],
      achievements: []
    };
    
    // Game Progress
    this.gameProgress = {
      gamesPlayed: {},
      gamesWon: {},
      collectiblesFound: [],
      photosToken: 0, // Anzahl geschossener Polaroids
      photos: [] // Polaroid photos array
    };
    
    // Session Data (nicht persistent)
    this.session = {
      startTime: Date.now(),
      locationsVisitedToday: 0,
      homeUnlocked: false
    };
    
    // Guestbook Entries
    this.guestbook = [];
  }
  
  // State Update Helpers
  setPlayerName(name) {
    this.player.name = name;
  }
  
  setLanguage(lang) {
    this.player.language = lang;
  }
  
  addToInventory(itemId) {
    if (!this.player.inventory.includes(itemId)) {
      this.player.inventory.push(itemId);
      return true;
    }
    return false;
  }
  
  visitLocation(locationId) {
    if (!this.player.visitedLocations.includes(locationId)) {
      this.player.visitedLocations.push(locationId);
      this.session.locationsVisitedToday++;
      
      // Check if Home should be unlocked
      if (this.player.visitedLocations.length >= CONFIG.game.minLocationsToUnlockHome) {
        this.session.homeUnlocked = true;
      }
    }
  }
  
  markGameWon(gameId, collectibleId) {
    this.gameProgress.gamesWon[gameId] = true;
    this.gameProgress.gamesPlayed[gameId] = true;
    
    if (collectibleId) {
      this.addToInventory(collectibleId);
      if (!this.gameProgress.collectiblesFound.includes(collectibleId)) {
        this.gameProgress.collectiblesFound.push(collectibleId);
      }
    }
  }
  
  markGamePlayed(gameId) {
    this.gameProgress.gamesPlayed[gameId] = true;
  }
  
  addGuestbookEntry(entry) {
    this.guestbook.push({
      ...entry,
      timestamp: Date.now()
    });
  }
  
  addAchievement(achievementId) {
    if (!this.player.achievements.includes(achievementId)) {
      this.player.achievements.push(achievementId);
      return true;
    }
    return false;
  }
  
  // Serialize state for storage
  toJSON() {
    return {
      player: this.player,
      gameProgress: this.gameProgress,
      guestbook: this.guestbook,
      savedAt: Date.now()
    };
  }
  
  // Load state from storage
  fromJSON(data) {
    if (data.player) this.player = { ...this.player, ...data.player };
    if (data.gameProgress) this.gameProgress = { ...this.gameProgress, ...data.gameProgress };
    if (data.guestbook) this.guestbook = data.guestbook;
    
    // Recalculate session data
    if (this.player.visitedLocations.length >= CONFIG.game.minLocationsToUnlockHome) {
      this.session.homeUnlocked = true;
    }
  }
}

// Export singleton instance
export const state = new GameState();
