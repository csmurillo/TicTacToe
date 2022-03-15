// forward from server.js on( choose-turn-prompt-session ) socket.on
socket.on('player-choose-symbol-prompt-session',()=>{
    // alert('player choose symbol');
    // show prompt message to first turn player
    toggleTttPrompts('none');
    setTimeout(()=>{
        toggleTttPrompts('chooseSymbolContainer');
    },400);
    // alert('chooseSymbolContainer should be shown');
});
socket.on('wait-player-choose-symbol-prompt-session',()=>{
    // alert('wait player chooses symbol');
    // show to specified user
    toggleTttPrompts('waitPlayerChooseSymbolContainer');
    var waitingForPlayerChooseSymbol=document.getElementById("wait-for-player-choose-symbol");
    waitingForPlayerChooseSymbol.innerHTML="Waiting For Player choose symbol ...";
});

