// ============================================
// CHARACTER DIALOGUE SYSTEM
// Zentralisiertes Dialog-Management
// ============================================

class CharacterDialogue {
  constructor() {
    this.activeBubbles = new Map();
  }

  showDialogue(character, text, options = {}) {
    const {
      duration = 6000,
      onComplete = null,
      bounce = true
    } = options;

    // Remove existing bubble for this character to prevent duplicates
    if (this.activeBubbles.has(character)) {
      const oldBubble = this.activeBubbles.get(character);
      oldBubble.remove();
      this.activeBubbles.delete(character);
    }

    // Sprite finden
    const sprite = this.findSprite(character);
    if (!sprite) {
      console.warn(`Sprite für ${character} nicht gefunden`);
      return;
    }
    
    // Check if sprite is blocked (e.g. during Oma phase)
    if (sprite.dataset.blockedForOma === 'true') {
      console.log(`Sprite ${character} blocked for Oma phase - skipping`);
      return;
    }

    // Stop any existing animation first
    sprite.style.animation = '';

    // Bounce Animation starten (nur Y-Achse!)
    if (bounce) {
      const originalTransform = sprite.style.transform || '';
      sprite.dataset.originalTransform = originalTransform;
      setTimeout(() => {
        sprite.style.animation = 'characterBounce 2s ease-in-out infinite';
      }, 10);
    }

    // Bubble erstellen
    const bubble = this.createBubble(character, text);
    document.body.appendChild(bubble);
    this.activeBubbles.set(character, bubble);

    // Nach Duration: aufräumen
    setTimeout(() => {
      bubble.style.opacity = '0';
      setTimeout(() => {
        bubble.remove();
        sprite.style.animation = '';
        if (sprite.dataset.originalTransform) {
          sprite.style.transform = sprite.dataset.originalTransform;
        }
        this.activeBubbles.delete(character);
        if (onComplete) onComplete();
      }, 500);
    }, duration);
  }

  findSprite(character) {
    // Versuche zuerst in der aktuellen Page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      const sprite = activePage.querySelector(`.${character}-sprite, .${character}-sprite-static`);
      if (sprite) return sprite;
    }

    // Fallback: Global suchen
    return document.querySelector(`.${character}-sprite, .${character}-sprite-static`);
  }

  createBubble(character, text) {
    // Player characters use terracotta, NPCs use sky-blue
    const isPlayer = ['steve', 'jen'].includes(character);
    const bgColor = isPlayer ? 'var(--terracotta)' : 'var(--sky-blue)';
    const textColor = isPlayer ? '#fff' : '#333';

    const bubble = document.createElement('div');
    bubble.innerHTML = `
      <div style="
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 25px;
        border: 3px solid #000;
        font-family: 'Nineteen Ninety Seven', monospace;
        font-size: 1rem;
        max-width: 400px;
        text-align: left;
        box-shadow: 4px 4px 0px #000;
      ">
        ${text}
      </div>
    `;

    bubble.style.cssText = `
      position: fixed;
      bottom: 60px;
      right: 530px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.5s ease-out;
    `;

    // Trigger fade-in and bounce
    setTimeout(() => {
      bubble.style.opacity = '1';
      bubble.style.animation = 'bubbleBounce 2s ease-in-out infinite';
    }, 10);

    return bubble;
  }

  clearAll() {
    this.activeBubbles.forEach(bubble => bubble.remove());
    this.activeBubbles.clear();
    
    // Alle Sprite-Animationen stoppen
    document.querySelectorAll('.steve-sprite, .jen-sprite, .steve-sprite-static, .jen-sprite-static')
      .forEach(sprite => sprite.style.animation = '');
  }
}

// Global verfügbar machen
window.CharacterDialogue = new CharacterDialogue();
