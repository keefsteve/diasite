// ============================================
// I18N SYSTEM (Internationalisierung)
// Unterstützt DE & RU
// ============================================

import { CONFIG } from '../config.js';
import { state } from './state.js';

class I18nManager {
  constructor() {
    this.currentLang = CONFIG.defaultLanguage;
    this.translations = {};
    this.loaded = false;
  }
  
  // Lade Übersetzungen
  async loadLanguage(lang) {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      
      this.translations[lang] = await response.json();
      this.currentLang = lang;
      this.loaded = true;
      
      console.log(`✅ Language loaded: ${lang}`);
      
      // Update state
      state.setLanguage(lang);
      
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      
      return true;
    } catch (error) {
      console.error('❌ Failed to load language:', error);
      return false;
    }
  }
  
  // Übersetze einen Key
  t(key, params = {}) {
    if (!this.loaded) {
      console.warn('⚠️ Translations not loaded yet');
      return key;
    }
    
    // Navigiere durch nested object
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`⚠️ Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Replace placeholders: {name} → actual value
    if (typeof value === 'string') {
      return this.replacePlaceholders(value, params);
    }
    
    return value || key;
  }
  
  // Replace {placeholder} mit actual values
  replacePlaceholders(text, params) {
    let result = text;
    Object.keys(params).forEach(key => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
    });
    return result;
  }
  
  // Switch Language
  async switchLanguage(lang) {
    if (lang === this.currentLang) return;
    await this.loadLanguage(lang);
    
    // Trigger event for UI updates
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
  }
  
  // Get current language
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  // Check if translations are loaded
  isReady() {
    return this.loaded;
  }
}

// Export singleton
export const i18n = new I18nManager();

// Usage examples:
// i18n.t('welcome.title') → "Willkommen" (DE) / "Добро пожаловать" (RU)
// i18n.t('dialogue.botanischer_garten_start', { name: 'Jenny' }) → "Komm, lass uns..."
