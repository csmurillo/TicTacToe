socket.on('game-end-opponent-disconnected',({disconnected})=>{
    deleteCookies();
    deleteLocalStorageTicTacToeItems();
    toggleTttPrompts('none');
    toggleTttPrompts('opponentLostConnectionContainer');
    let tttPromptContainer=document.getElementById('ttt-prompts-containers');
    tttPromptContainer.style.zIndex='9999';
    setTimer('second-to-redirect-lost-connection');
});
