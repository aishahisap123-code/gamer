document.addEventListener('DOMContentLoaded', () => {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

//track key presses
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

//define players
const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height / 2,
    size: 32,
    speed: 300,
    color: '#4CAF50'
};

let currentRoom = 0;

const rooms = [

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: canvas.height },

            { x: canvas.width - 20, y: 0, width: 20, height: 250 },
            { x: canvas.width - 20, y: 350, width: 20, height: 250 },
            { x: 300, y: 200, width: 40, height: 200 }
        ]

    },

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: 250 },
            { x: 0, y: 350, width: 20, height: 250 },

            { x: canvas.width - 20, y: 0, width: 20, height: 250 },
            { x: canvas.width - 20, y: 350, width: 20, height: 250 },
            { x: 200, y: 100, width: 30, height: 400 }
        ]
    },

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: 250 },
            { x: 0, y: 350, width: 20, height: 250 },

            { x: canvas.width - 20, y: 0, width: 20, height: 250 },
            { x: canvas.width - 20, y: 350, width: 20, height: 250 },
            { x: 400, y: 150, width: 200, height: 50 },
            { x: 400, y: 400, width: 200, height: 50 }
        ]
    },

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height -20, width: canvas.width, height: 20 },
            
            { x: 0, y: 0, width: 20, height: 250 },
            { x: 0, y: 350, width: 20, height: 250 },
            { x: canvas.width - 20, y: 0, width: 20, height: canvas.height },
            { x: 250, y: 200, width: 50, height: 200 }
        ]
    }





];

function update(deltaTime) {

    let nextX = player.x;
    let nextY = player.y;
    
    if (keys['KeyW'] || keys['ArrowUp']) nextY -= player.speed * deltaTime;
    if (keys['KeyS'] || keys['ArrowDown']) nextY += player.speed * deltaTime;
    if (keys['KeyA'] || keys['ArrowLeft']) nextX -= player.speed * deltaTime;
    if (keys['KeyD'] || keys['ArrowRight']) nextX += player.speed * deltaTime;

    function checkCollision(x, y) {
        for (let wall of walls) {
            if (
                x < wall.x + wall.width &&
                x + player.size > wall.x &&
                y < wall.y + wall.height &&
                y + player.size > wall.y
            ) {
                return true;
            }
        }
        return false;
    }

    if (!checkCollision(nextX, player.y)) player.x = nextX;
    if (!checkCollision(player.x, nextY)) player.y = nextY;

    if (player.x > canvas.width) {
        if (currentRoom < rooms.length - 1) {
            currentRoom++;
            player.x = 30;
        } else {
            player.x = canvas.width - player.size;
        }
    } else if (player.x < 0) {
        if (currentRoom > 0) {
            currentRoom--;
            player.x
        }
    }

  
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#444455';
    for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.save();

    ctx.fillStyle = 'rgba(2, 2, 8, 0.94)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'lighter';

    const lightX = player.x + player.size / 2;
    const lightY = player.y + player.size / 2;
    const radius = 240;

    const gradient = ctx.createRadialGradient(
        lightX, lightY, 5,
        lightX, lightY, radius
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 240, 150, 0.75)');
    gradient.addColorStop(0.5, 'rgba(200, 180, 80, 0.3)');
    gradient.addColorStop(0.8, 'rgba(80, 70, 30, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        lightX,
        lightY,
        radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}

let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000 || 0;
    lastTime = timestamp;
    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}



requestAnimationFrame(gameLoop);

});
