// forward from server.js on( choose-turn-prompt-session ) socket.on
socket.on('player-choose-symbol-prompt-session',()=>{
    console.log('player choose symbol');
    // show prompt message to first turn player
    toggleTttPrompts('chooseSymbolContainer');
});
socket.on('wait-player-choose-symbol-prompt-session',()=>{
    // show to specified user
    // toggleTttPrompts('waitPlayerChooseTurnPromptContainer');
    // var waitingForPlayer=document.getElementById("wait-for-player");
    // waitingForPlayer.innerHTML="Waiting For Player To Choose Turn ...";
    toggleTttPrompts('waitPlayerChooseSymbolContainer');
    var waitingForPlayerChooseSymbol=document.getElementById("wait-for-player-choose-symbol");
    waitingForPlayerChooseSymbol.innerHTML="Waiting For Player ...";
});

