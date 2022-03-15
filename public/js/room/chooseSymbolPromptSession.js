// forward from server.js on( choose-turn-prompt-session ) socket.on
socket.on('player-choose-symbol-prompt-session',()=>{
    // show prompt message to first turn player
    toggleTttPrompts('none');
    setTimeout(()=>{
        toggleTttPrompts('chooseSymbolContainer');
    },400);
});
socket.on('wait-player-choose-symbol-prompt-session',()=>{
    // show to specified user
    toggleTttPrompts('waitPlayerChooseSymbolContainer');
    var waitingForPlayerChooseSymbol=document.getElementById("wait-for-player-choose-symbol");
    waitingForPlayerChooseSymbol.innerHTML="Waiting For Player choose symbol ...";
});

