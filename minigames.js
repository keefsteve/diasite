// ========== MINIGAME IMPLEMENTATIONS ==========

// 1. SNAIL WALL GAME (Tanke)
function initSnailWall(){
  const wall = document.getElementById('snail-wall');
  const caughtEl = document.getElementById('snails-caught');
  const totalEl = document.getElementById('snails-total');
  const timerEl = document.getElementById('snail-timer');
  
  if(!wall) return;
  
  const totalSnails = 42;
  let caught = 0;
  let startTime = Date.now();
  
  wall.innerHTML = '';
  wall.style.position = 'relative';
  // Removed size overrides - using CSS styles instead
  wall.style.backgroundImage = 'url("wall.jpeg")';
  wall.style.backgroundSize = 'cover';
  wall.style.backgroundPosition = 'center';
  
  totalEl.textContent = totalSnails;
  
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
      caught++;
      caughtEl.textContent = caught;
      snail.remove();
      if(caught === totalSnails){
        flashMessage(`All snails caught in ${Math.floor((Date.now()-startTime)/1000)}s!`);
      }
    });
    
    snail.addEventListener('mouseenter', ()=> snail.style.transform='scale(1.2)');
    snail.addEventListener('mouseleave', ()=> snail.style.transform='scale(1)');
    
    wall.appendChild(snail);
  }
  
  setInterval(()=>{
    timerEl.textContent = Math.floor((Date.now()-startTime)/1000);
  }, 100);
}

// 2. MEMORY CARD GAME (Home)
function initMemoryGame(){
  const grid = document.getElementById('memory-grid');
  const movesEl = document.getElementById('memory-moves');
  const timerEl = document.getElementById('memory-timer');
  
  if(!grid) return;
  
  const symbols = ['🎨','🎭','🎪','🎬','🎤','🎧','🎼','🎹'];
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let startTime = Date.now();
  
  grid.innerHTML = '';
  // Grid layout defined in CSS
  
  cards.forEach((symbol, idx)=>{
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.symbol = symbol;
    card.dataset.idx = idx;
    card.style.width = '85px';
    card.style.height = '85px';
    card.style.background = 'var(--pink)';
    card.style.borderRadius = '8px';
    card.style.cursor = 'pointer';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.fontSize = '2.2rem';
    card.style.transition = 'all 0.3s';
    card.textContent = '?';
    
    card.addEventListener('click', ()=>{
      if(flipped.length >= 2 || card.classList.contains('flipped')) return;
      
      card.textContent = symbol;
      card.style.background = '#fff';
      card.classList.add('flipped');
      flipped.push(card);
      
      if(flipped.length === 2){
        moves++;
        movesEl.textContent = moves;
        
        if(flipped[0].dataset.symbol === flipped[1].dataset.symbol){
          matched += 2;
          flipped.forEach(c => c.style.opacity = '0.5');
          flipped = [];
          if(matched === cards.length){
            setTimeout(()=> flashMessage(`Won in ${moves} moves and ${Math.floor((Date.now()-startTime)/1000)}s!`), 300);
          }
        } else {
          setTimeout(()=>{
            flipped.forEach(c => {
              c.textContent = '?';
              c.style.background = 'var(--pink)';
              c.classList.remove('flipped');
            });
            flipped = [];
          }, 1000);
        }
      }
    });
    
    grid.appendChild(card);
  });
  
  setInterval(()=>{
    timerEl.textContent = Math.floor((Date.now()-startTime)/1000);
  }, 100);
}

