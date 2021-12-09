// forward from server.js on( choose-turn-prompt-session ) socket.on
socket.on('player-choose-turn-prompt-session',()=>{
    // show prompt message to first turn player
    $('#exampleModalCenter').modal('show');
});

socket.on('wait-player-choose-turn-prompt-session',()=>{
    // show to specified user
    var waitingForPlayer=document.getElementById("wait-for-player");
    waitingForPlayer.innerHTML="Waiting For Player To Choose Turn ...";
});