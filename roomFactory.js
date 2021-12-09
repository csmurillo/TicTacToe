const { v4: uuidv4 } = require('uuid');
class BoardGame{
    constructor(){
        this.board=['','','','','','','','',''];
    }
    checkWinner(){
        
    }
    boardFull(){

    }
    rematch(){

    }
    setValue(pos,value){
        // this.board[]
    }
}

class RoomFactory {   

    constructor(){
        this.RoomFactory=new Map();
        this.create100Rooms()
    }

    create100Rooms(){
        for(var i=0; i<100;i++){
            this.RoomFactory.set(uuidv4(),{
                board:new BoardGame(),
                player1:null,
                player1Username:null,
                player1Symbol:null,
                player2:null,
                player2Username:null,
                player2Symbol:null,
                playerFirstTurn:null,
                playerTurn:null,
                roomInProgress:false,
                playersExit:false,
            });
        }    
    }
    

    joinRoom(userID,username){
        let roomJoined=null;
        for (const [key, value] of this.RoomFactory.entries()) {
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
        const {player1,player2,playerFirstTurn}=room;
        if(playerFirstTurn==null){
            this.RoomFactory.set(roomID,{...room,playerFirstTurn:player1});
        }
    }

    setRoomPlayerTurn(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        this.RoomFactory.set(roomID,{...room,playerTurn:userID});
    }

    setRoomInProgress(roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,player2}=room;
        if(player1!=null&&player2!=null){
            this.RoomFactory.set(roomID,{...room,roomInProgress:true});
        }
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

    getRoomBoardGame(roomID){
        const {board}=this.RoomFactory.get(roomID);
        return board;
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
    
    getPlayer2Symbol(roomID){
        const room=this.RoomFactory.get(roomID);
        return room.player2Symbol;
    }
    
    getPlayerPosition(userID,roomID){
        const room=this.RoomFactory.get(roomID);
        const {player1,player2}=room;
        if(userID==player1){
            return 'player1';
        }
        else if(userID==player2){
            return 'player2';
        }
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
        this.RoomFactory.set(roomID,{
            board:new BoardGame(),
            player1:null,
            player1Symbol:null,
            player2:null,
            player2Symbol:null,
            playerTurn:null,
            roomInProgress:false
        });
    }
    // debug purpose
    roomContent(){
        for (const [roomID, room] of this.RoomFactory.entries()) {
            console.log('Room Id:'+roomID+'player1: '+room.player1+'player2: '+room.player2);
        }
    }
}

module.exports = { RoomFactory }