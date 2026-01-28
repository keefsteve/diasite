// ============================================
// GAME FLOW SYSTEM
// Einheitlicher Win-Handler für alle Games
// ============================================

import { Inventory } from './inventory.js';
import { Navigation } from './navigation.js';

class GameFlow {
  handleGameWin(locationId, config) {
    const {
      character,
      dialogue,
      collectible,
      nextLocation = 'landing-page',
      activateTracker = false,
      nextTarget = null
    } = config;

    // 1. Collectible Animation zeigen
    if (collectible) {
      this.showCollectibleAnimation(collectible, () => {
        // 2. Collectible hinzufügen
        Inventory.addItem(collectible);
        
        // 3. Character Dialog zeigen
        window.CharacterDialogue.showDialogue(character, dialogue, {
          duration: 6000,
          onComplete: () => {
            // 4. Zurück zur Map
            Navigation.navigateTo(nextLocation);

            // 5. Hot/Cold Tracker aktivieren
            if (activateTracker && nextTarget) {
              this.activateHotColdTracker(nextTarget);
            }
          }
        });
      });
    } else {
      // Kein Collectible - direkt Dialog
      window.CharacterDialogue.showDialogue(character, dialogue, {
        duration: 6000,
        onComplete: () => {
          Navigation.navigateTo(nextLocation);
          if (activateTracker && nextTarget) {
            this.activateHotColdTracker(nextTarget);
          }
        }
      });
    }
  }

  showCollectibleAnimation(collectibleName, onComplete) {
    const animContainer = document.createElement('div');
    animContainer.className = 'collectible-animation';
    animContainer.innerHTML = `
      <div class="collectible-box">
        <img src="assets/sprites/objects/${collectibleName}.png" alt="${collectibleName}" 
             class="collectible-image" 
             style="width: 150px; height: 150px; object-fit: contain; margin-bottom: 15px;" />
        <div class="collectible-text">bekommen:</div>
        <div class="collectible-name">${collectibleName}</div>
      </div>
    `;
    document.body.appendChild(animContainer);
    
    setTimeout(() => {
      animContainer.remove();
      if (onComplete) onComplete();
    }, 1500);
  }

  activateHotColdTracker(targetId) {
    // Trigger gameWon event - hot/cold tracker lauscht darauf
    window.dispatchEvent(new CustomEvent('gameWon', {
      detail: { gameId: 'fountain' }
    }));
  }
}

const gameFlow = new GameFlow();
window.GameFlow = gameFlow;
