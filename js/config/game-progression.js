// ============================================
// GAME PROGRESSION CONFIGURATION
// Definiert die Reihenfolge und Abhängigkeiten aller Levels
// ============================================

export const PROGRESSION = {
  // Level 0: Botanischer Garten (spawn location, one-time visit)
  'botanical-garden': {
    level: 0,
    displayName: 'Botanischer Garten',
    game: 'fountain-jump',
    collectible: 'nudeCalendar',
    missionAfter: 'Gehe nun zum Uni-Center. Versuche es so zu finden, aber wenn das zu schwierig ist, kannst du den Mauszeiger benutzen!',
    unlocks: ['snails'],
    character: 'steve',
    dialogue: 'Ну хватит прыгать по камням, мама нас заберёт через 15 минут у бабушки и дедушки, а бабушка хотела ещё что-то в Юни-Центре сделать!',
    isSpawnLocation: true,
    buttonVisible: false,
    oneTimeOnly: true
  },

  // Level 1: Fountain (placeholder for now)
  'fountain': {
    level: 1,
    displayName: 'Fountain',
    game: null,
    collectible: null,
    missionAfter: 'Placeholder for future content',
    unlocks: [],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'To be implemented later'
  },

  // Level 2: Uni Center
  'snails': {
    level: 2,
    displayName: 'Uni-Center',
    game: 'snails',
    collectible: 'nesquik',
    missionAfter: 'Gehe nun zu Oma und Opa Shnol. Mama ist bald da!',
    unlocks: ['oma-opa-shnol'],
    character: 'oma',
    dialogue: 'Gut gemacht Kinder! Hier, eine Packung Nesquik!',
    specialAnimation: 'oma-reward',
    buttonVisible: true
  },

  // Level 3: Oma & Opa Shnol
  'oma-opa-shnol': {
    level: 3,
    displayName: 'Oma & Opa Shnol',
    game: 'cheek-slapping',
    collectible: 'sheep',
    missionAfter: 'Gehe nun zur Krivaya Gorka. Beeil dich!',
    unlocks: ['krivaya'],
    character: 'oma-opa',
    dialogue: 'Danke für den Besuch!',
    alternativeWinCondition: {
      item: 'nudeCalendar',
      description: 'Gib den Kalender ab um direkt zu gewinnen'
    },
    rewardAfterWin: 'pasxa',
    buttonVisible: true
  },

  // Level 4: Krivaya Gorka
  'krivaya': {
    level: 4,
    displayName: 'Krivaya Gorka',
    game: null, // Noch zu implementieren
    collectible: 'wet-clothes',
    missionAfter: 'Gehe nun zum Fountain. Beeil dich!',
    unlocks: ['fountain-video'],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'Spiel noch zu überlegen'
  },

  // Level 5: Fountain Video (second visit)
  'fountain-video': {
    level: 5,
    displayName: 'Fountain',
    game: 'video', // Video anzeigen
    collectible: null,
    missionAfter: 'Gehe nun zu Oma und Opa Morg. Beeil dich!',
    unlocks: ['oma-opa-morg'],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'Video wird hier angezeigt'
  },

  // Level 6: Oma & Opa Morg
  'oma-opa-morg': {
    level: 6,
    displayName: 'Oma & Opa Morg',
    game: null, // Noch zu implementieren
    collectible: 'yellow-shorts',
    missionAfter: 'Gehe nun zu Oma Shelya. Beeil dich!',
    unlocks: ['oma-shelya'],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'Spiel noch zu überlegen'
  },

  // Level 7: Oma Shelya (NEU)
  'oma-shelya': {
    level: 7,
    displayName: 'Oma Shelya',
    game: 'fish-game', // Noch zu implementieren
    collectible: 'fish',
    missionAfter: 'Gehe nun zum Bunker. Beeil dich!',
    unlocks: ['bunker'],
    character: 'oma-shelya',
    dialogue: 'Hier, nimm den Fisch!',
    buttonVisible: true,
    todo: 'Fisch-Spiel später implementieren'
  },

  // Level 8: Bunker
  'bunker': {
    level: 8,
    displayName: 'Bunker',
    game: null, // Noch zu implementieren
    collectible: 'blanket',
    missionAfter: 'Gehe nun zur School. Beeil dich!',
    unlocks: ['school'],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'Spiel noch zu überlegen'
  },

  // Level 9: School
  'school': {
    level: 9,
    displayName: 'School',
    game: null, // Noch zu implementieren
    collectible: null,
    missionAfter: 'Gehe nun zur Tanke. Beeil dich!',
    unlocks: ['tanke'],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'Spiel noch zu überlegen'
  },

  // Level 10: Tanke
  'tanke': {
    level: 10,
    displayName: 'Tanke',
    game: null, // Noch zu implementieren
    collectible: 'pasxa',
    missionAfter: 'Gehe nun nach Hause. Beeil dich!',
    unlocks: ['home'],
    character: null,
    dialogue: null,
    buttonVisible: true,
    todo: 'Spiel noch zu überlegen'
  },

  // Level 11: Home (Finale)
  'home': {
    level: 11,
    displayName: 'Home',
    game: 'final-game',
    collectible: 'key',
    missionAfter: '✓ Alle Orte erforscht! Du hast alle Erinnerungen gesammelt.',
    unlocks: [],
    character: null,
    dialogue: 'Du hast es geschafft!',
    buttonVisible: true,
    isFinal: true
  }
};

// Helper functions
export function getNextLocation(currentLocationId) {
  const current = PROGRESSION[currentLocationId];
  if (!current || !current.unlocks || current.unlocks.length === 0) {
    return null;
  }
  return current.unlocks[0]; // Return first unlock
}

export function getMissionMessage(completedCount) {
  // Find the location at the current level
  const locations = Object.entries(PROGRESSION)
    .sort((a, b) => a[1].level - b[1].level);
  
  if (completedCount >= locations.length) {
    return PROGRESSION['home'].missionAfter;
  }
  
  const currentLocation = locations[completedCount];
  if (!currentLocation) {
    return 'Finde den nächsten Ort!';
  }
  
  return currentLocation[1].missionAfter;
}

export function getLocationByLevel(level) {
  return Object.entries(PROGRESSION)
    .find(([id, data]) => data.level === level)?.[0] || null;
}

export function getCompletedCount() {
  if (!window.DiasiteState || !window.DiasiteState.games) {
    return 0;
  }
  return Object.values(window.DiasiteState.games).filter(g => g.won).length;
}