// 3. TYPING SPEED GAME (Barashki)
function initTypingGame(){
  const wordEl = document.getElementById('typing-word');
  const input = document.getElementById('typing-input');
  const scoreEl = document.getElementById('typing-score');
  const timerEl = document.getElementById('typing-timer');
  const feedback = document.getElementById('typing-feedback');
  
  if(!wordEl || !input) return;
  
  const words = ['salamander','blanket','pasxa','sheep','snail','fountain','memory','challenge','adventure','explore','discover','journey','treasure','mystery','puzzle','amazing'];
  let score = 0;
  let timeLeft = 30;
  let currentWord = '';
  
  function newWord(){
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordEl.textContent = currentWord;
    input.value = '';
    feedback.textContent = '';
  }
  
  input.addEventListener('input', ()=>{
    if(input.value === currentWord){
      score++;
      scoreEl.textContent = score;
      feedback.textContent = '✓ Correct!';
      feedback.style.color = 'green';
      setTimeout(newWord, 300);
    }
  });
  
  newWord();
  input.focus();
  
  const interval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft;
    if(timeLeft <= 0){
      clearInterval(interval);
      input.disabled = true;
      flashMessage(`Game over! You typed ${score} words!`);
    }
  }, 1000);
}

// 4. MAZE NAVIGATOR (Fountain)
function initMazeGame(){
  const canvas = document.getElementById('maze-canvas');
  const timerEl = document.getElementById('maze-timer');
  
  if(!canvas) return;
  
  // Size defined in CSS (450px × 350px)
  canvas.style.position = 'relative';
  canvas.innerHTML = '';
  
  // Grid sized to fit standardized canvas: 8 rows × 10 cols with 45px cells = 360px × 450px
  const cellSize = 45;
  const rows = 8, cols = 10;
  let playerPos = {x:0, y:0};
  let startTime = Date.now();
  
  // Simple maze walls (1 = wall, 0 = path)
  const maze = Array(rows).fill(0).map(() => Array(cols).fill(0));
  // Add some random walls
  for(let i=0; i<30; i++){
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if((r===0 && c===0) || (r===rows-1 && c===cols-1)) continue;
    maze[r][c] = 1;
  }
  
  // Render maze
  for(let r=0; r<rows; r++){
    for(let c=0; c<cols; c++){
      const cell = document.createElement('div');
      cell.style.position = 'absolute';
      cell.style.left = (c * cellSize) + 'px';
      cell.style.top = (r * cellSize) + 'px';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      cell.style.border = '1px solid #ddd';
      cell.style.background = maze[r][c] === 1 ? '#333' : '#fff';
      canvas.appendChild(cell);
    }
  }
  
  // Goal
  const goal = document.createElement('div');
  goal.textContent = '🏁';
  goal.style.position = 'absolute';
  goal.style.left = ((cols-1) * cellSize) + 'px';
  goal.style.top = ((rows-1) * cellSize) + 'px';
  goal.style.fontSize = '2rem';
  goal.style.width = cellSize + 'px';
  goal.style.height = cellSize + 'px';
  goal.style.display = 'flex';
  goal.style.alignItems = 'center';
  goal.style.justifyContent = 'center';
  canvas.appendChild(goal);
  
  // Player
  const player = document.createElement('div');
  player.textContent = '🏃';
  player.style.position = 'absolute';
  player.style.fontSize = '2rem';
  player.style.width = cellSize + 'px';
  player.style.height = cellSize + 'px';
  player.style.display = 'flex';
  player.style.alignItems = 'center';
  player.style.justifyContent = 'center';
  player.style.transition = 'all 0.2s';
  canvas.appendChild(player);
  
  function updatePlayerPos(){
    player.style.left = (playerPos.x * cellSize) + 'px';
    player.style.top = (playerPos.y * cellSize) + 'px';
    
    if(playerPos.x === cols-1 && playerPos.y === rows-1){
      flashMessage(`Maze completed in ${Math.floor((Date.now()-startTime)/1000)}s!`);
    }
  }
  
  updatePlayerPos();
  
  document.addEventListener('keydown', (e)=>{
    if(state.currentPage !== 'fountain') return;
    
    let newX = playerPos.x;
    let newY = playerPos.y;
    
    if(e.key === 'ArrowUp') newY--;
    if(e.key === 'ArrowDown') newY++;
    if(e.key === 'ArrowLeft') newX--;
    if(e.key === 'ArrowRight') newX++;
    
    if(newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] !== 1){
      playerPos.x = newX;
      playerPos.y = newY;
      updatePlayerPos();
    }
  });
  
  setInterval(()=>{
    timerEl.textContent = Math.floor((Date.now()-startTime)/1000);
  }, 100);
}

