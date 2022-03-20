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
    toggleTttPrompts('none');
    toggleTttPrompts('waitPlayerChooseSymbolContainer');
    var waitingForPlayerChooseSymbol=document.getElementById("wait-for-player-choose-symbol");
    waitingForPlayerChooseSymbol.innerHTML="Waiting For Player choose symbol ...";
});

// choose symbol modal button function: room.ejs
function chooseSymbol(symbol){
    socket.emit('set-players-symbols',{playerSymbolChoosen:symbol});
    socket.emit('choose-turn-prompt-session',{});
}