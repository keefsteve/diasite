// ============================================
// Personal Website Interactive Features
// ============================================

// Inventory system for collectibles
let inventory = [];
const maxItems = 5;

// ============================================
// COLLECTIBLE OBJECTS SYSTEM
// ============================================
document.querySelectorAll('.collectible').forEach(item => {
    item.addEventListener('click', function() {
        const itemType = this.dataset.item;
        
        if (!inventory.includes(itemType)) {
            // Add to inventory
            inventory.push(itemType);
            
            // Animate collection
            this.classList.add('collected');
            
            // Update inventory display
            updateInventoryDisplay();
            
            // Remove from DOM after animation
            setTimeout(() => {
                this.style.display = 'none';
            }, 500);
            
            // Show message
            showMessage(`You collected a ${itemType}! ✨`, getItemEmoji(itemType));
            
            // Check if all items collected
            if (inventory.length === maxItems) {
                setTimeout(() => {
                    showMessage("🎊 Congratulations! You collected all 5 items!\n\nSecret Message: 'You are amazing and capable of great things!' 💖", "🏆");
                }, 1500);
            }
        }
    });
});

function getItemEmoji(item) {
    const emojis = {
        'star': '⭐',
        'heart': '❤️',
        'gem': '💎',
        'flower': '🌸',
        'moon': '🌙'
    };
    return emojis[item] || '✨';
}

function updateInventoryDisplay() {
    const inventoryItems = document.getElementById('inventory-items');
    const inventoryCount = document.getElementById('inventory-count');
    
    inventoryItems.innerHTML = inventory.map(item => getItemEmoji(item)).join(' ');
    inventoryCount.textContent = `Items: ${inventory.length}/${maxItems}`;
}

// ============================================
// MESSAGE BOX SYSTEM
// ============================================
function showMessage(text, icon = '🎉') {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const messageIcon = messageBox.querySelector('.message-icon');
    
    messageText.textContent = text;
    messageIcon.textContent = icon;
    messageBox.classList.add('active');
}

function closeMessageBox() {
    document.getElementById('message-box').classList.remove('active');
}

// ============================================
// MODAL SYSTEM
// ============================================
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// ============================================
// CLICK AWAY GAME
// ============================================
let clickScore = 0;
let clickTimer = 30;
let clickGameInterval;
let bubbleInterval;

function startClickAwayGame() {
    document.getElementById('click-away-modal').classList.add('active');
    resetClickGame();
}

function resetClickGame() {
    clickScore = 0;
    clickTimer = 30;
    document.getElementById('click-score').textContent = 'Score: 0';
    document.getElementById('click-timer').textContent = 'Time: 30s';
    document.getElementById('click-away-area').innerHTML = '<p>Click "Start" to begin!</p>';
    document.getElementById('start-click-game').style.display = 'block';
}

function beginClickAway() {
    const area = document.getElementById('click-away-area');
    area.innerHTML = '';
    document.getElementById('start-click-game').style.display = 'none';
    
    // Start timer
    clickGameInterval = setInterval(() => {
        clickTimer--;
        document.getElementById('click-timer').textContent = `Time: ${clickTimer}s`;
        
        if (clickTimer <= 0) {
            endClickGame();
        }
    }, 1000);
    
    // Spawn bubbles
    bubbleInterval = setInterval(spawnBubble, 800);
    spawnBubble(); // Spawn first bubble immediately
}

function spawnBubble() {
    const area = document.getElementById('click-away-area');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const emojis = ['😊', '⭐', '💫', '🌟', '✨', '💖', '🎈', '🎯'];
    bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    const maxX = area.offsetWidth - 50;
    const maxY = area.offsetHeight - 50;
    
    bubble.style.left = Math.random() * maxX + 'px';
    bubble.style.top = Math.random() * maxY + 'px';
    
    bubble.addEventListener('click', function() {
        clickScore += 10;
        document.getElementById('click-score').textContent = `Score: ${clickScore}`;
        this.remove();
    });
    
    area.appendChild(bubble);
    
    // Remove bubble after 2 seconds if not clicked
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 2000);
}

