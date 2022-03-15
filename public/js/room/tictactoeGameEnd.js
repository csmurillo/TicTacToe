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
