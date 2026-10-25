document.addEventListener('DOMContentLoaded', () => {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if (e.code === 'KeyE') {
        if (currentRoom === 0 && typeof handleRoom0Interaction ==='function') {
            handleRoom0Interaction();
        } else if (currentRoom === 1 && typeof handleRoom1Interaction === 'function') {
            handleRoom1Interaction();
        }
    }
});
window.messageText = "";
window.messageTimer = 0;

//track key presses
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        closeNote();
        closeKeypad();
    }
});

//define players
const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height / 2,
    size: 32,
    speed: 300,
    color: '#4CAF50'
};

window.player = player;

let currentRoom = 0;

let gameStarted = false;

let scareActive = false;
let scareTimer = 0;
let scareText = "";

function triggerJumpScare(text, duration = 0.4) {
    scareActive = true;
    scareTimer = duration;
    scareText = text;
}

function drawScareOverley() {
    if (scareActive && scareTimer > 0) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(180, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.98)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(scareText, canvas.width / 2, canvas.height / 2);

        scareTimer -= 0.016;
        if (scareTimer <= 0) {
            scareActive = false;
        }
    }
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    gameStarted = true;
    lastTime = performance.now();
}
window.startGame = startGame;

const rooms = [

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: canvas.height },
            { x: canvas.width - 20, y: 0, width: 20, height: 250 },
            { x: canvas.width -20, y: 350, width: 20, height: canvas.height -350 },
            { x: 300, y: 200, width: 40, height: 200 }
        ],

        items: [
            { id: 'desk', x: 120, y: 120, width: 60, height: 60, label: "Old Desk" },
            { id: 'keypad', x: 400, y: 30, width: 40, height: 20, label: "Wall Keypad" },
            { id: 'hidingSpot', x: 500, y: 400, width: 40, height: 40, label: "Dark Corner" },
            { id: 'door', x: canvas.width - 40, y: 250, width: 40, height: 100, label: "Exit Door" }
        ]
    },

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: 220 },
            { x: 0, y: 320, width: 20, height: canvas.height - 320 },
            { x: canvas.width - 20, y: 0, width: 20, height: 220 },
            { x: canvas.width - 20, y: 320, width: 20, height: canvas.height - 320},

            { x: 0, y: 0, width: 1707, height: 20 },
            { x: 0, y: 940, width: 1707, height: 20 },
            { x: 0, y: 0, width: 20, height: 380 },
            { x: 0, y: 540, width: 20, height: 420 },
            

            
        ],

        items: [
            { id: 'fuse1', x: 60, y: 520, width: 35, height: 35 },
            { id: 'fuse2', x: 530, y: 40, width: 35, height: 35 },
            { id: 'fuseBox', x: 780, y: 520, width: 45, height: 45 },
            { id: 'room1Door', x: canvas.width - 40, y: 220, width: 40, height: 100 }
        ]
    },

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: 250 },
            { x: 0, y: 350, width: 20, height: canvas.height - 350 },

            { x: canvas.width - 20, y: 0, width: 20, height: 250 },
            { x: canvas.width - 20, y: 350, width: 20, height: canvas.height - 350 },
            { x: 400, y: 150, width: 200, height: 50 },
            { x: 400, y: 400, width: 200, height: 50 }
        ]
    },

    {
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height -20, width: canvas.width, height: 20 },
            
            { x: 0, y: 0, width: 20, height: 250 },
            { x: 0, y: 350, width: 20, height: canvas.height - 350 },
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
        for (let wall of rooms[currentRoom].walls) {
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
        if (currentRoom === 0 && typeof room0State !== 'undefined' && room0State.doorLocked) {
            player.x = canvas.width - player.size - 10;
            window.messageText = "The door is locked. I need to find a key.";
            window.messageTimer = 3;

        } else if (currentRoom === 1 && typeof room1State !== 'undefined' && !room1State.powerRestored) {
            player.x = canvas.width - player.size - 10;
            window.messageText = "The heavy electric gate is dead. Restore power at the fuse box.";
            window.messageTimer = 3;
        } else if (currentRoom < rooms.length - 1) {
            currentRoom++;
            player.x = 30;
        } else {
            player.x = canvas.width - player.size;
        }
    } else if (player.x < 0) {
        if (currentRoom > 0) {
            currentRoom--;
            player.x = canvas.width - 50;
        } else {
            player.x = 0;
        }
    }

  
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let room = rooms[currentRoom];

    ctx.fillStyle = '#444455';
    for (let wall of room.walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);



    
    if (currentRoom === 0 && room.items) {
        ctx.fillStyle = '#8888aa';
        for (let item of room.items) {
            ctx.fillRect(item.x, item.y, item.width, item.height);
        }
    }

    const currentRoomData = rooms[currentRoom];
    if (currentRoomData && currentRoomData.items) {
        for (let item of currentRoomData.items) {

            if (currentRoom === 1 && typeof room1State != 'undefined') {
                if (item.id === 'fuse1' && room1State.hasFuse1) continue;
                if (item.id === 'fuse2' && room1State.hasFuse2) continue;
            }

            if (item.id.includes('fuse')) {
                ctx.fillStyle = '#ffaa00';
            } else if (item.id === 'fuseBox') {
                ctx.fillStyle = '#444444';
            } else if (item.id.includes('Door')) {
                ctx.fillStyle = '#662222';
            } else {
                ctx.fillStyle = '#888888';
            }

            ctx.fillRect(item.x, item.y, item.width, item.height);

            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(item.x, item.y, item.width, item.height);
        }
    }

// ctx.save();

   // ctx.fillStyle = 'rgba(2, 2, 8, 0.94)';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

   // ctx.globalCompositeOperation = 'lighter';

   // const lightX = player.x + player.size / 2;
   // const lightY = player.y + player.size / 2;
   // const radius = 240;

   // const gradient = ctx.createRadialGradient(
   //     lightX, lightY, 5,
   //     lightX, lightY, radius
   // );
    
   // gradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
   // gradient.addColorStop(0.2, 'rgba(255, 240, 150, 0.75)');
  //  gradient.addColorStop(0.5, 'rgba(200, 180, 80, 0.3)');
   // gradient.addColorStop(0.8, 'rgba(80, 70, 30, 0.08)');
  //  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
////
   // ctx.fillStyle = gradient;
   // ctx.beginPath();
   // ctx.arc(
   //     lightX,
   //     lightY,
   //     radius,
   //     0,
   //     Math.PI * 2
   // );
   // ctx.fill();

    // ctx.restore();

    let activePrompt = "";
    if (currentRoom === 0 && room.items) {
        for (let item of room.items) {
            if (
                player.x < item.x + item.width + 20 &&
                player.x + player.size > item.x - 20 &&
                player.y < item.y + item.height + 20 &&
                player.y + player.size > item.y - 20
            ) {
                activePrompt = `Press [E] to inspect ${item.label || 'Item'}`
            }
        }
    }

    if (activePrompt) {
        ctx.fillStyle = '#ff5555';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(activePrompt, canvas.width / 2, canvas.height - 40);
    }

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    if (window.messageTimer > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width / 2 - 300, canvas.height - 120, 600, 60);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(canvas.width / 2 - 300, canvas.height - 120, 600, 60);

        ctx.fillStyle = '#fff';
        ctx.font = '15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(window.messageText, canvas.width / 2, canvas.height - 85);

        window.messageTimer -= 0.016;
    }

    


   
}

let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000 || 0;
    lastTime = timestamp;

    if (gameStarted) {
        update(deltaTime);
        draw();
    }
    
    requestAnimationFrame(gameLoop);
}



requestAnimationFrame(gameLoop);

});
