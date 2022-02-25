socket.emit('room-session',{});
socket.on('room-details',({roomID,currentPlayer,player1Username,player2Username})=>{
    console.log('current player is '+currentPlayer);
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
    // emit to server choose turn prompt
    // will display prompt to specified user
    socket.emit('choose-turn-prompt-session',{});
});
socket.on('searching-for-player',()=>{
    // adds searching for player message to screen
    var searchingForPlayer=document.getElementById("searching-for-player");
    searchingForPlayer.innerHTML="Searching For Player ...";
});
socket.on('end-game-redirect-home',()=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    window.location.href = '/';
});
socket.on('end-game-redirect-opponent-home',()=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    socket.emit('clear-game',{});
    toggleTttPrompts('playerDeclinedRematchContainer');
    setTimer();
});
function setTimer(){
    return setTimeout(()=>{
        let secondsLeft=parseInt(document.getElementById('second-to-redirect').innerHTML);
        if(secondsLeft>0){
            secondsLeft--;
            document.getElementById('second-to-redirect').innerHTML=''+secondsLeft;
            setTimer();
        }
        if(secondsLeft==0){
            window.location.href = '/';
        }
    },1000);
}
function deleteCookies(){
    document.cookie = "tttSessionID=;expires=" + new Date(0).toUTCString();
    document.cookie = "tttRoomID=;expires=" + new Date(0).toUTCString();
}
function deleteLocalStorageTicTacToeItems(){
    localStorage.removeItem('tttPlayerInfo');
    localStorage.removeItem('tttSessionID');
    localStorage.removeItem('tttRoomID');
    localStorage.removeItem('tttBoard');
}

// new
socket.on('game-end',({gameEnd,winner})=>{
    console.log('game-end!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('game-end'+gameEnd);
});