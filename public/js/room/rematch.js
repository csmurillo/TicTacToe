socket.on('rematch',({rematch})=>{
    console.log('rematch::rematch!!!!!!!!!!!!!!!!!');
    // var rematchContainer=document.getElementById('rematch-container');
    if(rematch){
        console.log('rematch container now viewable!');
        var tttPrompts= document.getElementById('ttt-prompts-containers');
        tttPrompts.style.zIndex="unset";
        toggleTttPrompts('rematchContainer');
        $('#rematchModal').modal('show');
        // rematchContainer.innerHTML="Rematch";
    }
});
socket.on('start-rematch',()=>{
    console.log('rematch!!!');
     // emit to server choose turn prompt
    // will display prompt to specified user
    socket.emit('choose-turn-prompt-session',{});
});
socket.on('waiting-for-rematch',()=>{
    toggleTttPrompts('waitPlayerChooseTurnPromptContainer');
    var waitingForPlayer=document.getElementById("wait-for-player");
    waitingForPlayer.innerHTML="Waiting For Player ...";
});
function rematch(answer){
    if(answer){
        socket.emit('rematch',{});
    }
    else{
        socket.emit('end-game',{});
    }
}

