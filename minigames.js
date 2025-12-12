// ========== MINIGAME IMPLEMENTATIONS ==========

// 1. SNAIL WALL GAME (Tanke) - 30 Second Countdown
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

// 2. WALL SMASHING GAME (Home)
function initWallSmashGame(){
  const container = document.getElementById('wall-container');
  const hitsEl = document.getElementById('wall-hits');
  
  if(!container) return;
  
  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.width = '100%';
  container.style.height = '400px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.cursor = 'pointer';
  container.style.userSelect = 'none';
  
  let hits = 0;
  let wallState = 0; // 0: intact, 1: cracked, 2: crumbling, 3: broken
  
  const wall = document.createElement('div');
  wall.style.width = '300px';
  wall.style.height = '300px';
  wall.style.background = '#8b4513';
  wall.style.border = '5px solid #654321';
  wall.style.borderRadius = '8px';
  wall.style.display = 'flex';
  wall.style.alignItems = 'center';
  wall.style.justifyContent = 'center';
  wall.style.fontSize = '4rem';
  wall.style.transition = 'all 0.3s';
  wall.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.3)';
  wall.textContent = '🧱';
  
  const hand = document.createElement('div');
  hand.textContent = '✊';
  hand.style.fontSize = '3rem';
  hand.style.position = 'absolute';
  hand.style.opacity = '0';
  hand.style.transition = 'all 0.2s';
  
  container.appendChild(wall);
  container.appendChild(hand);
  
  function updateWall(){
    hitsEl.textContent = hits;
    
    if(hits >= 30 && wallState === 0){
      wallState = 1;
      wall.style.background = 'linear-gradient(135deg, #8b4513 0%, #6b3410 50%, #8b4513 100%)';
      wall.textContent = '🧱💥';
      flashMessage('The wall is starting to crack!');
    }
    
    if(hits >= 50 && wallState === 1){
      wallState = 2;
      wall.style.background = 'linear-gradient(135deg, #6b3410 0%, #4b2408 50%, #6b3410 100%)';
      wall.style.transform = 'rotate(2deg)';
      wall.textContent = '🧱💥💥';
      flashMessage('The wall is crumbling!');
    }
    
    if(hits >= 60){
      wallState = 3;
      wall.style.background = '#333';
      wall.style.opacity = '0.3';
      wall.textContent = '💥✨🎉';
      wall.style.transform = 'scale(0.8) rotate(5deg)';
      setTimeout(()=>{
        flashMessage('You broke through the wall! 🎉');
        if(typeof gameManager !== 'undefined') gameManager.markWon('home');
      }, 500);
    }
  }
  
  container.addEventListener('click', (e)=>{
    if(hits >= 60) return;
    
    hits++;
    updateWall();
    
    // Animate hand
    hand.style.left = (e.offsetX - 30) + 'px';
    hand.style.top = (e.offsetY - 30) + 'px';
    hand.style.opacity = '1';
    hand.style.transform = 'scale(1.5) rotate(-20deg)';
    
    setTimeout(()=>{
      hand.style.opacity = '0';
      hand.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
    
    // Shake wall
    wall.style.transform = `translateX(${Math.random() * 10 - 5}px) rotate(${Math.random() * 4 - 2}deg)`;
    setTimeout(()=>{
      if(wallState < 2) wall.style.transform = 'translateX(0) rotate(0)';
    }, 100);
  });
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
      if(score >= 10){
        flashMessage(`You won! You typed ${score} words!`);
        if(typeof gameManager !== 'undefined') gameManager.markWon('bunker');
      } else {
        flashMessage(`Game over! You typed ${score} words. Need 10+ to win.`);
        if(typeof gameManager !== 'undefined') gameManager.markLost('bunker');
      }
    }
  }, 1000);
}

