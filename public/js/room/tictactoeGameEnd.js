socket.on('game-end',({gameEnd,winner})=>{
    const setWinnerTitle=document.getElementById('set-winner-title');
    setWinnerTitle.innerHTML="Set Winner "+winner;
    toggleTttPrompts('setWinnerContainer');
    socket.emit('game-end-2',{});
});
socket.on('game-end-redirect-home',()=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    window.location.href = '/';
});
socket.on('game-end-redirect-opponent-home',()=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
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
