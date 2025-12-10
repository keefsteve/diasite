// ============================================
// STORAGE MANAGER
// LocalStorage jetzt, Firebase später
// ============================================

import { CONFIG } from '../config.js';
import { state } from './state.js';

class StorageManager {
  constructor() {
    this.useCloud = CONFIG.features.firebase;
  }
  
  // ========== STATE PERSISTENCE ==========
  
  async saveState() {
    try {
      const data = state.toJSON();
      localStorage.setItem(CONFIG.storage.stateKey, JSON.stringify(data));
      console.log('✅ State saved to LocalStorage');
      return true;
    } catch (error) {
      console.error('❌ Failed to save state:', error);
      return false;
    }
  }
  
  async loadState() {
    try {
      const data = localStorage.getItem(CONFIG.storage.stateKey);
      if (data) {
        const parsed = JSON.parse(data);
        state.fromJSON(parsed);
        console.log('✅ State loaded from LocalStorage:', parsed);
        return true;
      }
      console.log('ℹ️ No saved state found - first visit');
      return false;
    } catch (error) {
      console.error('❌ Failed to load state:', error);
      return false;
    }
  }
  
  clearState() {
    localStorage.removeItem(CONFIG.storage.stateKey);
    console.log('🗑️ State cleared');
  }
  
  // ========== PHOTOS (IndexedDB via LocalForage später) ==========
  
  async savePhoto(photoData, metadata = {}) {
    try {
      const photos = this.loadPhotos();
      const photoId = `photo_${Date.now()}`;
      
      photos[photoId] = {
        data: photoData,
        metadata: {
          ...metadata,
          timestamp: Date.now(),
          location: state.player.currentLocation
        }
      };
      
      localStorage.setItem(CONFIG.storage.photosKey, JSON.stringify(photos));
      state.gameProgress.photosToken++;
      
      console.log('📸 Photo saved:', photoId);
      return photoId;
    } catch (error) {
      console.error('❌ Failed to save photo:', error);
      return null;
    }
  }
  
  loadPhotos() {
    try {
      const data = localStorage.getItem(CONFIG.storage.photosKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('❌ Failed to load photos:', error);
      return {};
    }
  }
  
  async getPhoto(photoId) {
    const photos = this.loadPhotos();
    return photos[photoId] || null;
  }
  
  // ========== GUESTBOOK ==========
  
  async saveGuestbookEntry(entry) {
    try {
      state.addGuestbookEntry(entry);
      await this.saveState(); // Guestbook ist Teil des State
      console.log('📖 Guestbook entry saved');
      return true;
    } catch (error) {
      console.error('❌ Failed to save guestbook entry:', error);
      return false;
    }
  }
  
  // ========== MIGRATION (für später) ==========
  
  async migrateToFirebase() {
    // TODO: Später implementieren
    console.log('🔄 Firebase migration not yet implemented');
  }
  
  // ========== EXPORT/IMPORT ==========
  
  exportAllData() {
    return {
      state: state.toJSON(),
      photos: this.loadPhotos(),
      version: '1.0.0',
      exportedAt: Date.now()
    };
  }
  
  importData(data) {
    try {
      if (data.state) {
        localStorage.setItem(CONFIG.storage.stateKey, JSON.stringify(data.state));
        state.fromJSON(data.state);
      }
      if (data.photos) {
        localStorage.setItem(CONFIG.storage.photosKey, JSON.stringify(data.photos));
      }
      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Import failed:', error);
      return false;
    }
  }
}

// Export singleton
export const Storage = new StorageManager();

// Auto-save beim Page Unload
window.addEventListener('beforeunload', () => {
  Storage.saveState();
});

// Auto-save alle 30 Sekunden
setInterval(() => {
  Storage.saveState();
}, 30000);
