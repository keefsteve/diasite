// ============================================
// INVENTORY SYSTEM
// Collectibles Management
// ============================================

import { state } from '../core/state.js';
import { Storage } from '../core/storage.js';
import { i18n } from '../core/i18n.js';

class InventoryManager {
  constructor() {
    this.itemsContainer = null;
    this.uncollectedList = null;
    this.selectedItem = null;
    
    this.allCollectibles = [
      'key', 'salamander', 'blanket', 'pasxa', 
      'wet-clothes', 'yellow-shorts', 'snail', 'sheep', 'nudeCalendar'
    ];
  }
  
  init() {
    this.itemsContainer = document.getElementById('items');
    this.uncollectedList = document.getElementById('uncollected-list');
    
    if (!this.itemsContainer) {
      console.warn('⚠️ Inventory container not found');
      return;
    }
    
    // Initial render
    this.render();
    this.updateUncollectedList();
    
    console.log('✅ Inventory initialized');
  }
  
  // Add item to inventory
  addItem(itemId) {
    const added = state.addToInventory(itemId);

    if (added) {
      console.log('✅ Item added to state:', itemId);

      this.render();
      this.updateUncollectedList();

      // Show 90s-style collectible animation FIRST
      console.log('🎬 About to show animation...');
      setTimeout(() => {
        this.showCollectibleAnimation(itemId);
      }, 100);

      // Flash message
      const itemName = i18n.t(`collectibles.${itemId}`);
      this.flashMessage(i18n.t('messages.collected', { item: itemName }));

      // Save state
      Storage.saveState();

      return true;
    }

    return false;
  }

  // 90s video game style collectible animation
  showCollectibleAnimation(itemId) {
    console.log('🎬 Showing collectible animation for:', itemId);

    // Get item name with fallback
    let itemName = '📦 Item';
    let displayContent = '';

    try {
      itemName = i18n.t(`collectibles.${itemId}`);
    } catch (e) {
      console.warn('Could not get translation for', itemId);
      itemName = itemId;
    }

    // Check if image exists for this item
    const imagePath = `/assets/sprites/objects/${itemId}.png`;

    // Use image if available, fallback to emoji
    if (itemId === 'nudeCalendar' || itemId === 'salamander' || itemId === 'key') {
      displayContent = `<img src="${imagePath}" alt="${itemName}" class="collectible-image" />`;
    } else {
      // Fallback emojis
      const emojiMap = {
        'blanket': '🛏️',
        'pasxa': '🍰',
        'wet-clothes': '👔💧',
        'yellow-shorts': '🩳🇧🇷',
        'snail': '🐌',
        'sheep': '🐑'
      };
      const emoji = emojiMap[itemId] || '📦';
      displayContent = `<div class="collectible-emoji">${emoji}</div>`;
    }

    // Create animation container
    const container = document.createElement('div');
    container.className = 'collectible-animation';
    container.innerHTML = `
      <div class="collectible-box">
        ${displayContent}
        <div class="collectible-text">ITEM GET!</div>
        <div class="collectible-name">${itemName}</div>
      </div>
    `;

    document.body.appendChild(container);
    console.log('✅ Animation container added to body');

    // Remove after animation and show Steve dialogue if nudeCalendar
    setTimeout(() => {
      container.remove();
      console.log('🗑️ Animation removed');

      // Special sequence for nudeCalendar
      if (itemId === 'nudeCalendar') {
        this.showSteveDialogueAndNavigate();
      }
    }, 1500);
  }