// 5. SIMON SAYS (Oma Opa Morg)
function initSimonGame(){
  const grid = document.getElementById('simon-grid');
  const levelEl = document.getElementById('simon-level');
  const messageEl = document.getElementById('simon-message');
  
  if(!grid) return;
  
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8dadc'];
  let sequence = [];
  let playerSeq = [];
  let level = 1;
  let canPlay = false;
  
  grid.innerHTML = '';
  colors.forEach((color, idx)=>{
    const btn = document.createElement('button');
    btn.style.width = '110px';
    btn.style.height = '110px';
    btn.style.background = color;
    btn.style.border = '3px solid #333';
    btn.style.borderRadius = '12px';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'all 0.2s';
    btn.dataset.idx = idx;
    
    btn.addEventListener('click', ()=>{
      if(!canPlay) return;
      btn.style.opacity = '0.5';
      setTimeout(()=> btn.style.opacity = '1', 200);
      
      playerSeq.push(idx);
      
      if(playerSeq[playerSeq.length-1] !== sequence[playerSeq.length-1]){
        messageEl.textContent = 'Wrong! Starting over...';
        messageEl.style.color = 'red';
        setTimeout(resetGame, 1500);
        return;
      }
      
      if(playerSeq.length === sequence.length){
        level++;
        levelEl.textContent = level;
        messageEl.textContent = 'Correct! Next level...';
        messageEl.style.color = 'green';
        setTimeout(nextRound, 1000);
      }
    });
    
    grid.appendChild(btn);
  });
  
  function playSequence(){
    canPlay = false;
    messageEl.textContent = 'Watch carefully...';
    messageEl.style.color = '#333';
    
    sequence.forEach((idx, i)=>{
      setTimeout(()=>{
        const btn = grid.children[idx];
        btn.style.opacity = '0.5';
        setTimeout(()=> btn.style.opacity = '1', 400);
        
        if(i === sequence.length - 1){
          setTimeout(()=>{
            canPlay = true;
            messageEl.textContent = 'Your turn!';
          }, 500);
        }
      }, i * 700);
    });
  }
  
  function nextRound(){
    playerSeq = [];
    sequence.push(Math.floor(Math.random() * 4));
    playSequence();
  }
  
  function resetGame(){
    sequence = [];
    level = 1;
    levelEl.textContent = level;
    nextRound();
  }
  
  nextRound();
}

