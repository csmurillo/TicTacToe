function tictactoeBoard(markPos){
    // var roomID=localStorage.getItem('roomID');
    console.log('markPos:'+markPos+'socketid'+socket.userID);  
    socket.emit('tictactoe-game',{
        markPos
    });   
}

socket.on('tictactoe-game',({board,currentTurn})=>{
    var tttBoardCurrentPlayer=document.getElementById("ttt-board-current-player");
    var tttBoardCurrentPlayerMobile=document.getElementById("ttt-board-current-player-mobile");
    tttBoardCurrentPlayer.innerHTML='Current Turn '+currentTurn;
    tttBoardCurrentPlayerMobile.innerHTML='Current Turn '+currentTurn;

    // update board
    updateBoard(board);

    console.log('board'+board);
    console.log('current-turn'+currentTurn);
});

socket.on('game-finished',({board,winner})=>{
    // update board
    updateBoard(board);
    console.log('game!');
    // display winner
    var winnerPlayerContainer=document.getElementById('winner-player');
    winnerPlayerContainer.innerHTML='Winner '+winner;
    // show tictactoeprompt container
    var tttPromptsContainer=document.getElementById("ttt-prompts-containers");
    tttPromptsContainer.style.zIndex="9999";
});

