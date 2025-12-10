// ============================================
// ZENTRALE KONFIGURATION
// ============================================

export const CONFIG = {
  // Game Settings
  game: {
    minLocationsToUnlockHome: 7,
    totalCollectibles: 8,
    achievementPoints: {
      visitLocation: 10,
      winMinigame: 25,
      collectAll: 100
    }
  },
  
  // UI Settings
  ui: {
    dialogueDuration: 4000, // ms
    transitionSpeed: 800,   // ms
    flashMessageDuration: 1800 // ms
  },
  
  // Storage Keys
  storage: {
    stateKey: 'diasite_state',
    photosKey: 'diasite_photos',
    guestbookKey: 'diasite_guestbook'
  },
  
  // Feature Flags (für später)
  features: {
    weatherAPI: false,
    dateBasedEvents: false,
    firebase: false // wird später auf true gesetzt
  },
  
  // Default Language
  defaultLanguage: 'de'
};
