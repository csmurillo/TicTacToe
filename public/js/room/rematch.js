socket.on('rematch',({rematch})=>{
    console.log('rematch::rematch');
    // var rematchContainer=document.getElementById('rematch-container');
    if(rematch){
        toggleTttPrompts('rematchContainer');
        // $('#rematchModal').modal('show');
        // rematchContainer.innerHTML="Rematch";
    }
});
socket.on('start-rematch',()=>{
    console.log('rematch!!!');
     // emit to server choose turn prompt
    // will display prompt to specified user
    socket.emit('choose-turn-prompt-session',{});
});
function rematch(answer){
    if(answer){
        socket.emit('rematch',{});
    }
    else{
        socket.emit('end-game',{});
    }
}

