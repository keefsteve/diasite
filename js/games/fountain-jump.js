// ============================================
// FOUNTAIN JUMP GAME
// Botanischer Garten - Zwischen Steinen springen
// ============================================

class FountainJumpGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      alert('Canvas not found!');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.keys = {};
    this.gameOver = false;
    this.won = false;
    
    // Player
    this.player = {
      x: 50,
      y: 0,
      width: 25,
      height: 35,
      dx: 0,
      dy: 0,
      speed: 4,
      jumpPower: 11,
      onGround: false,
    };
    
    // Physics
    this.gravity = 0.45;
    
    // Platforms (Steine)
    this.platforms = [
      { x: 0, y: 380, width: 120, height: 70 }, // Start
      { x: 180, y: 320, width: 100, height: 30 },
      { x: 340, y: 280, width: 90, height: 25 },
      { x: 500, y: 240, width: 100, height: 30 },
      { x: 660, y: 200, width: 140, height: 50 }, // Ziel
    ];
    
    // Goal (Wasserfall)
    this.goal = { x: 720, y: 180, width: 30, height: 70 };
    
    this.setupControls();
  }
  
  setupControls() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  update() {
    if (this.gameOver || this.won) return;
    
    // Bewegung
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.dx = -this.player.speed;
    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.dx = this.player.speed;
    } else {
      this.player.dx = 0;
    }
    
    // Springen
    if ((this.keys['Space'] || this.keys['ArrowUp']) && this.player.onGround) {
      this.player.dy = -this.player.jumpPower;
      this.player.onGround = false;
    }
    
    // Schwerkraft
    this.player.dy += this.gravity;
    
    // Position update
    this.player.x += this.player.dx;
    this.player.y += this.player.dy;
    
    // Kollision mit Plattformen
    this.player.onGround = false;
    this.platforms.forEach((pl) => {
      if (
        this.player.x < pl.x + pl.width &&
        this.player.x + this.player.width > pl.x &&
        this.player.y < pl.y + pl.height &&
        this.player.y + this.player.height > pl.y
      ) {
        if (this.player.dy > 0) {
          this.player.y = pl.y - this.player.height;
          this.player.dy = 0;
          this.player.onGround = true;
        }
      }
    });
    
    // Grenzen
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.width;
    }
    
    // Ins Wasser gefallen
    if (this.player.y > this.canvas.height) {
      this.gameOver = true;
      this.onLose && this.onLose();
      return;
    }
    
    // Ziel erreicht
    if (
      this.player.x < this.goal.x + this.goal.width &&
      this.player.x + this.player.width > this.goal.x &&
      this.player.y < this.goal.y + this.goal.height &&
      this.player.y + this.player.height > this.goal.y
    ) {
      this.won = true;
      this.onWin && this.onWin();
    }
  }
  
  draw() {
    // Clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Wasser Hintergrund
    this.ctx.fillStyle = '#5ba3d0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Steine (Plattformen)
    this.ctx.fillStyle = '#6b7280';
    this.platforms.forEach((pl) => {
      this.ctx.fillRect(pl.x, pl.y, pl.width, pl.height);
      // Stein-Details
      this.ctx.strokeStyle = '#4b5563';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(pl.x, pl.y, pl.width, pl.height);
    });
    
    // Wasserfall (Ziel)
    this.ctx.fillStyle = '#93c5fd';
    this.ctx.fillRect(this.goal.x, this.goal.y, this.goal.width, this.goal.height);
    this.ctx.fillStyle = '#60a5fa';
    for (let i = 0; i < 5; i++) {
      this.ctx.fillRect(this.goal.x + i * 6, this.goal.y, 3, this.goal.height);
    }
    
    // Player
    this.ctx.fillStyle = '#f87171';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    // Kopf
    this.ctx.fillStyle = '#fca5a5';
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.x + this.player.width / 2,
      this.player.y + 8,
      8,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }
  
  loop() {
    if (!this.gameOver && !this.won) {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.loop());
    }
  }
  
  start() {
    this.player.x = 50;
    this.player.y = 0;
    this.player.dx = 0;
    this.player.dy = 0;
    this.player.onGround = false;
    this.gameOver = false;
    this.won = false;
    this.loop();
  }
  
  destroy() {
    this.gameOver = true;
    this.won = false;
  }
}

// Export
window.FountainJumpGame = FountainJumpGame;
