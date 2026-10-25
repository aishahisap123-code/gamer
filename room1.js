const room1State = {
    hasFuse1: false,
    hasFuse2: false,
    powerRestored: false,
    scare1Triggered: false,
    scare2Triggered: false
};

function handleRoom1Interaction() {
    const player = window.player;
    const room1 = rooms[1];

    if (!room1State.scare1Triggered && player.x > 320 && player.x < 380 && player.y > 350) {
        room1State.scare1Triggered = true;
        triggerJumpScare("SOMETHING MOVED IN THE DARK", 0.5);
    }

    const padding = 40;

    for (let item of room1.items) {

        if (item.id === 'fuse1' && room1State.hasFuse1) continue;
        if (item.id === 'fuse2' && room1State.hasFuse2) continue;

        if ( 
            player.x < item.x + item.width + padding &&
            player.x + player.size > item.x - padding &&
            player.y < item.y + item.height + padding && 
            player.y + player.size > item.y - padding
        ) {
            if (item.id === 'fuse1' && !room1State.hasFuse1) {
                room1State.hasFuse1 = true;
                window.messageText = "Found Fuse 1 in the rubble!";
                window.messageTimer = 4;
            }

            if (item.id === 'fuse2' && !room1State.hasFuse2) {
                room1State.hasFuse2 = true;
                window.messageText = "Found Fuse 2!";
                window.messageTimer = 4;

                if (!room1State.scare2Triggered) {
                    room1State.scare2Triggered = true;
                    triggerJumpScare("IT SAW YOU!", 0.6);
                }
            }

            if (item.id === 'fuseBox') {
                if (room1State.hasFuse1 && room1State.hasFuse2) {
                    room1State.powerRestored = true;
                    window.messageText = "Fuses inserted! Power restored to the security gate.";
                    window.messageTimer = 5;

                } else {
                    window.messageText = "The fuse box is missing 2 fuses. Find them first.";
                    window.messageTimer = 4;
                }
            }

            if (item.id === 'room1Door') {
                if (room1State.powerRestored) {
                    window.messageText = "Security gate opened! You escaped Room 1.";
                    window.messageTimer = 4;

                } else {
                    window.messageText = "The heavy electric gate is dead. Restore power at the fuse box.";
                    window.messageTimer = 4;
                }
            }
        }
    }

}   
