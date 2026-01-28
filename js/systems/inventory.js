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
    
    // Only accept items with image files (no emoji-only items)
    this.allCollectibles = [
      'nudeCalendar', 'salamander', 'magnifying-glass', 'nesquik', 'snail', 'yellow-shorts'
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
    // Only accept items with images (no emoji-only items)
    if (!this.allCollectibles.includes(itemId)) {
      console.log(`⚠️ Item ${itemId} rejected - not in allCollectibles (emoji-only)`);
      return false;
    }

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

      // Dispatch inventory updated event
      window.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: { itemId } }));

      return true;
    }

    return false;
  }

  // Remove item from inventory
  removeItem(itemId) {
    const index = state.player.inventory.indexOf(itemId);
    if (index > -1) {
      state.player.inventory.splice(index, 1);
      console.log('✅ Item removed from inventory:', itemId);

      this.render();
      this.updateUncollectedList();

      // Save state
      Storage.saveState();

      // Dispatch inventory updated event
      window.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: { itemId } }));

      return true;
    }

    return false;
  }

  // 90s video game style collectible animation
  showCollectibleAnimation(itemId) {
    console.log('🎬 Showing collectible animation for:', itemId);

    // Don't show animation on landing page
    const landingPage = document.getElementById('landing-page');
    if (landingPage && landingPage.classList.contains('active')) {
      console.log('⚠️ Skipping animation - on landing page');
      return;
    }

    // Get item name with fallback
    let itemName = '📦 Item';
    let displayContent = '';

    try {
      itemName = i18n.t(`collectibles.${itemId}`);
    } catch (e) {
      console.warn('Could not get translation for', itemId);
      itemName = itemId;
    }

    // Map item IDs to image filenames
    const imageMap = {
      'nudeCalendar': 'nudeCalendar.png',
      'salamander': 'salamanderKopf.png',
      'magnifying-glass': 'lupe.png',
      'nesquik': 'nesquik.png',
      'snail': 'schnecke.png',
      'yellow-shorts': 'boxers.png'
    };

    const imagePath = `/assets/sprites/objects/${imageMap[itemId] || itemId + '.png'}`;
    displayContent = `<img src="${imagePath}" alt="${itemName}" class="collectible-image" />`;

    // Create animation container
    const container = document.createElement('div');
    container.className = 'collectible-animation';
    container.innerHTML = `
      <div class="collectible-box">
        ${displayContent}
        <div class="collectible-text">bekommen:</div>
        <div class="collectible-name">${itemName.replace(/^[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')}</div>
      </div>
    `;

    document.body.appendChild(container);
    console.log('✅ Animation container added to body');

    // Animation durations: all items get collectible-box animation
    let animDuration = 1500;
    if (itemId === 'nudeCalendar') {
      animDuration = 3000; // Longer for nudeCalendar
    }

    // Remove after animation
    setTimeout(() => {
      container.remove();
      console.log('🗑️ Animation removed');
    }, animDuration);
  }
  
  // Render inventory UI - always show all slots
  render() {
    if (!this.itemsContainer) return;

    this.itemsContainer.innerHTML = '';

    // Map item IDs to image filenames
    const spriteMap = {
      'magnifying-glass': 'assets/sprites/objects/lupe.png',
      'camera': 'assets/sprites/objects/cam.png',
      'nudeCalendar': 'assets/sprites/objects/nudeCalendar.png',
      'snail': 'assets/sprites/objects/schnecke.png',
      'nesquik': 'assets/sprites/objects/nesquik.png',
      'salamander': 'assets/sprites/objects/salamanderKopf.png',
      'yellow-shorts': 'assets/sprites/objects/boxers.png',
    };

    // Show ONLY collected items (no empty slots)
    state.player.inventory.forEach(itemId => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item';
      itemEl.dataset.id = itemId;

      // Get translated name
      let itemName = itemId;
      try {
        itemName = i18n.t(`collectibles.${itemId}`);
      } catch (e) {
        // Fallback to ID
      }
      itemEl.title = itemName; // Full name on hover

      // Show actual item sprite
      const spriteSrc = spriteMap[itemId] || `/assets/sprites/objects/${itemId}.png`;

      const img = document.createElement('img');
      img.src = spriteSrc;
      img.alt = itemName;
      img.style.cssText = 'width:32px;height:32px;max-width:32px;max-height:32px;object-fit:contain;image-rendering:pixelated;display:block;';
      img.onerror = () => {
        // Fallback if sprite not found
        itemEl.innerHTML = '';
        itemEl.textContent = '?';
      };
      itemEl.appendChild(img);

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
    // Don't show flash messages on landing page
    const landingPage = document.getElementById('landing-page');
    if (landingPage && landingPage.classList.contains('active')) {
      console.log('⚠️ Skipping flash message - on landing page');
      return;
    }

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
