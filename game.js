// Game Configuration
const CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 40,
    PLAYER_SPEED: 3,
    AI_SPEED: 2,
    ROCKET_SPEED: 8,
    ROCKET_LIFETIME: 2000,
    CHEST_SPAWN_RATE: 0.002,
    POWER_DURATION: 5000,
    MAP_WIDTH: 2000,
    MAP_HEIGHT: 2000
};

// Game State
let canvas, ctx;
let gameState = 'start'; // start, playing, gameOver
let score = 0;
let keys = {};
let touchControls = {};

// Player
let player = {
    x: CONFIG.CANVAS_WIDTH / 2,
    y: CONFIG.CANVAS_HEIGHT / 2,
    width: 30,
    height: 30,
    speed: CONFIG.PLAYER_SPEED,
    angle: 0,
    activePower: null,
    powerTimer: 0,
    invisible: false
};

// Camera (for scrolling)
let camera = {
    x: 0,
    y: 0
};

// Game Objects
let rockets = [];
let aiCars = [];
let chests = [];
let bombs = [];
let particles = [];

// Map data (simple grid for roads)
let map = [];

// Initialize Game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate map
    generateMap();
    
    // Initialize AI cars
    spawnAICars(5);
    
    // Event listeners
    setupEventListeners();
    
    // Start game loop
    gameLoop();
}

function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    
    let scale = Math.min(maxWidth / CONFIG.CANVAS_WIDTH, maxHeight / CONFIG.CANVAS_HEIGHT);
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    canvas.style.width = (CONFIG.CANVAS_WIDTH * scale) + 'px';
    canvas.style.height = (CONFIG.CANVAS_HEIGHT * scale) + 'px';
}

function generateMap() {
    // Generate a simple road map
    map = [];
    for (let y = 0; y < CONFIG.MAP_HEIGHT / CONFIG.TILE_SIZE; y++) {
        map[y] = [];
        for (let x = 0; x < CONFIG.MAP_WIDTH / CONFIG.TILE_SIZE; x++) {
            // Create road pattern
            if (x % 3 === 0 || y % 3 === 0) {
                map[y][x] = 1; // Road
            } else {
                map[y][x] = 0; // Grass
            }
        }
    }
}

function spawnAICars(count) {
    aiCars = [];
    for (let i = 0; i < count; i++) {
        aiCars.push({
            x: Math.random() * CONFIG.MAP_WIDTH,
            y: Math.random() * CONFIG.MAP_HEIGHT,
            width: 25,
            height: 25,
            speed: CONFIG.AI_SPEED + Math.random() * 1,
            angle: Math.random() * Math.PI * 2,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }
}

function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        if (e.key === ' ') {
            e.preventDefault();
            shootRocket();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Touch controls
    const controlButtons = ['up', 'down', 'left', 'right', 'shoot', 'bomb'];
    controlButtons.forEach(btn => {
        const element = document.getElementById(btn);
        if (element) {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchControls[btn] = true;
                if (btn === 'shoot') {
                    shootRocket();
                } else if (btn === 'bomb' && player.activePower === 'bomb') {
                    placeBomb();
                }
            });
            
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                touchControls[btn] = false;
            });
            
            element.addEventListener('mousedown', (e) => {
                touchControls[btn] = true;
                if (btn === 'shoot') {
                    shootRocket();
                } else if (btn === 'bomb' && player.activePower === 'bomb') {
                    placeBomb();
                }
            });
            
            element.addEventListener('mouseup', () => {
                touchControls[btn] = false;
            });
        }
    });
    
    // Start/Restart buttons
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);
}

function startGame() {
    gameState = 'playing';
    score = 0;
    player.x = CONFIG.CANVAS_WIDTH / 2;
    player.y = CONFIG.CANVAS_HEIGHT / 2;
    player.activePower = null;
    player.powerTimer = 0;
    player.invisible = false;
    camera.x = 0;
    camera.y = 0;
    rockets = [];
    chests = [];
    bombs = [];
    particles = [];
    spawnAICars(5);
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
}

