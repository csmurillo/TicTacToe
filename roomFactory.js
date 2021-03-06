const { v4: uuidv4 } = require('uuid');
class BoardGame{
    constructor(){
        this.board=[null,null,null,null,null,null,null,null,null],
        this.boardWinner=false;
        this.player1Wins=0;
        this.player2Wins=0;
    }
    getPlayer1Wins(){
        return this.player1Wins;
    }
    getPlayer2Wins(){
        return this.player2Wins;
    }
    setValue(pos,value){
        if(this.boardWinner==true){
            return;
        }
        this.board[pos]=value;
    }
    validBoardPosition(pos){
        if(this.board[pos]==null){
            return true;
        }
        else{
            return false;
        }
    }
    checkFinalWinner(){
        if(this.player1Wins==2){
            return 'player1';
        }
        else if(this.player2Wins==2){
            return 'player2';
        }
    }
    // check if there is a winner
    checkWinner(player1Symbol,player2Symbol){
        // horizontal win paths
        if(this.board[0]&&this.board[1]&&this.board[2]&&this.board[0]==this.board[1]&& this.board[0]==this.board[2]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[0]);
            return winningPlayer;
        }
        else if(this.board[3]&&this.board[4]&&this.board[5]&&this.board[3]==this.board[4]&& this.board[3]==this.board[5]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[3]);
            return winningPlayer;
        }
        else if(this.board[6]&&this.board[7]&&this.board[8]&&this.board[6]==this.board[7]&& this.board[6]==this.board[8]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[6]);
            return winningPlayer;
        }
        // vertical win paths
        else if(this.board[0]&&this.board[3]&&this.board[6]&&this.board[0]==this.board[3]&& this.board[0]==this.board[6]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[0]);
            return winningPlayer;
        }
        else if(this.board[1]&&this.board[4]&&this.board[7]&&this.board[1]==this.board[4]&& this.board[1]==this.board[7]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[1]);
            return winningPlayer;
        }
        else if(this.board[2]&&this.board[5]&&this.board[8]&&this.board[2]==this.board[5]&& this.board[2]==this.board[8]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[2]);
            return winningPlayer;
        }
        // cross win paths
        else if(this.board[0]&&this.board[4]&&this.board[8]&&this.board[0]==this.board[4]&& this.board[0]==this.board[8]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[0]);
            return winningPlayer;
        }
        else if(this.board[2]&&this.board[4]&&this.board[6]&&this.board[2]==this.board[4]&& this.board[2]==this.board[6]){
            this.setBoardWinner();
            let winningPlayer=this.winningPlayer(player1Symbol,player2Symbol,this.board[2])
            return winningPlayer;
        }
        return false;
    }
    boardFull(){
        if(this.board[0]&&this.board[1]&&this.board[2]&&this.board[3]&&this.board[4]&&this.board[5]&&this.board[6]&&this.board[7]&&this.board[8]){
            return true;
        }
        return false;
    }
    rematch(){
        this.board=[null,null,null,null,null,null,null,null,null];
        this.boardWinner=false;
    }
    // helper functions
    // checks which player won
    winningPlayer(player1Symbol,player2Symbol,winningSymbol){
        if(player1Symbol==winningSymbol){
            this.player1Wins++;
            return 'player1';
        }
        else if(player2Symbol==winningSymbol){
            this.player2Wins++;
            return 'player2';
        }
    }
    setBoardWinner(){
        this.boardWinner=true;
    }
    displayCurrentTictactoeBoard(){
        // console.log(this.board+'::');
    }
}

class RoomFactory {   

    constructor(){
        this.RoomFactory=new Map();
        this.create100Rooms()
    }

