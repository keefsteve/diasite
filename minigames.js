// ========== MINIGAME IMPLEMENTATIONS ==========

// SNAIL WALL GAME (Uni-Center) - 30 Second Countdown
function initSnailWall(){
  const wall = document.getElementById('snail-wall');
  const caughtEl = document.getElementById('snails-caught');
  const totalEl = document.getElementById('snails-total');
  const timerEl = document.getElementById('snail-timer');

  if(!wall) return;

  const totalSnails = 42;
  const timeLimit = 30; // 30 seconds
  let caught = 0;
  let startTime = Date.now();
  let gameActive = true;
  let timerInterval;

  wall.innerHTML = '';
  wall.style.position = 'relative';
  wall.style.width = '100%';
  wall.style.height = '65vh';
  wall.style.maxWidth = '650px';
  wall.style.margin = '0';
  wall.style.backgroundImage = 'url("assets/sprites/places/wall.jpeg")';
  wall.style.backgroundSize = 'cover';
  wall.style.backgroundPosition = 'center';
  wall.style.borderRadius = '12px';
  wall.style.border = '4px solid #8b5a3c';
  wall.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.3)';
  wall.style.overflow = 'hidden';

  totalEl.textContent = totalSnails;

  // CHEAT: Track keys like fountain game
  const keys = {};
  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });
  document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  for(let i=0; i<totalSnails; i++){
    const snail = document.createElement('button');
    snail.className = 'snail-btn';
    snail.textContent = '🐌';
    // Greater size spectrum: 60% extra small (0.8-1.5), 30% medium (1.5-2.5), 10% large (2.5-4)
    const rand = Math.random();
    let size;
    if(rand < 0.6) size = 0.3 + Math.random() * 0.7; // extra small: 0.8-1.5rem
    else if(rand < 0.9) size = 1.5 + Math.random() * 1; // medium: 1.5-2.5rem
    else size = 2.5 + Math.random() * 1.5; // large: 2.5-4rem
    snail.style.fontSize = `${size}rem`;
    snail.style.position = 'absolute';
    snail.style.left = `${5 + Math.random() * 85}%`;
    snail.style.top = `${5 + Math.random() * 85}%`;
    snail.style.background = 'transparent';
    snail.style.border = 'none';
    snail.style.cursor = 'pointer';
    snail.style.transition = 'transform 0.1s';
    snail.style.zIndex = Math.floor(Math.random() * 10);

    snail.addEventListener('click', ()=>{
      if(!gameActive) return;
      caught++;
      caughtEl.textContent = caught;
      snail.remove();
      if(caught === totalSnails){
        gameActive = false;
        clearInterval(timerInterval);
        const time = Math.floor((Date.now()-startTime)/1000);

        // WIN!
        showJenVictory();
        flashMessage(`All snails caught in ${time}s! 🐌`);
        if(typeof gameManager !== 'undefined') gameManager.markWon('snails');
      }
    });

    snail.addEventListener('mouseenter', ()=> snail.style.transform='scale(1.2)');
    snail.addEventListener('mouseleave', ()=> snail.style.transform='scale(1)');

    wall.appendChild(snail);
  }

  // Countdown timer
  timerInterval = setInterval(()=>{
    const elapsed = Math.floor((Date.now()-startTime)/1000);
    const remaining = timeLimit - elapsed;

    if(remaining <= 0){
      gameActive = false;
      clearInterval(timerInterval);
      timerEl.textContent = '0';
      timerEl.style.color = '#ff4444';

      // LOSE!
      flashMessage(`Time's up! You caught ${caught}/${totalSnails} snails. Try again!`);
      if(typeof gameManager !== 'undefined') gameManager.markLost('snails');

      // Disable remaining snails
      wall.querySelectorAll('.snail-btn').forEach(s => {
        s.style.opacity = '0.3';
        s.style.pointerEvents = 'none';
      });
    } else {
      timerEl.textContent = remaining;
      // Warning color at 10 seconds
      if(remaining <= 10){
        timerEl.style.color = '#ff6600';
      }
    }
  }, 100);
}

// Initialize games based on current page
function initGamesForPage(pageId){
  setTimeout(()=>{
    if(pageId === 'snails') initSnailWall();
  }, 100);
}

// ========== JEN VICTORY ANIMATION ==========
function showJenVictory() {
  console.log('🎉 Jen Victory Animation!');

  // Find Jen sprite on current page
  const jenSprite = document.querySelector('#snails .jen-sprite');
  if (!jenSprite) {
    console.warn('Jen sprite not found on snails page');
    return;
  }

  // Add bouncing animation (nur Y-Achse)
  console.log('✅ Found Jen sprite, adding bounce');
  jenSprite.style.animation = 'characterBounce 2s ease-in-out infinite';

  // Create speech bubble with triangle - positioned right bottom, above inventory
  const bubble = document.createElement('div');
  bubble.innerHTML = `
    <div style="
      position: relative;
      background: white;
      padding: 18px 24px;
      border-radius: 20px;
      border: 3px solid #ff69b4;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      font-family: 'Nineteen Ninety Seven', monospace;
      font-size: 1rem;
      max-width: 380px;
      text-align: left;
    ">
      Komm zur nächsten Location!
      <div style="
        position: absolute;
        left: -18px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-right: 18px solid #ff69b4;
      "></div>
      <div style="
        position: absolute;
        left: -14px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-right: 15px solid white;
      "></div>
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
  document.body.appendChild(bubble);
  console.log('✅ Jen bubble added to body');

  // Trigger fade-in and start bounce
  setTimeout(() => {
    bubble.style.opacity = '1';
    bubble.style.animation = 'bubbleBounce 2s ease-in-out infinite';
  }, 10);

  // Remove bubble after 4 seconds and stop animation
  setTimeout(() => {
    bubble.style.opacity = '0';
    setTimeout(() => {
      bubble.remove();
      jenSprite.style.animation = '';
      console.log('🗑️ Jen bubble removed');

      // Navigate back to landing page
      console.log('🗺️ Navigating to landing page');
      if (window.DiasiteNavigation) {
        window.DiasiteNavigation.navigateTo('landing-page');
      } else {
        // Fallback navigation
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const landingPage = document.getElementById('landing-page');
        if (landingPage) {
          landingPage.classList.add('active');
        }
      }
    }, 500);
  }, 4000);
}
