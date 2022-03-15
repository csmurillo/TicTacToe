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

function playerWinsManager(player1Wins,player2Wins){
    const player1Win1=document.getElementById('player-1-win-1');
    const player1MobileWin1=document.getElementById('player-1-win-1-mobile');
    const player1Win2=document.getElementById('player-1-win-2');
    const player1MobileWin2=document.getElementById('player-1-win-2-mobile');
    const player2Win1=document.getElementById('player-2-win-1');
    const player2MobileWin1=document.getElementById('player-2-win-1-mobile');
    const player2Win2=document.getElementById('player-2-win-2');
    const player2MobileWin2=document.getElementById('player-2-win-2-mobile');
    if(player1Wins==1){
        player1Win1.className += " player-1-active-win";
        player1MobileWin1.className += " player-1-active-win";
    }
    else if(player1Wins==2){
        player1Win1.className += " player-1-active-win";
        player1MobileWin1.className += " player-1-active-win";
        player1Win2.className += " player-1-active-win";
        player1MobileWin2.className += " player-1-active-win";
    }
    if(player2Wins==1){
        player2Win1.className += " player-2-active-win";
        player2MobileWin1.className += " player-2-active-win";
    }
    else if(player2Wins==2){
        player2Win1.className += " player-2-active-win";
        player2MobileWin1.className += " player-2-active-win";
        player2Win2.className += " player-2-active-win";
        player2MobileWin2.className += " player-2-active-win";
    }
}