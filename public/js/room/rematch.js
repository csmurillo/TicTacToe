socket.on('rematch',({rematch})=>{
    if(rematch){
        var tttPrompts= document.getElementById('ttt-prompts-containers');
        tttPrompts.style.zIndex="unset";
        toggleTttPrompts('none');
        var rematchContainer=document.getElementById('rematch-container');
        rematchContainer.style.display="flex";
        $('#rematchModal').modal('show');
    }
});
socket.on('start-rematch',()=>{
    // emit to server choose turn prompt
    // will display prompt to specified user
    socket.emit('choose-turn-prompt-session',{});
});
socket.on('waiting-for-rematch',()=>{
    toggleTttPrompts('none');
    toggleTttPrompts('waitPlayerChooseTurnPromptContainer');
    var waitingForPlayer=document.getElementById("wait-for-player");
    waitingForPlayer.innerHTML="Waiting For Player for rematch ...";
});
function rematch(answer){
    if(answer){
        socket.emit('rematch',{});
    }
    else{
        socket.emit('game-end',{});
    }
}
socket.on('rematch-state-wait-for-player',({player1Wins,player2Wins})=>{
    playerWinsManager(player1Wins,player2Wins);
    toggleTttPrompts('none');
    toggleTttPrompts('waitPlayerChooseTurnPromptContainer');
    var waitingForPlayer=document.getElementById("wait-for-player");
    waitingForPlayer.innerHTML="Waiting For Player for rematch ...";
});
socket.on('rematch-state-rematch-prompt',({player1Wins,player2Wins})=>{
    playerWinsManager(player1Wins,player2Wins);

    toggleTttPrompts('none');
    var rematchContainer=document.getElementById('rematch-container');
    rematchContainer.style.display="flex";
    $('#rematchModal').modal('show');

    
    let winnerRematchModal=document.getElementById('rematchModal');
    winnerRematchModal.className="modal show";
    setTimeout(()=>{
        winnerRematchModal.setAttribute("style", "display:block !important; float:left;");
    },400);
});