    create100Rooms(){
        for(var i=0; i<10;i++){
            this.RoomFactory.set(uuidv4(),{
                board:new BoardGame(),
                roomState:'',
                player1:null,
                player1Username:null,
                player1Symbol:null,
                player1Rematch:false,
                player2:null,
                player2Username:null,
                player2Symbol:null,
                player2Rematch:false,
                playerFirstTurn:null,
                playerTurn:null,
                roomInProgress:false,
                playersExit:false,
                roomToBeReinitialized:false
            });
        }    
    }
    setRoomState(roomID,state){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room, roomState:state});
    }
    getRoomState(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.roomState;
    }
    setRoomToBeReinitialized(roomID,condition){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room,roomToBeReinitialized:condition});
    }
    // isRoomEmpty
    roomExist(roomID){
        const room = this.RoomFactory.get(roomID);
        if(room==undefined){
            return false;
        }
        return true;
    }
    getPlayer2Rematch(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player2Rematch;
    }
    getPlayer1Rematch(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player1Rematch;
    }
    getOpponent(userID,roomID){
        const room = this.RoomFactory.get(roomID);
        const {player1,player2}=room;
        if(userID!=player1){
            return player1;
        }
        else if(userID!=player2){
            return player2;
        }
    }
    setPlayerRematch(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,player2}=room;
        if(userID==player1){
            room.player1Rematch=true;
        }
        else if(userID==player2){
            room.player2Rematch=true;
        }
    }
    clearPlayerRematch(roomID){
        const room=this.RoomFactory.get(roomID);
        room.player1Rematch=false;
        room.player2Rematch=false;
    }

    joinRoom(userID,username){
        let roomJoined=null;
        for (const [key, value] of this.RoomFactory.entries()) {
            if(value.roomInProgress==false){
                if(value.player1==null){
                    this.RoomFactory.set(key,{...value, player1:userID,player1Username:username});
                    roomJoined=key;
                    break;
                }
                else if(value.player2==null){
                    this.RoomFactory.set(key,{...value, player2:userID,player2Username:username});
                    roomJoined=key;
                    break;
                }
            }
        }
        return roomJoined;
    }

    leaveRoom(userID){
        for (const [key, value] of this.RoomFactory.entries()) {
            if(value.player1==userID){
                this.RoomFactory.set(key,{...value, player1:null, player1Symbol:null});
                break;
            }
            else if(value.player2==userID){
                this.RoomFactory.set(key,{...value, player2:null, player2Symbol:null});
                break;
            }
        }
    }

    setRoomPlayerFirstTurn(roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,playerFirstTurn}=room;
        if(playerFirstTurn==null){
            this.RoomFactory.set(roomID,{...room,playerFirstTurn:player1});
        }
    }

    updateRoomPlayerFirstTurn(roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,player2,playerFirstTurn}=room;
        if(playerFirstTurn==player1){
            this.RoomFactory.set(roomID,{...room,playerFirstTurn:player2});
        }
        else if(playerFirstTurn==player2){
            this.RoomFactory.set(roomID,{...room,playerFirstTurn:player1});
        }
    }

    setRoomPlayerTurn(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room,playerTurn:userID});
    }

    setRoomInProgress(roomID,roomCondition){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room,roomInProgress:roomCondition});
    }
    
    setPlayerSymbol(userID,playerSymbol,roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,player2}=room;
        if(userID==player1){
            this.RoomFactory.set(roomID,{...room,player1Symbol:playerSymbol});
        }
        else if(userID==player2){
            this.RoomFactory.set(roomID,{...room,player2Symbol:playerSymbol});
        }
    }

    setPlayersExit(roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,player2}=room;
        if(player1==null&&player2==null){
            this.RoomFactory.set(roomID,{...room,playersExit:true});
        }
    }

    getPlayerUserName(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.player1==userID){
            return room.player1Username;
        }
        else if(room.player2==userID){
            return room.player2Username;
        }
    }

    getPlayerSymbol(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.player1==userID){
            return room.player1Symbol;
        }
        else if(room.player2==userID){
            return room.player2Symbol;
        }
    }
    getPlayerPosition(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.player1==userID){
            return 'player-1';
        }
        else if(room.player2==userID){
            return 'player-2';
        }
    }

    getUserRoom(userID){
        let room=null;
        for (const [key, value] of this.RoomFactory.entries()) {
            if(value.player1==userID){
                room=value;
                break;
            }
            else if(value.player2==userID){
                room=value;
                break;
            }
        }
        return room;
    }
    
    getUserRoomID(userID){
        let room=null;
        for (const [key, value] of this.RoomFactory.entries()) {
            if(value.player1==userID){
                room=key;
                break;
            }
            else if(value.player2==userID){
                room=key;
                break;
            }
        }
        return room;
    }

    getUserSymbol(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.player1==userID){
            return room.player1Symbol;
        }
        else if(room.player2==userID){
            return room.player2Symbol;
        }
    }

    getUserPlayerPosition(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.player1==userID){
            return 'player1';
        }
        else if(room.player2==userID){
            return 'player2';
        }
    }

    getRoomBoardGame(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.board;
    }

    getRoomPlayer1Username(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player1Username;
    }

    getRoomPlayer1(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player1;
    }

    getRoomPlayer2Username(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player2Username;
    }

    getRoomPlayer2(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player2;
    }

    getPlayer1Symbol(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player1Symbol;
    }
    getRoomToBeReinitialized(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.roomToBeReinitialized;
    }
    getPlayer2Symbol(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player2Symbol;
    }
    getRoomPlayerFirstTurn(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.playerFirstTurn;
    }
    getCurrentRoomPlayerUsernameTurn(roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.playerTurn==room.player1){
            return room.player1Username;
        }
        else if(room.playerTurn==room.player2){
            return room.player2Username;
        }
    }
    getCurrentRoomPlayerTurn(roomID){
        const room=this.RoomFactory.get(roomID);
        if(room.playerTurn==room.player1){
            return room.player1;
        }
        else if(room.playerTurn==room.player2){
            return room.player2;
        }
    }
    isRoomInProgress(roomID){
        const {roomInProgress}=this.RoomFactory.get(roomID);
        if(roomInProgress){
            return true;
        }
        return false;
    }
    isRoomPlayersExit(roomID){
        const {playersExit}=this.RoomFactory.get(roomID);
        if(playersExit){
            return true;
        }
        return false;
    }
    updateRoomBoard(board,roomID){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room,board:board});
    }
    clearRoom(roomID){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{
            ...room,
            board:new BoardGame(),
            roomState:'',
            player1:null,
            player1Username:null,
            player1Symbol:null,
            player1Rematch:false,
            player2:null,
            player2Username:null,
            player2Symbol:null,
            player2Rematch:false,
            playerFirstTurn:null,
            playerTurn:null,
            roomInProgress:false,
            playersExit:false,
            roomToBeReinitialized:false
        });
    }
    roomToBeReinitialize(roomID){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room,roomToBeReinitialized:true});
    }
    resetRoomToBeReinitialize(){
        let roomJoined=null;
        for (const [key, value] of this.RoomFactory.entries()) {
            if(value.roomToBeReinitialized==true){
                this.clearRoom(key);
                break;
            }
        }
        return roomJoined;
    }
    // debug purpose
    roomContent(){
        for (const [roomID, room] of this.RoomFactory.entries()) {
            console.log('Room Id:'+roomID+'player1: '+room.player1+'player2: '+room.player2);
        }
    }
}

module.exports = { RoomFactory }