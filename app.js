// ============================================
// LEGACY APP.JS - Being phased out
// Now uses new modular systems from js/
// ============================================

// Compatibility layer - use new systems if available
const legacyState = {
  inventory: [],
  selectedItem: null,
  currentPage: 'landing-page',
};

// Use new state if available, fallback to legacy
const state = window.DiasiteState || legacyState;

// Use new game manager if available
const gameManager = window.gameManager || {
  games: {},
  markPlayed: () => {},
  markWon: () => {},
  markLost: () => {},
  hasWon: () => false
};

// Use new startGame if available
const startGame = window.startGame || function(gameId) {
  const page = document.getElementById(gameId);
  if (!page) return;
  
  const overlay = page.querySelector('.play-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
  
  if (typeof initGamesForPage === 'function') {
    initGamesForPage(gameId);
  }
};

const itemsEl = document.getElementById('items');
const uncollectedList = document.getElementById('uncollected-list');

// Page navigation - use new system if available
function navigateToPage(pageId){
  if (window.DiasiteNavigation) {
    window.DiasiteNavigation.navigateTo(pageId);
  } else {
    // Fallback to old method
    document.querySelectorAll('.page').forEach(p=> p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if(targetPage){ 
      targetPage.classList.add('active');
      state.currentPage = pageId;
      if(typeof initGamesForPage === 'function'){
        initGamesForPage(pageId);
      }
    }
  }
}

// Navigation handled by new Navigation system
// No need to re-register event listeners

// Pickup objects - now uses new Inventory system
document.querySelectorAll('.object').forEach(o=>{
  o.addEventListener('click', ()=>{
    const id = o.dataset.id;
    
    // Use new inventory system if available
    if (window.DiasiteInventory) {
      if (window.DiasiteInventory.hasItem(id)) {
        flashMessage(`Already collected!`);
        return;
      }
      window.DiasiteInventory.addItem(id);
      o.style.opacity = '0.4';
      o.style.pointerEvents = 'none';
    } else {
      // Fallback
      if(state.inventory.includes(id)){
        flashMessage(`${id} already picked up.`);
        return;
      }
      state.inventory.push(id);
      renderInventory();
      o.style.opacity = '0.4';
      o.style.pointerEvents = 'none';
      flashMessage(`Picked up: ${id}`);
    }
  });
});

function renderInventory(){
  // Use new Inventory system if available
  if (window.DiasiteInventory) {
    window.DiasiteInventory.render();
    return;
  }
  
  // Fallback to old method
  if (!itemsEl) return;
  itemsEl.innerHTML = '';
  state.inventory.forEach(id=>{
    const el = document.createElement('div');
    el.className = 'item';
    el.textContent = id;
    el.dataset.id = id;
    el.addEventListener('click', ()=> selectItem(id, el));
    itemsEl.appendChild(el);
  });
  updateUncollectedList();
}

function updateUncollectedList(){
  // Use new Inventory system if available
  if (window.DiasiteInventory) {
    window.DiasiteInventory.updateUncollectedList();
    return;
  }
  
  // Fallback (not needed with new system)
}

function selectItem(id, el){
  // Use new Inventory system if available
  if (window.DiasiteInventory) {
    window.DiasiteInventory.selectItem(id, el);
    return;
  }
}

// Mini-game: click challenge (DEPRECATED - DISABLED)
// Commented out to prevent ReferenceErrors
/*
  area.appendChild(d);
    setTimeout(()=>d.remove(),1500);
  }

  gameInterval = setInterval(()=>{
    if(time<=0){ 
      clearInterval(gameInterval); 
      clearInterval(interval); 
      flashMessage(`Game over! Final score: ${score}`); 
      gameActive = false;
      return; 
    }
    spawn();
  },700);

  interval = setInterval(()=>{ 
    time--; 
    timerEl.textContent=time; 
    if(time<=0){ 
      clearInterval(interval); 
    }
  },1000);
*/

// Magnifying glass functionality (hold L key on landing page)
let magnifyingGlass = null;
let lKeyPressed = false;

function createMagnifyingGlass(){
  if(!magnifyingGlass){
    magnifyingGlass = document.createElement('div');
    magnifyingGlass.className = 'magnifying-glass';
    document.body.appendChild(magnifyingGlass);
    document.getElementById('landing-page').classList.add('magnifying');
  }
}

function removeMagnifyingGlass(){
  if(magnifyingGlass){
    magnifyingGlass.remove();
    magnifyingGlass = null;
    document.getElementById('landing-page').classList.remove('magnifying');
  }
}

function updateMagnifyingGlassPosition(e){
  const landingPage = document.getElementById('landing-page');
  const isLandingActive = landingPage && landingPage.classList.contains('active');
  
  if(magnifyingGlass && isLandingActive){
    const glassSize = 120;
    const borderWidth = 4;
    const totalSize = glassSize + borderWidth * 2;
    const halfSize = totalSize / 2;
    
    // Position magnifying glass centered on cursor
    const glassLeft = e.clientX - halfSize;
    const glassTop = e.clientY - halfSize;
    magnifyingGlass.style.left = glassLeft + 'px';
    magnifyingGlass.style.top = glassTop + 'px';
    
    // Calculate background position to show 2x magnified area under cursor
    // The formula: move the 2x scaled background so the cursor point appears at glass center
    const bgX = -e.clientX * 2 + halfSize;
    const bgY = -e.clientY * 2 + halfSize;
    
    magnifyingGlass.style.backgroundSize = `${window.innerWidth * 2}px ${window.innerHeight * 2}px`;
    magnifyingGlass.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }
}

document.addEventListener('keydown', (e)=>{
  // Check if landing page is active
  const landingPage = document.getElementById('landing-page');
  const isLandingActive = landingPage && landingPage.classList.contains('active');
  
  if(e.key.toLowerCase() === 'l' && !lKeyPressed && isLandingActive){
    lKeyPressed = true;
    createMagnifyingGlass();
  }
});

document.addEventListener('keyup', (e)=>{
  if(e.key.toLowerCase() === 'l'){
    lKeyPressed = false;
    removeMagnifyingGlass();
  }
});

document.addEventListener('mousemove', updateMagnifyingGlassPosition);

// Initial setup - now handled by main.js
// Old auto-initialization removed - wait for main.js
console.log('📜 Legacy app.js loaded (passive mode)');