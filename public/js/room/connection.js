socket.on('opponent-disconnected',({disconnected})=>{
    alert('opponent disconnected'+disconnected);
    socket.emit('clear-game',{});
    window.location.href = '/';
});