  // Show Steve bouncing with dialogue, then navigate to landing page
  showSteveDialogueAndNavigate() {
    console.log('💬 Showing Steve dialogue...');

    // Find Steve sprite on fountain page
    const steveSprite = document.querySelector('#fountain .steve-sprite-static');
    if (!steveSprite) {
      console.warn('⚠️ Steve sprite not found');
      return;
    }

    // Add bouncing animation
    steveSprite.style.animation = 'steveBounce 0.5s ease-in-out infinite';

    // Create dialogue bubble
    const bubble = document.createElement('div');
    bubble.className = 'steve-dialogue-bubble';
    bubble.innerHTML = 'Komm, hör auf bei den Steinen zu springen, Mama holt uns in 15 min bei Oma und Opa ab und Oma wollte am Uni-Center noch was erledigen!';
    bubble.style.cssText = `
      position: fixed;
      bottom: 200px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 20px 30px;
      border-radius: 15px;
      border: 3px solid #667eea;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      font-family: 'Nineteen Ninety Seven';
      font-size: 1.1rem;
      max-width: 500px;
      text-align: center;
      z-index: 10000;
      animation: bubbleAppear 0.4s ease-out;
    `;

    document.body.appendChild(bubble);

    // After 6 seconds, remove bubble and navigate to landing page
    setTimeout(() => {
      bubble.remove();
      steveSprite.style.animation = '';

      // Navigate to landing page
      if (window.DiasiteNavigation) {
        window.DiasiteNavigation.navigateTo('landing-page');
      }

      // Activate hot/cold tracker
      this.activateHotColdTracker();
    }, 6000);
  }

  // Activate hot/cold tracker for snails location
  activateHotColdTracker() {
    console.log('🔥❄️ Activating hot/cold tracker...');

    // Dispatch event to activate tracker
    window.dispatchEvent(new CustomEvent('gameWon', {
      detail: { gameId: 'fountain' }
    }));
  }
  
  // Render inventory UI
  render() {
    if (!this.itemsContainer) return;
    
    this.itemsContainer.innerHTML = '';
    
    state.player.inventory.forEach(itemId => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item';
      itemEl.dataset.id = itemId;
      
      // Get translated name
      const itemName = i18n.t(`collectibles.${itemId}`);
      itemEl.textContent = itemName.split(' ')[0]; // Just the emoji
      itemEl.title = itemName; // Full name on hover
      
      // Click to select
      itemEl.addEventListener('click', () => this.selectItem(itemId, itemEl));
      
      this.itemsContainer.appendChild(itemEl);
    });
  }
  
  // Update uncollected list
  updateUncollectedList() {
    if (!this.uncollectedList) return;
    
    const uncollected = this.allCollectibles.filter(
      id => !state.player.inventory.includes(id)
    );
    
    if (uncollected.length === 0) {
      this.uncollectedList.innerHTML = `
        <span style="color:var(--pink);font-weight:600">
          ${i18n.t('ui.collectedAll')}
        </span>
      `;
    } else {
      const items = uncollected.map(id => {
        const name = i18n.t(`collectibles.${id}`);
        return `• ${name}`;
      }).join('<br>');
      
      this.uncollectedList.innerHTML = items;
    }
  }
  
  // Select an item
  selectItem(itemId, element) {
    // Toggle selection
    if (this.selectedItem === itemId) {
      this.selectedItem = null;
      element.classList.remove('selected');
      return;
    }
    
    // Deselect all
    this.itemsContainer.querySelectorAll('.item').forEach(
      el => el.classList.remove('selected')
    );
    
    // Select this one
    this.selectedItem = itemId;
    element.classList.add('selected');
    
    const itemName = i18n.t(`collectibles.${itemId}`);
    this.flashMessage(`Selected ${itemName}`);
  }
  
  // Flash message helper
  flashMessage(msg, duration = 1800) {
    const el = document.createElement('div');
    el.className = 'flash-message';
    el.textContent = msg;
    
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), duration);
  }
  
  // Get selected item
  getSelectedItem() {
    return this.selectedItem;
  }
  
  // Check if has item
  hasItem(itemId) {
    return state.player.inventory.includes(itemId);
  }
  
  // Update when language changes
  onLanguageChange() {
    this.render();
    this.updateUncollectedList();
  }
}

export const Inventory = new InventoryManager();

// Listen to language changes
window.addEventListener('languageChanged', () => {
  Inventory.onLanguageChange();
});
