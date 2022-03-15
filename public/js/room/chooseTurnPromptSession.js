// forward from server.js on( choose-turn-prompt-session ) socket.on
socket.on('player-choose-turn-prompt-session',()=>{
    console.log('playechooseturnpromtpsession');
    // show prompt message to first turn player
    toggleTttPrompts('none');
    setTimeout(()=>{
        toggleTttPrompts('playerTurnPromptContainer');
    },500);
});
socket.on('wait-player-choose-turn-prompt-session',()=>{
    alert('eeeee');
    // show to specified user
    toggleTttPrompts('none');
    toggleTttPrompts('waitPlayerChooseTurnPromptContainer');
    var waitingForPlayer=document.getElementById("wait-for-player");
    waitingForPlayer.innerHTML="Waiting For Player To Choose Turn ...";
});

