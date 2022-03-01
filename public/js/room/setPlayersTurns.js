// first turn user will pick between X or O
// will send to server socketio on set-players-turns
function chooseTurnPrompt(turnChoosen){
    console.log('chooseturnpromt function'+turnChoosen+'!@');
    // $('#exampleModalCenter').modal('hide');
    toggleTttPrompts('none');
    socket.emit('set-players-turns',{turnChoosen});
}






