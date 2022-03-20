// roomSession.js holds everything related with processing users to the start of a tictactoe game
socket.emit('room-session',{});
socket.on('room-details',({roomID,roomState,currentPlayer,player1Username,player2Username})=>{
    // save room to localstorage for page refresh
    localStorage.setItem('tttRoomID',roomID);
    // set initial room details
    // usernames
    var player1=document.getElementById("player-1-username");
    var player2=document.getElementById("player-2-username");
    var player1Mobile=document.getElementById("player-1-username-mobile");
    var player2Mobile=document.getElementById("player-2-username-mobile");
    // set players usernames
    player1.innerHTML=player1Username;
    player2.innerHTML=player2Username;
    player1Mobile.innerHTML=player1Username;
    player2Mobile.innerHTML=player2Username;
    // remove searching for player message
    var searchingForPlayer=document.getElementById("searching-for-player");
    searchingForPlayer.style.display="none";
    toggleTttPrompts('none');

    // load room state
    if(roomState=='choose-symbol'||roomState==''||roomState==undefined){
        // emit to server choose symbol prompt
        // will display prompt to specified user
        socket.emit('choose-symbol',{});
    }
    else if(roomState=='choose-turn'){
        socket.emit('choose-turn-prompt-session',{});
    }
    else if(roomState=='game'){
        socket.emit('set-players-turns',{});   
        toggleTttPrompts('none');
    }
    else if(roomState=='rematch'){
        socket.emit('rematch-state',{}); 
    }
    else{
        toggleTttPrompts('none');
    }
});
socket.on('searching-for-player',(roomState)=>{
    if(roomState!='game'||roomState!='rematch'){
        // adds searching for player message to screen
        var searchingForPlayer=document.getElementById("searching-for-player");
        searchingForPlayer.innerHTML="Searching For Player ...";
    }
    else if(roomState=='game'){
        socket.emit('set-players-turns',{});  
        toggleTttPrompts('none'); 
    }
    else if(roomState=='rematch'){
        toggleTttPrompts('none');
        toggleTttPrompts('rematchContainer');
    }
    else{
        toggleTttPrompts('none');
    }
});