// tictactoeStartGame.js holds everything related with start of tictactoe game
socket.on('tictactoe-start-game',({board,currentTurn,player1Username,player2Username,player1Symbol,player2Symbol})=>{
    // save board to local storage for use during tictactoe game session
    localStorage.setItem('tttBoard',board);
    updateBoard(board);
    // remove message prompts from screen
    // remove prompt containers
    var tttPromptsContainer=document.getElementById("ttt-prompts-containers");
    tttPromptsContainer.style.zIndex="-1";
    // remove wait for player message
    var waitingForPlayer=document.getElementById("wait-for-player");
    waitingForPlayer.innerHTML="";
    toggleTttPrompts('none');
    // set game details
    // set current turn
    var tttBoardCurrentPlayer=document.getElementById("ttt-board-current-player");
    var tttBoardCurrentPlayerMobile=document.getElementById("ttt-board-current-player-mobile");
    tttBoardCurrentPlayer.innerHTML="Current Turn: "+currentTurn;
    tttBoardCurrentPlayerMobile.innerHTML="Current Turn: "+currentTurn;

    // set symbol X or O to pertaining user
    var player1=document.getElementById("player-1-username");
    var player2=document.getElementById("player-2-username");
    var player1Mobile=document.getElementById("player-1-username-mobile");
    var player2Mobile=document.getElementById("player-2-username-mobile");
    player1.innerHTML='('+player1Symbol+') '+player1Username;
    player2.innerHTML='('+player2Symbol+') '+player2Username;
    player1Mobile.innerHTML='('+player1Symbol+') '+player1Username;
    player2Mobile.innerHTML='('+player2Symbol+') '+player2Username;

    // get current player info
    socket.emit('player-info',{})

});

// get current player info
socket.on('player-info',(playerInfo)=>{
    const { playerPosition}=playerInfo;
    // save current player info
    localStorage.setItem('tttPlayerInfo',JSON.stringify(playerInfo));
    var playerUsername1=document.getElementById(playerPosition+"-username");
    playerUsername1.style.textDecoration="underline";
});

