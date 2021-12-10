function tictactoeBoard(markPos){
    var roomID=localStorage.getItem('roomID');
    console.log('markPos:'+markPos+'socketid'+socket.userID);  
    socket.emit('tictactoe-game',{
        markPos,
        player:socket.userID
    });   
}

socket.on('tictactoe-game',({board,currentTurn})=>{
    console.log('board'+board);
    console.log('current-turn'+currentTurn);
});