function endClickGame() {
    clearInterval(clickGameInterval);
    clearInterval(bubbleInterval);
    
    const area = document.getElementById('click-away-area');
    area.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <p style="font-size: 1.5rem; margin-bottom: 10px;">🎮 Game Over!</p>
            <p style="font-size: 2rem; color: #667eea; font-weight: bold;">Final Score: ${clickScore}</p>
            <p style="margin-top: 10px;">${getScoreMessage(clickScore)}</p>
        </div>
    `;
    document.getElementById('start-click-game').textContent = 'Play Again';
    document.getElementById('start-click-game').style.display = 'block';
}

function getScoreMessage(score) {
    if (score >= 200) return "🏆 Amazing! You're a bubble master!";
    if (score >= 150) return "🌟 Great job! Super fast clicking!";
    if (score >= 100) return "👍 Nice work! Keep practicing!";
    if (score >= 50) return "💪 Good effort! Try again for a higher score!";
    return "🎯 Keep trying! You'll get better!";
}

// ============================================
// PICTURE PICKER GAME
// ============================================
const pictureQuestions = [
    {
        question: "Something that shines in the night sky",
        options: ['🌙', '🌲', '🌊', '🏠'],
        correct: 0
    },
    {
        question: "An animal that says 'meow'",
        options: ['🐕', '🐱', '🐘', '🐧'],
        correct: 1
    },
    {
        question: "Something you drink in the morning",
        options: ['🍕', '🎸', '☕', '📱'],
        correct: 2
    },
    {
        question: "A place where you read books",
        options: ['🏖️', '🎢', '🏪', '📚'],
        correct: 3
    },
    {
        question: "Something used to travel on water",
        options: ['⛵', '✈️', '🚗', '🚲'],
        correct: 0
    }
];

let currentPictureQuestion = 0;

function startPictureGame() {
    currentPictureQuestion = 0;
    document.getElementById('picture-modal').classList.add('active');
    showPictureQuestion();
}

function showPictureQuestion() {
    const question = pictureQuestions[currentPictureQuestion];
    document.getElementById('picture-target').textContent = question.question;
    document.getElementById('picture-feedback').textContent = '';
    
    const grid = document.getElementById('picture-grid');
    grid.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'picture-option';
        div.textContent = option;
        div.addEventListener('click', () => checkPictureAnswer(index, div));
        grid.appendChild(div);
    });
}

function checkPictureAnswer(selectedIndex, element) {
    const question = pictureQuestions[currentPictureQuestion];
    const feedback = document.getElementById('picture-feedback');
    const options = document.querySelectorAll('.picture-option');
    
    // Disable all options
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selectedIndex === question.correct) {
        element.classList.add('correct');
        feedback.textContent = '✅ Correct! Great job!';
        feedback.style.color = '#4CAF50';
    } else {
        element.classList.add('wrong');
        options[question.correct].classList.add('correct');
        feedback.textContent = '❌ Not quite! The correct answer is shown in green.';
        feedback.style.color = '#f44336';
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentPictureQuestion++;
        if (currentPictureQuestion < pictureQuestions.length) {
            showPictureQuestion();
        } else {
            feedback.textContent = '🎉 You completed all picture puzzles!';
            feedback.style.color = '#667eea';
            document.getElementById('picture-grid').innerHTML = `
                <div style="grid-column: span 2; padding: 30px;">
                    <p style="font-size: 3rem;">🏆</p>
                    <p style="font-size: 1.2rem; margin-top: 15px;">Well done! Play again to test your skills!</p>
                </div>
            `;
        }
    }, 1500);
}

// ============================================
// RIDDLE GAME
// ============================================
const riddles = [
    {
        question: "I have hands but can't clap. What am I?",
        answer: "clock"
    },
    {
        question: "What has keys but no locks?",
        answer: "piano"
    },
    {
        question: "What has a head and a tail but no body?",
        answer: "coin"
    },
    {
        question: "What gets wetter the more it dries?",
        answer: "towel"
    },
    {
        question: "What can you catch but not throw?",
        answer: "cold"
    }
];

let currentRiddle = 0;
let riddleScore = 0;

function startRiddleGame() {
    currentRiddle = 0;
    riddleScore = 0;
    document.getElementById('riddle-modal').classList.add('active');
    showRiddle();
}

function showRiddle() {
    const riddle = riddles[currentRiddle];
    document.getElementById('riddle-text').textContent = riddle.question;
    document.getElementById('riddle-answer').value = '';
    document.getElementById('riddle-feedback').textContent = '';
    document.getElementById('next-riddle-btn').style.display = 'none';
    document.getElementById('riddle-score').textContent = `Score: ${riddleScore}/${riddles.length}`;
}

function checkRiddleAnswer() {
    const riddle = riddles[currentRiddle];
    const userAnswer = document.getElementById('riddle-answer').value.toLowerCase().trim();
    const feedback = document.getElementById('riddle-feedback');
    
    if (userAnswer === riddle.answer) {
        riddleScore++;
        feedback.textContent = '🎉 Correct! You\'re so smart!';
        feedback.style.color = '#4CAF50';
    } else {
        feedback.textContent = `❌ The answer was: ${riddle.answer}`;
        feedback.style.color = '#f44336';
    }
    
    document.getElementById('riddle-score').textContent = `Score: ${riddleScore}/${riddles.length}`;
    
    if (currentRiddle < riddles.length - 1) {
        document.getElementById('next-riddle-btn').style.display = 'inline-block';
    } else {
        // Game complete
        setTimeout(() => {
            document.getElementById('riddle-container').innerHTML = `
                <div style="padding: 30px;">
                    <p style="font-size: 3rem;">🧩</p>
                    <h3>Game Complete!</h3>
                    <p style="font-size: 1.5rem; margin: 20px 0;">Final Score: ${riddleScore}/${riddles.length}</p>
                    <p>${getRiddleEndMessage(riddleScore)}</p>
                    <button onclick="startRiddleGame()" class="game-btn" style="margin-top: 20px;">Play Again</button>
                </div>
            `;
        }, 1500);
    }
}

function nextRiddle() {
    currentRiddle++;
    showRiddle();
}

function getRiddleEndMessage(score) {
    if (score === riddles.length) return "🏆 Perfect score! You're a riddle master!";
    if (score >= riddles.length * 0.8) return "🌟 Excellent! You really know your riddles!";
    if (score >= riddles.length * 0.5) return "👍 Good job! Keep practicing!";
    return "💪 Keep trying! Riddles take practice!";
}

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// INITIALIZATION
// ============================================
console.log('🌟 Welcome to Dia\'s World! Explore and have fun! 🌟');
