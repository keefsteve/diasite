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
      this.render();
      this.updateUncollectedList();
      
      // Flash message
      const itemName = i18n.t(`collectibles.${itemId}`);
      this.flashMessage(i18n.t('messages.collected', { item: itemName }));
      
      // Save state
      Storage.saveState();
      
      return true;
    }
    
    return false;
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
