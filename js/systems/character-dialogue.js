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

    // Sprite finden
    const sprite = this.findSprite(character);
    if (!sprite) {
      console.warn(`Sprite für ${character} nicht gefunden`);
      return;
    }

    // Bounce Animation starten (nur Y-Achse!)
    if (bounce) {
      const originalTransform = sprite.style.transform || '';
      sprite.dataset.originalTransform = originalTransform;
      sprite.style.animation = 'characterBounce 2s ease-in-out infinite';
    }

    // Bubble erstellen
    const bubble = this.createBubble(character, text);
    document.body.appendChild(bubble);
    this.activeBubbles.set(character, bubble);

    // Nach Duration: aufräumen
    setTimeout(() => {
      bubble.remove();
      sprite.style.animation = '';
      if (sprite.dataset.originalTransform) {
        sprite.style.transform = sprite.dataset.originalTransform;
      }
      this.activeBubbles.delete(character);
      if (onComplete) onComplete();
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
    const bubble = document.createElement('div');
    bubble.className = `${character}-bubble show`;
    
    const color = character === 'jen' ? '#ff69b4' : '#667eea';
    
    bubble.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${color};
      color: white;
      padding: 30px 40px;
      border-radius: 20px;
      font-size: 1.3rem;
      max-width: 500px;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      animation: bubbleAppear 0.3s ease-out;
    `;

    bubble.textContent = text;
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

export default window.CharacterDialogue;