// 4. MAZE NAVIGATOR (Fountain)
function initMazeGame(){
  const canvas = document.getElementById('maze-canvas');
  const timerEl = document.getElementById('maze-timer');
  
  if(!canvas) return;
  
  canvas.style.width = '500px';
  canvas.style.height = '500px';
  canvas.style.border = '3px solid var(--pink)';
  canvas.style.borderRadius = '8px';
  canvas.style.margin = '20px auto';
  canvas.style.position = 'relative';
  canvas.style.background = '#fff';
  canvas.innerHTML = '';
  
  const cellSize = 50;
  const rows = 10, cols = 10;
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
      if(typeof gameManager !== 'undefined') gameManager.markWon('fountain');
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
    btn.style.width = '120px';
    btn.style.height = '120px';
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
        messageEl.textContent = 'Wrong! Game over.';
        messageEl.style.color = 'red';
        canPlay = false;
        if(typeof gameManager !== 'undefined') gameManager.markLost('oma-opa-morg');
        return;
      }
      
      if(playerSeq.length === sequence.length){
        if(level >= 5){
          messageEl.textContent = 'You won! Level 5 reached!';
          messageEl.style.color = 'green';
          canPlay = false;
          if(typeof gameManager !== 'undefined') gameManager.markWon('oma-opa-morg');
          return;
        }
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
    dot.style.width = '80px';
    dot.style.height = '80px';
    dot.style.background = '#fff';
    dot.style.border = '3px solid var(--pink)';
    dot.style.borderRadius = '50%';
    dot.style.fontSize = '1.5rem';
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
      checkBtn.disabled = true;
      if(typeof gameManager !== 'undefined') gameManager.markWon('oma-opa-shnol');
    } else {
      attempts--;
      attemptsEl.textContent = attempts;
      if(attempts <= 0){
        flashMessage('Failed! The pattern was: ' + correctPattern.join('-'));
        checkBtn.disabled = true;
        if(typeof gameManager !== 'undefined') gameManager.markLost('oma-opa-shnol');
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
      optionsEl.innerHTML = '<p style="color:var(--pink);font-weight:700">Time\'s up!</p>';
      if(score >= 15){
        flashMessage(`You won! Final score: ${score}`);
        if(typeof gameManager !== 'undefined') gameManager.markWon('hustadt-dub');
      } else {
        flashMessage(`Game over! Score: ${score}. Need 15+ to win.`);
        if(typeof gameManager !== 'undefined') gameManager.markLost('hustadt-dub');
      }
    }
  }, 1000);
}

// 8. ZIP LINE RESCUE (Krivaya)
function initZipLineGame(){
  const area = document.getElementById('zipline-area');
  const scoreEl = document.getElementById('zipline-score');
  const timerEl = document.getElementById('zipline-timer');
  
  if(!area) return;
  
  area.innerHTML = '';
  area.style.position = 'relative';
  area.style.width = '100%';
  area.style.height = '400px';
  area.style.background = 'linear-gradient(180deg, #87ceeb 0%, #e0f6ff 100%)';
  area.style.border = '3px solid var(--pink)';
  area.style.borderRadius = '12px';
  area.style.overflow = 'hidden';
  
  let score = 0;
  let timeLeft = 30;
  const platforms = [
    { x: 10, y: 50, side: 'left' },
    { x: 70, y: 50, side: 'right' },
    { x: 10, y: 150, side: 'left' },
    { x: 70, y: 150, side: 'right' },
    { x: 10, y: 250, side: 'left' },
    { x: 70, y: 250, side: 'right' }
  ];
  
  // Draw zip lines
  platforms.forEach((p, i) => {
    if(i < platforms.length - 1 && p.side !== platforms[i+1].side){
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.left = p.x + '%';
      line.style.top = p.y + 'px';
      line.style.width = Math.abs(platforms[i+1].x - p.x) + '%';
      line.style.height = '2px';
      line.style.background = '#333';
      line.style.transformOrigin = 'left';
      const angle = Math.atan2(platforms[i+1].y - p.y, (platforms[i+1].x - p.x) * 4);
      line.style.transform = `rotate(${angle}rad)`;
      area.appendChild(line);
    }
  });
  
  // Spawn people
  function spawnPerson(){
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const person = document.createElement('div');
    person.textContent = '🧍';
    person.style.position = 'absolute';
    person.style.left = platform.x + '%';
    person.style.top = platform.y + 'px';
    person.style.fontSize = '2rem';
    person.style.cursor = 'pointer';
    person.style.transition = 'all 0.8s ease-in-out';
    person.dataset.platformIndex = platforms.indexOf(platform);
    
    person.addEventListener('click', ()=>{
      const currentIndex = parseInt(person.dataset.platformIndex);
      let targetIndex = currentIndex === platforms.length - 1 ? 0 : currentIndex + 1;
      
      // Find opposite side platform
      const currentPlatform = platforms[currentIndex];
      for(let i = currentIndex + 1; i < platforms.length; i++){
        if(platforms[i].side !== currentPlatform.side){
          targetIndex = i;
          break;
        }
      }
      
      const target = platforms[targetIndex];
      person.style.left = target.x + '%';
      person.style.top = target.y + 'px';
      person.dataset.platformIndex = targetIndex;
      
      // Check if reached safe side (right)
      if(target.side === 'right'){
        score++;
        scoreEl.textContent = score;
        setTimeout(()=> person.remove(), 800);
      }
    });
    
    area.appendChild(person);
  }
  
  const spawnInterval = setInterval(spawnPerson, 2000);
  spawnPerson();
  
  const gameInterval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft;
    if(timeLeft <= 0){
      clearInterval(gameInterval);
      clearInterval(spawnInterval);
      if(score >= 8){
        flashMessage(`You won! Rescued ${score} people!`);
        if(typeof gameManager !== 'undefined') gameManager.markWon('krivaya');
      } else {
        flashMessage(`Game over! Rescued ${score}. Need 8+ to win.`);
        if(typeof gameManager !== 'undefined') gameManager.markLost('krivaya');
      }
    }
  }, 1000);
}

