// ============================================
// SEASONAL EFFECTS SYSTEM
// Minimalistic 90s-style environmental particles
// ============================================

class SeasonalSystem {
  constructor() {
    this.currentSeason = null;
    this.particleContainer = null;
    this.isActive = false;
    
    // Outdoor locations where seasonal effects appear
    this.outdoorLocations = [
      'landing-page',
      'botanical-garden', 
      'snails',  // uni-center
      'krivaya'
    ];
    
    // Particle configurations per season
    this.seasonConfig = {
      winter: {
        emojis: ['*', '·', '❅'],
        count: 24,
        animationName: 'snowfall',
        duration: '10s'
      },
      spring: {
        emojis: ['~', "'", '.'],
        count: 75,
        animationName: 'windblown',
        duration: '15s'
      },
      summer: {
        emojis: ['+', '×', '°'],
        count: 168,
        animationName: 'sparkle',
        duration: '8s'
      },
      autumn: {
        emojis: ['^', 'v', '/'],
        count: 28,
        animationName: 'leaffall',
        duration: '11s'
      }
    };
  }
  
  init() {
    this.detectSeason();
    this.createParticleContainer();
    this.injectAnimationStyles();
    this.observeLocationChanges();
    
    console.log(`✅ Seasonal system initialized (${this.currentSeason})`);
  }
  
  // Detect current season based on date
  detectSeason() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    if (month >= 2 && month <= 4) {
      this.currentSeason = 'spring'; // Mar-May
    } else if (month >= 5 && month <= 7) {
      this.currentSeason = 'summer'; // Jun-Aug
    } else if (month >= 8 && month <= 10) {
      this.currentSeason = 'autumn'; // Sep-Nov
    } else {
      this.currentSeason = 'winter'; // Dec-Feb
    }
  }
  
  // Create particle container
  createParticleContainer() {
    this.particleContainer = document.createElement('div');
    this.particleContainer.id = 'seasonal-particles';
    this.particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      opacity: 0;
      transition: opacity 1s ease;
    `;
    document.body.appendChild(this.particleContainer);
  }
  
  // Inject CSS animations for particles
  injectAnimationStyles() {
    if (document.getElementById('seasonal-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'seasonal-animations';
    style.textContent = `
      @keyframes snowfall {
        0% {
          transform: translateY(-20px) translateX(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) translateX(30px) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes windblown {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0;
        }
        5% {
          opacity: 1;
        }
        20% {
          transform: translate(120px, -80px) rotate(45deg);
        }
        40% {
          transform: translate(80px, -120px) rotate(-30deg);
        }
        60% {
          transform: translate(180px, -180px) rotate(60deg);
        }
        80% {
          transform: translate(100px, -240px) rotate(-45deg);
        }
        95% {
          opacity: 1;
        }
        100% {
          transform: translate(250px, -300px) rotate(90deg);
          opacity: 0;
        }
      }
      
      @keyframes leaffall {
        0% {
          transform: translateY(-20px) translateX(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          transform: translateY(50vh) translateX(20px) rotate(180deg);
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) translateX(-30px) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes sparkle {
        0% {
          transform: scale(0) translateY(0);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        50% {
          transform: scale(1) translateY(30px);
          opacity: 0.8;
        }
        100% {
          transform: scale(0) translateY(60px);
          opacity: 0;
        }
      }
      
      .seasonal-particle {
        position: absolute;
        font-size: 1.2rem;
        user-select: none;
        image-rendering: pixelated;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create particles
  spawnParticles() {
    if (!this.particleContainer) return;
    
    const config = this.seasonConfig[this.currentSeason];
    if (!config) return;
    
    // Clear existing particles
    this.particleContainer.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < config.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'seasonal-particle';

      // Randomly select emoji from the season's emoji array
      const randomEmoji = config.emojis[Math.floor(Math.random() * config.emojis.length)];
      particle.textContent = randomEmoji;

      let left, top;

      // Special positioning for summer (cone from top-left)
      if (this.currentSeason === 'summer') {
        // Cone shape: concentrated top-left, spreading to 75% width
        const coneProgress = Math.random(); // 0 to 1
        const maxWidth = 75; // 75% of screen width
        left = coneProgress * maxWidth * Math.random(); // Random within expanding cone
        top = Math.random() * 40; // Top 40% of screen
      } else if (this.currentSeason === 'spring') {
        // Spring: start from bottom, blow upward
        left = Math.random() * 100;
        top = window.innerHeight + 20; // Start below screen
      } else {
        // Default: random horizontal position, start from top
        left = Math.random() * 100;
        top = -20;
      }
      
      const delay = Math.random() * parseInt(config.duration);
      const duration = parseInt(config.duration) + (Math.random() * 3 - 1.5); // ±1.5s variation
      
      particle.style.cssText = `
        left: ${left}%;
        top: ${top}px;
        animation: ${config.animationName} ${duration}s linear ${delay}s infinite;
      `;
      
      this.particleContainer.appendChild(particle);
    }
  }
  
  // Check if current location is outdoor
  isOutdoorLocation() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return false;
    
    const pageId = activePage.id;
    return this.outdoorLocations.includes(pageId);
  }
  
  // Activate/deactivate based on location
  checkAndUpdate() {
    const shouldBeActive = this.isOutdoorLocation();
    
    if (shouldBeActive) {
      // Re-spawn particles even if already active (for season changes)
      this.activate();
    } else if (!shouldBeActive && this.isActive) {
      this.deactivate();
    }
  }
  
  activate() {
    if (!this.particleContainer) return;
    
    this.spawnParticles();
    this.particleContainer.style.opacity = '0.6';
    this.isActive = true;
    
    console.log(`🌨️ Seasonal effects activated (${this.currentSeason})`);
  }
  
  deactivate() {
    if (!this.particleContainer) return;
    
    this.particleContainer.style.opacity = '0';
    this.isActive = false;
    
    console.log(`🌨️ Seasonal effects deactivated`);
  }
  
  // Observe page changes
  observeLocationChanges() {
    // Initial check
    setTimeout(() => this.checkAndUpdate(), 500);
    
    // Watch for page changes
    const observer = new MutationObserver(() => {
      this.checkAndUpdate();
    });
    
    // Observe all pages for 'active' class changes
    document.querySelectorAll('.page').forEach(page => {
      observer.observe(page, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
    
    // Also listen for custom navigation events
    window.addEventListener('pageChanged', () => {
      this.checkAndUpdate();
    });
  }
}

// Initialize and export
export const Seasonal = new SeasonalSystem();

// Expose globally for seasonal controls
window.Seasonal = Seasonal;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Seasonal.init());
} else {
  Seasonal.init();
}
