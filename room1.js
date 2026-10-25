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
        room1State.scared1Triggered = true;
        triggerJumpScare("")
    }


}   