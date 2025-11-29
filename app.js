// Interactive profile MVP - Page-based navigation
const ALL_COLLECTIBLES = ['key', 'salamander', 'blanket', 'pasxa', 'wet-clothes', 'yellow-shorts', 'snail', 'sheep'];
const COLLECTIBLE_NAMES = {
  'key': '🔑 Key',
  'salamander': '🦎 Salamander',
  'blanket': '🛏️ Blanket',
  'pasxa': '🍰 Russian Pastry (Pasxa)',
  'wet-clothes': '👔💧 Wet Clothes',
  'yellow-shorts': '🩳🇧🇷 Yellow Shorts',
  'snail': '🐌 Snail',
  'sheep': '🐑 Sheep'
};

const state = {
  inventory: [],
  selectedItem: null,
  currentPage: 'landing-page',
};

const itemsEl = document.getElementById('items');
const uncollectedList = document.getElementById('uncollected-list');

// Page navigation
function navigateToPage(pageId){
  document.querySelectorAll('.page').forEach(p=> p.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if(targetPage){ 
    targetPage.classList.add('active');
    state.currentPage = pageId;
    // Initialize game for this page
    if(typeof initGamesForPage === 'function'){
      initGamesForPage(pageId);
    }
  }
}

// Arrow buttons and map hotspots
document.querySelectorAll('.arrow-btn, .back-btn, .map-hotspot').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = btn.dataset.target;
    navigateToPage(target);
  });
});

// Pickup objects
document.querySelectorAll('.object').forEach(o=>{
  o.addEventListener('click', ()=>{
    const id = o.dataset.id;
    if(state.inventory.includes(id)){
      flashMessage(`${id} already picked up.`);
      return;
    }
    state.inventory.push(id);
    renderInventory();
    o.style.opacity = '0.4';
    o.style.pointerEvents = 'none';
    flashMessage(`Picked up: ${id}`);
  });
});

function renderInventory(){
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
  if(!uncollectedList) return;
  const uncollected = ALL_COLLECTIBLES.filter(id => !state.inventory.includes(id));
  if(uncollected.length === 0){
    uncollectedList.innerHTML = '<span style="color:var(--pink);font-weight:600">✓ All collected!</span>';
  } else {
    uncollectedList.innerHTML = uncollected.map(id => `• ${COLLECTIBLE_NAMES[id]}`).join('<br>');
  }
}

function selectItem(id, el){
  // toggle selection
  if(state.selectedItem===id){ 
    state.selectedItem=null; 
    el.classList.remove('selected');
    return; 
  }
  state.selectedItem = id;
  Array.from(itemsEl.children).forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  flashMessage(`Selected ${id}.`);
}

// Flash messages (temporary)
function flashMessage(msg, timeout=1800){
  const el = document.createElement('div'); el.textContent = msg;
  el.style.position='fixed'; el.style.top='18px'; el.style.left='50%'; el.style.transform='translateX(-50%)';
  el.style.background='#111'; el.style.color='white'; el.style.padding='10px 16px'; 
  el.style.borderRadius='8px'; el.style.opacity='0.95'; el.style.zIndex=9999;
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), timeout);
}

// Mini-game: click challenge
let gameActive = false;
function startMinigame(){
  if(gameActive) return; // prevent duplicate games
  gameActive = true;
  const area = document.getElementById('game-area');
  const timerEl = document.getElementById('game-timer');
  const scoreEl = document.getElementById('game-score');
  let time = 10, score = 0, interval, gameInterval;

  // Clear any existing dots
  area.innerHTML = '';
  scoreEl.textContent = 'Score: 0';
  timerEl.textContent = '10';

  function spawn(){
    const d = document.createElement('div'); d.className='dot';
    const x = Math.random()*(area.clientWidth-50); 
    const y = Math.random()*(area.clientHeight-50);
    d.style.left = x+'px'; d.style.top = y+'px';
    d.addEventListener('click', ()=>{ 
      score++; 
      scoreEl.textContent = `Score: ${score}`; 
      d.remove(); 
    });
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
}

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
  if(magnifyingGlass && state.currentPage === 'landing-page'){
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
  if(e.key.toLowerCase() === 'l' && !lKeyPressed && state.currentPage === 'landing-page'){
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

// Initial message
setTimeout(()=> { 
  flashMessage('Welcome! Find all collectibles!'); 
  updateUncollectedList();
}, 500);
