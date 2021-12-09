// first turn user will pick between X or O
// will send to server socketio on set-players-turns
function chooseTurnPrompt(turnChoosen){
    $('#exampleModalCenter').modal('hide');
    socket.emit('set-players-turns',{turnChoosen});
}