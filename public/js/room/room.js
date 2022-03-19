function load(){
    toggleTttPrompts('none');
    const session= localStorage.getItem('tttSessionID');
    if(session){
        toggleTttPrompts('searchingForPlayerContainer');
    }
}
load();
// tictactoe board functions
function tictactoeSymbolOver(event){
    if(event.target.className=='ttt-block'){
        var {playerSymbol}=JSON.parse(localStorage.getItem('tttPlayerInfo'));
        event.target.style.zIndex="9999";
        if(playerSymbol=='O'){
            event.target.innerHTML="<div class='temp-symbol o-symbol center w-100 h-100' style='z-index:-2;'><i class='far fa-circle' style='z-index:-2;'></i></div>";
        }
        else if(playerSymbol=='X'){
            event.target.innerHTML="<div class='temp-symbol x-symbol center w-100 h-100' style='z-index:-2;'><i class='fas fa-times' style='z-index:-2;'></i></div>";
        }
    }
}
function tictactoeSymbolOut(event){
    if(event.target.children[0].className=='temp-symbol x-symbol center w-100 h-100'){
        event.target.innerHTML='';
    }
    else if(event.target.children[0].className=='temp-symbol o-symbol center w-100 h-100'){
        event.target.innerHTML='';
    }
}

function updateBoard(board){
    for(var i=0; i<board.length;i++){
        var tttBoardCurrentPlayer=document.getElementById("block-"+i);
        if(board[i]!=null){
            if(board[i]=='X'){
                tttBoardCurrentPlayer.innerHTML="<div class='x-symbol center w-100 h-100'><i class='fas fa-times'></i></div>";
            }
            else if(board[i]=='O'){
                tttBoardCurrentPlayer.innerHTML="<div class='o-symbol center w-100 h-100'><i class='far fa-circle'></i></div>";
            }
        }
        else{
            tttBoardCurrentPlayer.innerHTML="";
        }
    }
}
// tictactoe board modal prompts
function toggleTttPrompts(promptToShow){
var waitPlayerChooseSymbolContainer=document.getElementById('wait-player-choose-symbol-prompt-container');
var chooseSymbolContainer=document.getElementById('choose-symbol-prompt-container');
var setWinnerContainer=document.getElementById('set-winner-container');
var rematchContainer=document.getElementById('rematch-container');
var winnerRematchContainer=document.getElementById('winner-rematch-container');
var playerDeclinedRematchContainer=document.getElementById('player-declined-rematch-container');
var opponentLostConnectionContainer=document.getElementById('opponent-lost-connection-container');
var searchingForPlayerContainer=document.getElementById('searching-for-player-container');
var waitPlayerChooseTurnPromptContainer=document.getElementById('wait-player-choose-turn-prompt-container');
var playerTurnPromptContainer=document.getElementById('player-turn-prompt-container');
if(promptToShow=='none'){
    $('#chooseSymbolModal').modal('hide');
    $('#rematchModal').modal('hide');
    $('#lostConnectionModal').modal('hide');
    $('#player-declined-rematch-container').modal('hide');
    $('#opponent-lost-connection').modal('hide');
    $('#player-turn-modal').modal('hide');
    setWinnerContainer.style.display="none";
    rematchContainer.style.display="none";
    winnerRematchContainer.style.display="none";
    searchingForPlayerContainer.style.display="none";
    waitPlayerChooseTurnPromptContainer.style.display="none";
    playerTurnPromptContainer.style.display="none";
    playerDeclinedRematchContainer.style.display="none";
    chooseSymbolContainer.style.display="none";
    waitPlayerChooseSymbolContainer.style.display="none";
    opponentLostConnectionContainer.style.display="none";
}
else if(promptToShow=='waitPlayerChooseSymbolContainer'){
    waitPlayerChooseSymbolContainer.style.display="flex";
}
else if(promptToShow=='chooseSymbolContainer'){
    chooseSymbolContainer.style.display="flex";
    $('#chooseSymbolModal').modal('show');
}
else if(promptToShow=='setWinnerContainer'){
    setWinnerContainer.style.display="flex";
    $('#setWinnerModal').modal('show');
}
else if(promptToShow=='waitPlayerChooseTurnPromptContainer'){
    waitPlayerChooseTurnPromptContainer.style.display="flex";
    waitPlayerChooseTurnPromptContainer.style.zIndex='9999';
}
else if(promptToShow=='opponentLostConnectionContainer'){
    chooseSymbolContainer.style.display="none";
    $('#chooseSymbolModal').modal('hide');
    opponentLostConnectionContainer.style.display="flex";
    $('#opponent-lost-connection').modal('show');
}
else if(promptToShow=='playerDeclinedRematchContainer'){
    playerDeclinedRematchContainer.style.display="flex";
    $('#player-declined-rematch').modal('show');
}
else if(promptToShow=='rematchContainer'){
    rematchContainer.style.display="flex";
    $('#rematchModal').modal('show');
}
else if(promptToShow=='winnerRematchContainer'){
    winnerRematchContainer.style.display="flex";
    $('#winnerRematchModal').modal('show');
}
else if(promptToShow=='searchingForPlayerContainer'){
    searchingForPlayerContainer.style.display="flex";
}
else if(promptToShow=='playerTurnPromptContainer'){
    playerTurnPromptContainer.style.display="flex";
    $('#player-turn-modal').modal('show');
}
}
