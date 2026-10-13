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
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 32,
    speed: 300,
    color: '#4CAF50'
};

const walls = [
    { x: 0, y: 0, width: canvas.width, height: 20 },
    { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
    { x: 0, y: 0, width: 20, height: canvas.height },
    { x: 200, y: 200, width: 40, height: 300}
];

function update(deltaTime) {
    if (keys['KeyW'] || keys['ArrowUp']) player.y -= player.speed * deltaTime;
    if (keys['KeyS'] || keys['ArrowDown']) player.y += player.speed * deltaTime;
    if (keys['KeyA'] || keys['ArrowLeft']) player.x -= player.speed * deltaTime;
    if (keys['KeyD'] || keys['ArrowRight']) player.x += player.speed * deltaTime;

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

    if (!checkCollision(netX, player.y)) {
        player.x = netX;
    }

    if (!checkCollision(player.x, netY)) {
        player.y = netY;
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
