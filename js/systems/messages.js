// ============================================
// MESSAGE SYSTEM
// Zentrales System für alle UI-Messages
// ============================================

import { PROGRESSION, getNextLocation, getMissionMessage } from '../config/game-progression.js';
import { i18n } from '../core/i18n.js';

class MessageSystem {
  constructor() {
    this.missionBox = null;
    this.init();
  }

  init() {
    this.missionBox = document.getElementById('mission-box');
    if (!this.missionBox) {
      console.warn('Mission box not found');
    }
  }

  /**
   * Flash Message: Kurze Notification (Game Won, Item Collected, etc.)
   * @param {string} msg - Die Nachricht
   * @param {number} duration - Dauer in ms (default: 1800)
   */
  showFlash(msg, duration = 1800) {
    const el = document.createElement('div');
    el.className = 'flash-message';
    el.textContent = msg;

    // Stack messages vertically if multiple exist
    const existingMessages = document.querySelectorAll('.flash-message');
    if (existingMessages.length > 0) {
      // Calculate vertical offset based on number of existing messages
      const offset = existingMessages.length * 70; // 70px spacing per message
      el.style.top = `${20 + offset}px`;
    }

    document.body.appendChild(el);

    setTimeout(() => el.remove(), duration);
  }

  /**
   * Mission Update: Zeigt die nächste Mission in der Mission Box
   * Format: "Gehe nun zum [Location]. Beeil dich!"
   */
  updateMission() {
    if (!this.missionBox) {
      console.warn('⚠️ Messages: Mission box not found!');
      return;
    }

    // Get won games from state
    const wonGames = this.getWonGames();
    console.log('🏆 Won games:', wonGames);
    
    if (wonGames.length === 0) {
      console.log('⚠️ No games won yet');
      return;
    }
    
    // Get the last won game
    const lastWonGameId = wonGames[wonGames.length - 1];
    console.log('🎮 Last won game:', lastWonGameId);
    
    // Get progression data for this game
    const progressionData = PROGRESSION[lastWonGameId];
    if (!progressionData) {
      console.warn('⚠️ No progression data for', lastWonGameId);
      return;
    }
    
    // Show missionAfter
    const message = progressionData.missionAfter || 'Weiter geht\'s!';
    console.log('📝 Setting message:', message);
    this.missionBox.textContent = message;
    
    // Unlock next location(s)
    if (progressionData.unlocks && progressionData.unlocks.length > 0) {
      progressionData.unlocks.forEach(locationId => {
        console.log('🔓 Unlocking:', locationId);
        this.unlockHotspot(locationId);
      });
    }
  }

  /**
   * Show Unlock Notification: "New Location Unlocked!"
   * @param {string} locationName - Name der Location
   */
  showUnlock(locationName) {
    this.showFlash(`🗺️ ${locationName} freigeschaltet!`, 2500);
  }

  /**
   * Show Progress: Custom Progress Message mit Icon
   * @param {string} text - Message Text
   * @param {string} icon - Emoji Icon
   */
  showProgress(text, icon = '📍') {
    this.showFlash(`${icon} ${text}`, 2000);
  }

  /**
   * Show Item Get: Item erhalten Message
   * @param {string} itemName - Name des Items
   */
  showItemGet(itemName) {
    this.showFlash(`✓ ${itemName} erhalten!`, 2000);
  }

  /**
   * Helper: Get completed count from state
   */
  getWonGames() {
    if (!window.DiasiteState || !window.DiasiteState.gameProgress || !window.DiasiteState.gameProgress.gamesWon) {
      return [];
    }
    return Object.entries(window.DiasiteState.gameProgress.gamesWon)
      .filter(([id, won]) => won === true)
      .map(([id]) => id);
  }
  
  getCompletedCount() {
    return this.getWonGames().length;
  }

  /**
   * Unlock a specific hotspot button
   */
  unlockHotspot(locationId) {
    console.log('🔍 Unlocking hotspot:', locationId);
    
    // Find hotspot with matching data-target
    const hotspot = document.querySelector(`.map-hotspot[data-target="${locationId}"]`);
    
    if (hotspot) {
      const wasLocked = hotspot.classList.contains('locked');
      hotspot.classList.remove('locked');
      hotspot.style.setProperty('pointer-events', 'auto', 'important');
      hotspot.style.setProperty('cursor', 'pointer', 'important');
      hotspot.style.setProperty('opacity', '1', 'important');
      console.log(`✅ ${wasLocked ? 'Unlocked' : 'Already unlocked'}:`, locationId);
    } else {
      console.warn('❌ Hotspot not found:', locationId);
      console.log('Available:', [...document.querySelectorAll('.map-hotspot')].map(h => h.dataset.target));
    }
  }

  /**
   * Unlock all hotspots
   */
  unlockAllHotspots() {
    document.querySelectorAll('.map-hotspot.locked').forEach(hotspot => {
      hotspot.classList.remove('locked');
      hotspot.style.pointerEvents = 'auto';
      console.log('🔓 Unlocked:', hotspot.dataset.target);
    });
  }

  /**
   * Listen to game events
   */
  setupEventListeners() {
    console.log('🔊 Messages: Setting up event listeners');
    
    // Update mission on game won
    window.addEventListener('gameWon', (e) => {
      console.log('🎮 Messages: gameWon event received!', e.detail);
      console.log('Current DiasiteState.games:', window.DiasiteState?.games);
      this.updateMission();
    });

    // Update when landing page becomes active
    const observer = new MutationObserver(() => {
      const landingPage = document.getElementById('landing-page');
      if (landingPage && landingPage.classList.contains('active')) {
        this.updateMission();
      }
    });

    const landingPage = document.getElementById('landing-page');
    if (landingPage) {
      observer.observe(landingPage, { attributes: true, attributeFilter: ['class'] });
    }

    // Initial update
    this.updateMission();
  }
}

// Create singleton instance
const Messages = new MessageSystem();

// Expose globally for compatibility
window.Messages = Messages;
window.flashMessage = (msg, duration) => Messages.showFlash(msg, duration);

export { Messages };
