socket.emit('room-session',{});

socket.on('room-details',({roomID,player1Username,player2Username})=>{
    // save room to localstorage for page refresh
    localStorage.setItem('roomID',roomID);
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

    // emit to server choose turn prompt
    // will display prompt to specified user
    socket.emit('choose-turn-prompt-session',{});
});

socket.on('searching-for-player',()=>{
    // adds searching for player message to screen
    var searchingForPlayer=document.getElementById("searching-for-player");
    searchingForPlayer.innerHTML="Searching For Player ...";
});