// 9. CURVED SLIDE RACE (Tanke)
function initSlideGame(){
  const area = document.getElementById('slide-area');
  const scoreEl = document.getElementById('slide-score');
  const livesEl = document.getElementById('slide-lives');
  
  if(!area) return;
  
  area.innerHTML = '';
  area.style.position = 'relative';
  area.style.width = '100%';
  area.style.height = '500px';
  area.style.background = 'linear-gradient(180deg, #d4af37 0%, #ffd700 50%, #d4af37 100%)';
  area.style.border = '3px solid var(--pink)';
  area.style.borderRadius = '12px';
  area.style.overflow = 'hidden';
  
  let score = 0;
  let lives = 3;
  let speed = 3;
  let playerX = 50;
  
  const player = document.createElement('div');
  player.textContent = '🛷';
  player.style.position = 'absolute';
  player.style.left = playerX + '%';
  player.style.top = '20px';
  player.style.fontSize = '2.5rem';
  player.style.transition = 'left 0.1s';
  area.appendChild(player);
  
  const obstacles = [];
  
  function spawnObstacle(){
    const obstacle = document.createElement('div');
    obstacle.textContent = ['🪨', '🌲', '⚠️'][Math.floor(Math.random() * 3)];
    obstacle.style.position = 'absolute';
    obstacle.style.left = (Math.random() * 80 + 10) + '%';
    obstacle.style.top = '0px';
    obstacle.style.fontSize = '2rem';
    obstacle.dataset.y = 0;
    area.appendChild(obstacle);
    obstacles.push(obstacle);
  }
  
  // Player controls
  document.addEventListener('keydown', (e)=>{
    if(state.currentPage !== 'tanke') return;
    if(e.key === 'ArrowLeft') playerX = Math.max(5, playerX - 8);
    if(e.key === 'ArrowRight') playerX = Math.min(85, playerX + 8);
    player.style.left = playerX + '%';
  });
  
  const spawnInterval = setInterval(spawnObstacle, 1500);
  
  const gameLoop = setInterval(()=>{
    obstacles.forEach((obs, idx)=>{
      const y = parseFloat(obs.dataset.y) + speed;
      obs.dataset.y = y;
      obs.style.top = y + 'px';
      
      // Check collision
      const obsX = parseFloat(obs.style.left);
      const obsY = y;
      if(obsY > 10 && obsY < 60 && Math.abs(obsX - playerX) < 8){
        lives--;
        livesEl.textContent = lives;
        obs.remove();
        obstacles.splice(idx, 1);
        
        if(lives <= 0){
          clearInterval(gameLoop);
          clearInterval(spawnInterval);
          if(score >= 30){
            flashMessage(`You won! Score: ${score}`);
            if(typeof gameManager !== 'undefined') gameManager.markWon('tanke');
          } else {
            flashMessage(`Game over! Score: ${score}. Need 30+ to win.`);
            if(typeof gameManager !== 'undefined') gameManager.markLost('tanke');
          }
        }
      }
      
      // Remove off-screen
      if(y > 500){
        score++;
        scoreEl.textContent = score;
        obs.remove();
        obstacles.splice(idx, 1);
        speed = Math.min(6, 3 + score * 0.05);
      }
    });
  }, 50);
}

// Initialize games based on current page
function initGamesForPage(pageId){
  setTimeout(()=>{
    if(pageId === 'home') initWallSmashGame();
    else if(pageId === 'snails') initSnailWall();
    else if(pageId === 'bunker') initTypingGame();
    else if(pageId === 'fountain') initMazeGame();
    else if(pageId === 'oma-opa-morg') initSimonGame();
    else if(pageId === 'oma-opa-shnol') initPatternGame();
    else if(pageId === 'hustadt-dub') initMathGame();
    else if(pageId === 'krivaya') initZipLineGame();
    else if(pageId === 'tanke') initSlideGame();
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

  // Add bouncing animation
  console.log('✅ Found Jen sprite, adding bounce');
  jenSprite.style.animation = 'steveBounce 2s ease-in-out infinite';

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

// Fade out animation for speech bubbles
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
  @keyframes speechBubbleFadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;
document.head.appendChild(fadeOutStyle);
