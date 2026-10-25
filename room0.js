const room0State = {
    doorLocked: true,
    hasNote1: false,
    passcodeSolved: false,
    hasKey: false
};

const passInput = document.getElementById('passcodeInput');
if (passInput) {
    passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitCode();
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        closeNote();
        closeKeypad();
    }
});

function handleRoom0Interaction() {

    const room0Items = [
        { id: 'desk', x: 120, y: 120, width: 60, height: 60 },
        { id: 'keypad', x: 400, y: 30, width: 40, height: 20 },
        { id: 'hidingSpot', x: 500, y: 400, width: 40, height: 40 },
        { id: 'door', x: window.innerWidth - 40, y: 250, width:40, height: 100}
    ];

    for (let item of room0Items) {

        if (
            window.player.x < item.x +item.width &&
            window.player.x + window.player.size > item.x &&
            window.player.y < item.y + item.height &&
            window.player.y + window.player.size > item.y
        ) {

            if (item.id === 'desk') {
                room0State.hasNote1 = true;
                openNote("Faded Note", "The numbers are hidden in the shadows... 4 - 8 - 2");
            }
            
            if (item.id === 'keypad') {
                if (room0State.hasNote1) {
                    document.getElementById('keypadModal').style.display = 'block'; 
                } else {
                    window.messageText = "A locked keypad. I need a hint first.";
                    window.messageTimer = 3;
                }
            }

            if (item.id === 'hidingSpot') {
                if (room0State.passcodeSolved) {
                    room0State.hasKey = true;
                    window.messageText = "Found the brass key! You can now escape to Room 1.";
                    window.messageTimer = 5;
                } else {
                    window.messageText = "A locked keypad. I need a hint first.";
                    window.messageTimer = 3;
                }
           }

           if (item.id === 'door') {
                if (room0State.hasKey) {
                    room0State.doorLocked = false;
                    window.messageText = "The door is unlocked! You can now escape to Room 1.";
                    window.messageTimer = 4;
                } else {
                    window.messageText = "The door is locked. I need to find a key.";
                    window.messageTimer = 3;
                }
            }
        }
    }
}

function openNote(title, text) {
    document.getElementById('noteTitle').innerText = title;
    document.getElementById('noteContent').innerText = text;
    document.getElementById('noteModal').style.display = 'block';
}

function closeNote() {
    document.getElementById('noteModal').style.display = 'none';
}

function closeKeypad() {
    document.getElementById('keypadModal').style.display = 'none';
}

function submitCode() {
    let inputVal = document.getElementById('passcodeInput').value;
    if (inputVal === '482') {
        room0State.passcodeSolved = true;
        window.messageText = "Correct code! A hidden component clicked open in the dark corner.";
        window.messageTimer = '5';
        closeKeypad();
    } else {
        window.messageText = "Incorrect code. Find the code properly from the note!";
        window.messageTimer = 4;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const passInput = document.getElementById('passcodeInput');
    if (passInput) {
        passInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                submitCode();
            }
        });
    }
});