function updatePlayer() {
    let dx = 0, dy = 0;
    
    // Check keyboard
    if (keys['w'] || keys['arrowup'] || touchControls['up']) dy -= 1;
    if (keys['s'] || keys['arrowdown'] || touchControls['down']) dy += 1;
    if (keys['a'] || keys['arrowleft'] || touchControls['left']) dx -= 1;
    if (keys['d'] || keys['arrowright'] || touchControls['right']) dx += 1;
    
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }
    
    // Apply speed boost if active
    let currentSpeed = player.speed;
    if (player.activePower === 'speed') {
        currentSpeed *= 1.5;
    }
    
    // Update position
    player.x += dx * currentSpeed;
    player.y += dy * currentSpeed;
    
    // Update angle for visual direction
    if (dx !== 0 || dy !== 0) {
        player.angle = Math.atan2(dy, dx);
    }
    
    // Keep player in bounds
    player.x = Math.max(player.width/2, Math.min(CONFIG.MAP_WIDTH - player.width/2, player.x));
    player.y = Math.max(player.height/2, Math.min(CONFIG.MAP_HEIGHT - player.height/2, player.y));
    
    // Update camera to follow player
    camera.x = player.x - CONFIG.CANVAS_WIDTH / 2;
    camera.y = player.y - CONFIG.CANVAS_HEIGHT / 2;
    
    // Update power timer
    if (player.activePower) {
        player.powerTimer -= 16; // ~60fps
        if (player.powerTimer <= 0) {
            player.activePower = null;
            player.invisible = false;
            updatePowerIndicator();
        }
    }
}

function updateAICars() {
    aiCars.forEach(car => {
        // Simple AI: move towards player with some randomness
        const dx = player.x - car.x;
        const dy = player.y - car.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
            car.x += Math.cos(angle) * car.speed;
            car.y += Math.sin(angle) * car.speed;
            car.angle = angle;
        }
        
        // Keep in bounds
        car.x = Math.max(car.width/2, Math.min(CONFIG.MAP_WIDTH - car.width/2, car.x));
        car.y = Math.max(car.height/2, Math.min(CONFIG.MAP_HEIGHT - car.height/2, car.y));
    });
}

function shootRocket() {
    if (gameState !== 'playing') return;
    
    rockets.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(player.angle) * CONFIG.ROCKET_SPEED,
        vy: Math.sin(player.angle) * CONFIG.ROCKET_SPEED,
        lifetime: CONFIG.ROCKET_LIFETIME,
        width: 10,
        height: 10
    });
}

function updateRockets() {
    rockets = rockets.filter(rocket => {
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.lifetime -= 16;
        
        // Check collision with AI cars
        for (let i = aiCars.length - 1; i >= 0; i--) {
            const car = aiCars[i];
            if (checkCollision(rocket, car)) {
                // Explosion
                createExplosion(car.x, car.y);
                aiCars.splice(i, 1);
                score += 100;
                return false; // Remove rocket
            }
        }
        
        // Check bounds
        if (rocket.x < 0 || rocket.x > CONFIG.MAP_WIDTH || 
            rocket.y < 0 || rocket.y > CONFIG.MAP_HEIGHT) {
            return false;
        }
        
        return rocket.lifetime > 0;
    });
}

function spawnChests() {
    if (Math.random() < CONFIG.CHEST_SPAWN_RATE) {
        chests.push({
            x: Math.random() * CONFIG.MAP_WIDTH,
            y: Math.random() * CONFIG.MAP_HEIGHT,
            width: 20,
            height: 20,
            collected: false
        });
    }
}

function updateChests() {
    chests.forEach(chest => {
        if (!chest.collected && checkCollision(player, chest)) {
            chest.collected = true;
            score += 50;
            
            // Random power
            const powers = ['invisibility', 'speed', 'bomb'];
            player.activePower = powers[Math.floor(Math.random() * powers.length)];
            player.powerTimer = CONFIG.POWER_DURATION;
            
            if (player.activePower === 'invisibility') {
                player.invisible = true;
            }
            
            updatePowerIndicator();
        }
    });
    
    chests = chests.filter(chest => !chest.collected);
}

function placeBomb() {
    if (player.activePower !== 'bomb') return;
    
    bombs.push({
        x: player.x,
        y: player.y,
        width: 30,
        height: 30,
        timer: 2000,
        exploded: false
    });
    
    // Use up bomb power
    player.activePower = null;
    player.powerTimer = 0;
    updatePowerIndicator();
}

function updateBombs() {
    bombs.forEach(bomb => {
        bomb.timer -= 16;
        if (bomb.timer <= 0 && !bomb.exploded) {
            bomb.exploded = true;
            createExplosion(bomb.x, bomb.y);
            
            // Check damage to AI cars
            for (let i = aiCars.length - 1; i >= 0; i--) {
                const car = aiCars[i];
                const dist = Math.sqrt(
                    Math.pow(car.x - bomb.x, 2) + 
                    Math.pow(car.y - bomb.y, 2)
                );
                if (dist < 80) {
                    aiCars.splice(i, 1);
                    score += 100;
                }
            }
        }
    });
    
    bombs = bombs.filter(bomb => bomb.timer > -500); // Keep for explosion animation
}

function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30,
            color: `hsl(${Math.random() * 60}, 100%, 50%)`
        });
    }
}

