// tictactoeGameEnd.js holds everything related with end of tictactoe game
socket.on('game-end',({gameEnd,winner})=>{
    const setWinnerTitle=document.getElementById('set-winner-title');
    setWinnerTitle.innerHTML="Set Winner "+winner;
    toggleTttPrompts('none');
    toggleTttPrompts('setWinnerContainer');
});
socket.on('game-end-redirect-home',()=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    window.location.href = '/';
});
socket.on('game-end-redirect-opponent-home',()=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    toggleTttPrompts('none');
    toggleTttPrompts('playerDeclinedRematchContainer');
    setTimer('second-to-redirect');
});
function setTimer(divId){
    return setTimeout(()=>{
        let secondsLeft=parseInt(document.getElementById(divId).innerHTML);
        if(secondsLeft>0){
            secondsLeft--;
            document.getElementById(divId).innerHTML=''+secondsLeft;
            setTimer(divId);
        }
        if(secondsLeft==0){
            window.location.href = window.location.origin;
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
function returnHome(){
    window.location.href = '/';
}