// ============================================
// FOUNTAIN GAME INTEGRATION
// Verbindet Jump-Game mit Diasite Systems
// ============================================

(function() {
  let game = null;
  
  // Initialize game when page becomes active
  function initFountainGame() {
    // Clean up existing game
    if (game) {
      game.destroy();
      game = null;
    }
    
    // Create new game instance
    game = new FountainJumpGame('fountainCanvas');
    if (!game || !game.canvas) {
      alert('Failed to create game!');
      return;
    }
    
    // Setup callbacks
    game.onWin = function() {
      console.log('🎉 Fountain game won!');
      
      // Mark as won via game manager
      if (window.gameManager) {
        window.gameManager.markWon('fountain');
      }
      
      // Show dialogue
      if (window.DiasiteDialogue) {
        window.DiasiteDialogue.show('dialogue.fountain_win');
      }
      
      // Show replay button
      setTimeout(() => {
        const overlay = fountainPage.querySelector('.play-overlay');
        if (overlay) {
          overlay.classList.remove('hidden');
          const btn = overlay.querySelector('.play-btn');
          if (btn) btn.textContent = '🔄 Nochmal';
        }
      }, 2000);
    };
    
    game.onLose = function() {
      console.log('💦 Ins Wasser gefallen!');
      
      // Mark as lost
      if (window.gameManager) {
        window.gameManager.markLost('fountain');
      }
      
      // Show dialogue
      if (window.DiasiteDialogue) {
        window.DiasiteDialogue.show('dialogue.fountain_lose');
      }
      
      // Auto restart after 2 seconds
      setTimeout(() => {
        game.start();
      }, 2000);
    };
    
    // Start game
    game.start();
  }
  
  // Override startGame for fountain
  const originalStartGame = window.startGame;
  window.startGame = function(gameId) {
    if (gameId === 'fountain') {
      initFountainGame();
    } else if (originalStartGame) {
      originalStartGame(gameId);
    }
  };
  
  // Clean up when leaving page
  const observer = new MutationObserver(() => {
    const fountainPage = document.getElementById('fountain');
    if (fountainPage && !fountainPage.classList.contains('active')) {
      if (game) {
        game.destroy();
        game = null;
      }
    }
  });
  
  // Start observing after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const fountainPage = document.getElementById('fountain');
      if (fountainPage) {
        observer.observe(fountainPage, { attributes: true, attributeFilter: ['class'] });
      }
    });
  } else {
    const fountainPage = document.getElementById('fountain');
    if (fountainPage) {
      observer.observe(fountainPage, { attributes: true, attributeFilter: ['class'] });
    }
  }
})();