function updateParticles() {
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
    });
    particles = particles.filter(p => p.life > 0);
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function checkPlayerCollisions() {
    if (player.invisible) return;
    
    for (const car of aiCars) {
        if (checkCollision(player, car)) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = `Score: ${score}`;
    document.getElementById('gameOverScreen').style.display = 'block';
}

function updatePowerIndicator() {
    const indicator = document.getElementById('activePower');
    if (player.activePower) {
        const powerNames = {
            'invisibility': 'Invisible',
            'speed': 'Speed Boost',
            'bomb': 'Bomb Ready'
        };
        indicator.textContent = `Power: ${powerNames[player.activePower]}`;
        const timeLeft = Math.ceil(player.powerTimer / 1000);
        indicator.textContent += ` (${timeLeft}s)`;
    } else {
        indicator.textContent = 'Power: None';
    }
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function drawMap() {
    const startX = Math.floor(camera.x / CONFIG.TILE_SIZE);
    const startY = Math.floor(camera.y / CONFIG.TILE_SIZE);
    const endX = Math.ceil((camera.x + CONFIG.CANVAS_WIDTH) / CONFIG.TILE_SIZE);
    const endY = Math.ceil((camera.y + CONFIG.CANVAS_HEIGHT) / CONFIG.TILE_SIZE);
    
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            if (y >= 0 && y < map.length && x >= 0 && x < map[y].length) {
                const tileX = x * CONFIG.TILE_SIZE - camera.x;
                const tileY = y * CONFIG.TILE_SIZE - camera.y;
                
                if (map[y][x] === 1) {
                    ctx.fillStyle = '#444';
                    ctx.fillRect(tileX, tileY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                    ctx.strokeStyle = '#666';
                    ctx.strokeRect(tileX, tileY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                } else {
                    ctx.fillStyle = '#2a5a2a';
                    ctx.fillRect(tileX, tileY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                }
            }
        }
    }
}

function drawPlayer() {
    if (player.invisible) {
        ctx.globalAlpha = 0.3;
    }
    
    ctx.save();
    ctx.translate(player.x - camera.x, player.y - camera.y);
    ctx.rotate(player.angle);
    
    // Car body
    ctx.fillStyle = '#4a9eff';
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    
    // Car details
    ctx.fillStyle = '#2a5a9f';
    ctx.fillRect(-player.width/2 + 5, -player.height/2 + 5, player.width - 10, player.height - 10);
    
    // Direction indicator
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.width/2 - 5, -3, 8, 6);
    
    ctx.restore();
    ctx.globalAlpha = 1.0;
}

function drawAICars() {
    aiCars.forEach(car => {
        ctx.save();
        ctx.translate(car.x - camera.x, car.y - camera.y);
        ctx.rotate(car.angle);
        
        ctx.fillStyle = car.color;
        ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(-car.width/2 + 3, -car.height/2 + 3, car.width - 6, car.height - 6);
        
        ctx.restore();
    });
}

function drawRockets() {
    rockets.forEach(rocket => {
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(rocket.x - camera.x, rocket.y - camera.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rocket.x - camera.x, rocket.y - camera.y);
        ctx.lineTo(
            rocket.x - camera.x - rocket.vx * 0.3,
            rocket.y - camera.y - rocket.vy * 0.3
        );
        ctx.stroke();
    });
}

function drawChests() {
    chests.forEach(chest => {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(
            chest.x - camera.x - chest.width/2,
            chest.y - camera.y - chest.height/2,
            chest.width,
            chest.height
        );
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            chest.x - camera.x - chest.width/2,
            chest.y - camera.y - chest.height/2,
            chest.width,
            chest.height
        );
    });
}

function drawBombs() {
    bombs.forEach(bomb => {
        if (!bomb.exploded) {
            const alpha = Math.sin(bomb.timer / 100) * 0.5 + 0.5;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(bomb.x - camera.x, bomb.y - camera.y, bomb.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    });
}

function drawParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - camera.x - 2, p.y - camera.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1.0;
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    if (gameState === 'playing') {
        // Draw map
        drawMap();
        
        // Draw game objects
        drawChests();
        drawBombs();
        drawAICars();
        drawRockets();
        drawParticles();
        drawPlayer();
    }
}

function update() {
    if (gameState === 'playing') {
        updatePlayer();
        updateAICars();
        updateRockets();
        spawnChests();
        updateChests();
        updateBombs();
        updateParticles();
        checkPlayerCollisions();
        updateScore();
        updatePowerIndicator();
        
        // Spawn more AI cars if needed
        if (aiCars.length < 3) {
            spawnAICars(2);
        }
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize when page loads
window.addEventListener('load', init);

