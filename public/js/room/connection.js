socket.on('game-end-opponent-disconnected',({disconnected})=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    setTimer();
});
