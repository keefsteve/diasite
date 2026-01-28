// ============================================
// DIALOGUE SYSTEM
// Klein-Dia Dialog-Manager
// ============================================

import { i18n } from '../core/i18n.js';
import { CONFIG } from '../config.js';

class DialogueManager {
  constructor() {
    this.currentDialogue = null;
    this.queue = [];
  }
  
  // Zeige Dialog
  show(dialogueKey, params = {}, options = {}) {
    // Block klein_dia_intro completely
    if (dialogueKey === 'klein_dia_intro') {
      console.log('Blocked klein_dia_intro dialogue');
      return;
    }
    
    const text = i18n.t(`dialogue.${dialogueKey}`, params);
    const duration = options.duration || CONFIG.ui.dialogueDuration;
    const sprite = options.sprite || 'people/jenSprite.png'; // Default zu Klein-Dia
    
    // Erstelle Dialog Box
    const dialogBox = document.createElement('div');
    dialogBox.className = 'dia-dialogue';
    dialogBox.innerHTML = `
      <div class="dia-sprite-container">
        <img src="assets/sprites/${sprite}" 
             class="dia-sprite" 
             alt="Klein-Dia"
             onerror="this.style.display='none'">
      </div>
      <div class="dia-bubble">
        <p class="dia-text">${text}</p>
      </div>
    `;
    
    document.body.appendChild(dialogBox);
    
    // Animation
    requestAnimationFrame(() => {
      dialogBox.classList.add('show');
    });
    
    // Auto-remove
    setTimeout(() => {
      dialogBox.classList.remove('show');
      setTimeout(() => {
        dialogBox.remove();
        this.currentDialogue = null;
        this.processQueue();
      }, 500);
    }, duration);
    
    this.currentDialogue = dialogBox;
  }
  
  // Queue dialog (wenn einer schon läuft)
  queue(dialogueKey, params = {}, options = {}) {
    if (!this.currentDialogue) {
      this.show(dialogueKey, params, options);
    } else {
      this.queue.push({ dialogueKey, params, options });
    }
  }
  
  // Process queued dialogues
  processQueue() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      this.show(next.dialogueKey, next.params, next.options);
    }
  }
  
  // Hide current dialogue
  hide() {
    if (this.currentDialogue) {
      this.currentDialogue.classList.remove('show');
      setTimeout(() => {
        this.currentDialogue.remove();
        this.currentDialogue = null;
      }, 300);
    }
  }
  
  // Clear all
  clear() {
    this.hide();
    this.queue = [];
  }
}

export const Dialogue = new DialogueManager();

// Usage:
// Dialogue.show('klein_dia_intro');
// Dialogue.show('botanischer_garten_start', { name: state.player.name });