// 6. PATTERN LOCK (Oma Opa Shnol)
function initPatternGame(){
  const displayEl = document.getElementById('pattern-display');
  const grid = document.getElementById('pattern-grid');
  const checkBtn = document.getElementById('pattern-check');
  const attemptsEl = document.getElementById('pattern-attempts');
  
  if(!grid || !checkBtn) return;
  
  const patternLength = 4;
  let correctPattern = [];
  let userPattern = [];
  let attempts = 3;
  
  // Generate random pattern
  for(let i=0; i<patternLength; i++){
    correctPattern.push(Math.floor(Math.random() * 9));
  }
  
  // Show pattern briefly
  displayEl.textContent = 'Memorize: ' + correctPattern.map(n => '●').join(' ');
  displayEl.style.fontSize = '1.5rem';
  displayEl.style.color = 'var(--pink)';
  
  setTimeout(()=>{
    displayEl.textContent = correctPattern.join(' - ');
  }, 500);
  
  setTimeout(()=>{
    displayEl.textContent = 'Now draw the pattern!';
  }, 3000);
  
  // Create grid
  grid.innerHTML = '';
  for(let i=0; i<9; i++){
    const dot = document.createElement('button');
    dot.textContent = i;
    dot.style.width = '75px';
    dot.style.height = '75px';
    dot.style.background = '#fff';
    dot.style.border = '3px solid var(--pink)';
    dot.style.borderRadius = '50%';
    dot.style.fontSize = '1.4rem';
    dot.style.cursor = 'pointer';
    dot.style.transition = 'all 0.2s';
    
    dot.addEventListener('click', ()=>{
      if(userPattern.includes(i)) return;
      userPattern.push(i);
      dot.style.background = 'var(--pink)';
      dot.style.color = 'white';
    });
    
    grid.appendChild(dot);
  }
  
  checkBtn.addEventListener('click', ()=>{
    if(JSON.stringify(userPattern) === JSON.stringify(correctPattern)){
      flashMessage('Pattern unlocked! 🎉');
      displayEl.textContent = 'Success!';
      displayEl.style.color = 'green';
    } else {
      attempts--;
      attemptsEl.textContent = attempts;
      if(attempts <= 0){
        flashMessage('Failed! The pattern was: ' + correctPattern.join('-'));
        checkBtn.disabled = true;
      } else {
        displayEl.textContent = `Wrong! ${attempts} attempts left. Try again.`;
        displayEl.style.color = 'red';
        userPattern = [];
        grid.querySelectorAll('button').forEach(btn => {
          btn.style.background = '#fff';
          btn.style.color = '#000';
        });
      }
    }
  });
}

// 7. MATH LIGHTNING (Hustadt Dub)
function initMathGame(){
  const problemEl = document.getElementById('math-problem');
  const optionsEl = document.getElementById('math-options');
  const scoreEl = document.getElementById('math-score');
  const timerEl = document.getElementById('math-timer');
  
  if(!problemEl || !optionsEl) return;
  
  let score = 0;
  let timeLeft = 60;
  
  function newProblem(){
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let correct;
    if(op === '+') correct = a + b;
    else if(op === '-') correct = a - b;
    else correct = a * b;
    
    problemEl.textContent = `${a} ${op} ${b} = ?`;
    
    const options = [correct];
    while(options.length < 4){
      const wrong = correct + Math.floor(Math.random() * 20) - 10;
      if(!options.includes(wrong) && wrong >= 0) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    
    optionsEl.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.style.padding = '15px 25px';
      btn.style.fontSize = '1.3rem';
      btn.style.background = '#fff';
      btn.style.border = '3px solid var(--pink)';
      btn.style.borderRadius = '8px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.2s';
      
      btn.addEventListener('click', ()=>{
        if(opt === correct){
          score++;
          scoreEl.textContent = score;
          btn.style.background = 'green';
          btn.style.color = 'white';
          setTimeout(newProblem, 300);
        } else {
          btn.style.background = 'red';
          btn.style.color = 'white';
        }
      });
      
      optionsEl.appendChild(btn);
    });
  }
  
  newProblem();
  
  const interval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft;
    if(timeLeft <= 0){
      clearInterval(interval);
      flashMessage(`Game over! Final score: ${score}`);
      optionsEl.innerHTML = '<p style="color:var(--pink);font-weight:700">Time\'s up!</p>';
    }
  }, 1000);
}

// Initialize games based on current page
function initGamesForPage(pageId){
  setTimeout(()=>{
    if(pageId === 'home') initMemoryGame();
    else if(pageId === 'tanke') initSnailWall();
    else if(pageId === 'barashki') initTypingGame();
    else if(pageId === 'fountain') initMazeGame();
    else if(pageId === 'oma-opa-morg') initSimonGame();
    else if(pageId === 'oma-opa-shnol') initPatternGame();
    else if(pageId === 'hustadt-dub') initMathGame();
    else if(pageId === 'krivaya') startMinigame();
  }, 100);
}
