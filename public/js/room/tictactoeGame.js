// tictactoeGame.js holds everything related with active tictactoe game
function tictactoeBoard(markPos){
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
});

socket.on('game-finished',({board,winner,player1Wins,player2Wins})=>{
    // update board
    updateBoard(board);
    playerWinsManager(player1Wins,player2Wins);
    // display winner
    var winnerPlayerContainer=document.getElementById('winner-player');
    winnerPlayerContainer.innerHTML='Winner '+winner;
    // show tictactoeprompt container
    var tttPromptsContainer=document.getElementById("ttt-prompts-containers");
    tttPromptsContainer.style.zIndex="9999";
});
