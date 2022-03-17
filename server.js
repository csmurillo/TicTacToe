const http = require('http');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

const { UserSessionStorage } = require('./sessionStorage');
const sessionStorage = new UserSessionStorage();

const { RoomFactory } = require('./roomFactory');
const roomFactory = new RoomFactory();

// set middlewares
app.use(cookieParser());
app.use(express.static('public'));
app.use('/images', express.static('public/images'))
app.use('/css', express.static('public/css'))



// set ejs
app.use(expressLayouts);
app.set('views', './public/views');
app.set('view engine','ejs');

const {isAuthenticated,redirect,existentRoom} = require('./middleware/verify-auth');
const { setInterval, setTimeout } = require('timers/promises');
// set routes
app.get('',isAuthenticated(sessionStorage),existentRoom(roomFactory),redirect,(req,res)=>{
    res.render('index.ejs');
});

app.get('/:roomID',isAuthenticated(sessionStorage),existentRoom(roomFactory),redirect,(req,res)=>{
    res.render('room.ejs');
});

// set socketio middleware
io.use((socket, next) => {
    const sessionID = socket.handshake.auth.session;
    if (sessionID) {
        // check for existing session
        const session = sessionStorage.getSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    const usernameExist=sessionStorage.userNameExist(username);
    if(usernameExist){
        return next(new Error("usernameExist"));
    }
    if (!username) {
      return next(new Error("Invalid username"));
    }
    // create new session
    socket.sessionID = uuidv4();
    socket.userID = uuidv4();
    socket.username = username;
    next();
});

// set socketio stream
io.on('connection', (socket) => {
    // save session
    sessionStorage.saveSession(
        socket.sessionID,
        {
            userID:socket.userID,
            username:socket.username,
            roomID:roomFactory.getUserRoomID(socket.userID),
            connected:true
        }
    );

    // join session
    socket.on('join-session',()=>{
        const roomID = roomFactory.joinRoom(socket.userID,socket.username);

        socket.emit('load-room-session',{
            sessionID:socket.sessionID,
            userID:socket.userID,
            username:socket.username,
            roomID:roomID,
            connected:true
        });
        // save session
        sessionStorage.saveSession(
            socket.sessionID,
            {
                userID:socket.userID,
                username:socket.username,
                roomID:roomFactory.getUserRoomID(socket.userID),
                connected:true
            }
        );
    });

    // room session
    socket.on('room-session',()=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        // player1 will be first
        roomFactory.setRoomPlayerFirstTurn(roomID);
        // get room's player1 && player2
        let player1=roomFactory.getRoomPlayer1Username(roomID);
        let player2=roomFactory.getRoomPlayer2Username(roomID);

        // add room id to socket as a property
        socket.roomID=roomID;
        // both current players join room:roomID
        socket.join(''+roomID);
        
        if(player1&&player2){
            roomFactory.setRoomInProgress(socket.roomID,true);
            // emit room details to both current players in room:roomID
            io.in(''+roomID).emit('room-details',{
                roomID:roomFactory.getUserRoomID(socket.userID),
                roomState:roomFactory.getRoomState(socket.roomID),
                player1Username:roomFactory.getRoomPlayer1Username(socket.roomID),
                player2Username:roomFactory.getRoomPlayer2Username(socket.roomID),
                connected:true
            });
        }   
        else{
            // waiting player will be emitted searching as true
            socket.emit('searching-for-player',{
                searching:true,
                roomState:roomFactory.getRoomState(socket.roomID)
            });
        }     
    });
    // choose symbol
    socket.on('choose-symbol',()=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        const player1=roomFactory.getRoomPlayer1(roomID);
        roomFactory.setRoomState(roomID,'choose-symbol');

        if(player1==socket.userID){
            socket.emit('player-choose-symbol-prompt-session',{});
        }
        else{
            socket.emit('wait-player-choose-symbol-prompt-session',{});
        }
    });
    // choose turn prompt session
    socket.on('choose-turn-prompt-session',()=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        let playerTurn = roomFactory.getRoomPlayerFirstTurn(socket.roomID);
        roomFactory.setRoomState(roomID,'choose-turn');
        if(playerTurn==socket.userID){
            socket.emit('player-choose-turn-prompt-session',{});
            socket.to(''+roomID).emit('wait-player-choose-turn-prompt-session',{});
        }
    });
    socket.on('set-players-symbols',({playerSymbolChoosen})=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);

        let playerPos=roomFactory.getPlayerPosition(socket.userID,roomID);
        let player2=roomFactory.getRoomPlayer2(roomID);

        // check for player1
        if(playerPos=='player-1'){
            if(playerSymbolChoosen=='X'||playerSymbolChoosen=='O'){
                roomFactory.setPlayerSymbol(socket.userID,playerSymbolChoosen,roomID);
                // set player symbol to other symbol
                // example if player chose X opponent symbol will be O
                if(playerSymbolChoosen=='X'){
                    roomFactory.setPlayerSymbol(player2,'O',roomID);
                } 
                else if(playerSymbolChoosen=='O'){
                    roomFactory.setPlayerSymbol(player2,'X',roomID);
                }
            }
        }
    });    
    // set players turn
    socket.on('set-players-turns',({turnChoosen})=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        let playerPos=roomFactory.getPlayerPosition(socket.userID,roomID);

        if(playerPos=='player-1'){
            let player2=roomFactory.getRoomPlayer2(roomID);
            if(turnChoosen=='first'){
                roomFactory.setRoomPlayerTurn(socket.userID,roomID);
            }
            else if(turnChoosen=='second'){
                roomFactory.setRoomPlayerTurn(player2,roomID);
            }
        }
        else if(playerPos=='player-2'){
            let player1=roomFactory.getRoomPlayer1(roomID);
            if(turnChoosen=='first'){
                roomFactory.setRoomPlayerTurn(socket.userID,roomID);
            }
            else if(turnChoosen=='second'){
                roomFactory.setRoomPlayerTurn(player1,roomID);
            }
        }
        roomFactory.setRoomState(roomID,'game');
        io.in(''+roomID).emit('tictactoe-start-game',{
            board:roomFactory.getRoomBoardGame(roomID).board,
            currentTurn:roomFactory.getCurrentRoomPlayerUsernameTurn(roomID),
            player1Username:roomFactory.getRoomPlayer1Username(socket.roomID),
            player2Username:roomFactory.getRoomPlayer2Username(socket.roomID),
            player1Symbol:roomFactory.getPlayer1Symbol(roomID),
            player2Symbol:roomFactory.getPlayer2Symbol(roomID)
        });
    });
    socket.on('player-info',()=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
          io.to(socket.id).emit('player-info',{
              playerPosition:roomFactory.getPlayerPosition(socket.userID,roomID),
              playerUsername:roomFactory.getPlayerUserName(socket.userID,roomID),
              playerSymbol:roomFactory.getPlayerSymbol(socket.userID,roomID)
          });
    });
    socket.on('tictactoe-game',({markPos})=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);

        // turn of current player
        let currentPlayerTurn=roomFactory.getCurrentRoomPlayerTurn(roomID);
        // current player symbol
        let currentPlayerSymbol=roomFactory.getUserSymbol(socket.userID,roomID);

        // player1 and player2
        let player1=roomFactory.getRoomPlayer1(roomID);
        let player2=roomFactory.getRoomPlayer2(roomID);

        if(currentPlayerTurn==socket.userID){
            // opposite player symbol
            let oppositePlayerSymbol=null;
            // check if board value is valid
            let board = roomFactory.getRoomBoardGame(roomID);
            const validPos = board.validBoardPosition(markPos);
            if(validPos){
                // set opposite player turn and symbol
                if(currentPlayerTurn!=player1){
                    oppositePlayerSymbol=roomFactory.getUserSymbol(player1,roomID);
                    roomFactory.setRoomPlayerTurn(player1,roomID);
                }
                else if(currentPlayerTurn!=player2){
                    oppositePlayerSymbol=roomFactory.getUserSymbol(player2,roomID);
                    roomFactory.setRoomPlayerTurn(player2,roomID);
                }
                board.setValue(markPos,currentPlayerSymbol);
            }
            else{
                // set opposite player symbol
                oppositePlayerSymbol=roomFactory.getUserSymbol(currentPlayerTurn,roomID);
            }
    
            // set winner if there is winner
            let winningPlayer;
            if(roomFactory.getUserPlayerPosition(socket.userID,roomID)=='player1'){
                winningPlayer=board.checkWinner(currentPlayerSymbol,oppositePlayerSymbol);
            }
            else if(roomFactory.getUserPlayerPosition(socket.userID,roomID)=='player2'){
                winningPlayer=board.checkWinner(oppositePlayerSymbol,currentPlayerSymbol);
            }

            // **************************************************
            // set final winner if there is a final winner
            let finalWinningPlayer=false;
            if(board.checkFinalWinner()=='player1'){
                finalWinningPlayer=true;
            }
            else if(board.checkFinalWinner()=='player2'){
                finalWinningPlayer=true;
            }
            // **************************************************
            // check if winner
            if(winningPlayer=='player1'){
                io.in(''+roomID).emit('game-finished',{
                    board:roomFactory.getRoomBoardGame(roomID).board,
                    winner:roomFactory.getRoomPlayer1Username(roomID),
                    player1Wins:board.getPlayer1Wins(),
                    player2Wins:board.getPlayer2Wins()
                });
                // check if final winner: end game
                if(finalWinningPlayer){
                    reinitializeTictactoeRoom(socket.userID);
                    removePlayerSessions(roomID,socket.sessionID,socket.userID);
                    io.in(''+roomID).emit('game-end',{
                        gameEnd:true,
                        winner:roomFactory.getRoomPlayer1Username(roomID)
                    });
                }
                else{
                    roomFactory.setRoomState(roomID,'rematch');
                    io.in(''+roomID).emit('rematch',{
                        rematch:true
                    });
                }
            }
            else if(winningPlayer=='player2'){
                io.in(''+roomID).emit('game-finished',{
                    board:roomFactory.getRoomBoardGame(roomID).board,
                    winner:roomFactory.getRoomPlayer2Username(roomID),
                    player1Wins:board.getPlayer1Wins(),
                    player2Wins:board.getPlayer2Wins()
                });
                // check if final winner: end game
                if(finalWinningPlayer){
                    reinitializeTictactoeRoom(socket.userID);
                    removePlayerSessions(roomID,socket.sessionID,socket.userID);
                    io.in(''+roomID).emit('game-end',{
                        gameEnd:true,
                        winner:roomFactory.getRoomPlayer2Username(roomID)
                    });
                }
                else{
                    roomFactory.setRoomState(roomID,'rematch');
                    io.in(''+roomID).emit('rematch',{
                        rematch:true
                    });
                }
            }
            else if(board.boardFull()){
                roomFactory.setRoomState(roomID,'rematch');
                io.in(''+roomID).emit('rematch',{
                    rematch:true
                });
            }
            // no winner keep tictactoe game active
            else{
                io.in(''+roomID).emit('tictactoe-game',{
                    board:roomFactory.getRoomBoardGame(roomID).board,
                    currentTurn:roomFactory.getCurrentRoomPlayerUsernameTurn(roomID)
                });
            } 
        }
    });
    socket.on('rematch-state',()=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);

        let player1RematchResponse=roomFactory.getPlayer1Rematch(roomID);
        let player2RematchResponse=roomFactory.getPlayer2Rematch(roomID);

        const player1=roomFactory.getRoomPlayer1(roomID);
        if(player1==socket.userID){
            if(player1RematchResponse){
                socket.emit('rematch-state-wait-for-player',{});
            }
            else{
                socket.emit('rematch-state-rematch-prompt',{});
            }
        }
        else {
            if (player2RematchResponse){
                socket.emit('rematch-state-wait-for-player',{});
            }else{
                socket.emit('rematch-state-rematch-prompt',{});
            }
        }
        
    });
    socket.on('rematch',({rematch})=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        roomFactory.setPlayerRematch(socket.userID,roomID);

        let player1RematchResponse=roomFactory.getPlayer1Rematch(roomID);
        let player2RematchResponse=roomFactory.getPlayer2Rematch(roomID);

        if(player1RematchResponse&&player2RematchResponse){
            // both player accept to start rematch
            roomFactory.clearPlayerRematch(roomID);
            roomFactory.updateRoomPlayerFirstTurn(roomID);
            // clear board
            let board = roomFactory.getRoomBoardGame(roomID);
            board.rematch();
            io.in(''+roomID).emit('start-rematch',{});
        }
        else{
            // waiting player will be emitted waiting for other player rematch
            socket.emit('waiting-for-rematch',{});
        }  
    });
    const removeUserSession = (sessionID)=>{
        sessionStorage.removeSession(sessionID);
    };
    const reinitializeTictactoeRoom = (userID)=>{
        let roomID = roomFactory.getUserRoomID(userID);
        roomFactory.roomToBeReinitialize(roomID);
    };
    const removePlayerSessions=(roomID,playerSessionID,playerUserID)=>{
        const opponentID= roomFactory.getOpponent(playerUserID,roomID);
        const opponentSessionID=sessionStorage.getSessionID(opponentID);
        removeUserSession(playerSessionID);
        removeUserSession(opponentSessionID);
    }
    socket.on('game-end',()=>{
        // remove player sessions from server sessionStorage
        let roomID = roomFactory.getUserRoomID(socket.userID);
        if(roomID){
            reinitializeTictactoeRoom(socket.userID);
            removePlayerSessions(roomID,socket.sessionID,socket.userID);
            // emit
            socket.emit('game-end-redirect-home',{});
            // emit to opponent
            socket.to(''+roomID).emit('game-end-redirect-opponent-home',{});
        }
    });
    socket.on('game-end-2',()=>{
        // remove player sessions from server sessionStorage
        let roomID = roomFactory.getUserRoomID(socket.userID);
        if(roomID){
            reinitializeTictactoeRoom(socket.userID);
            removePlayerSessions(roomID,socket.sessionID,socket.userID);
        }
    });
    socket.on('disconnect',()=>{
        const sessionValid=sessionStorage.sessionExist(socket.sessionID);
        if(sessionValid){
            // save session
            sessionStorage.saveSession(
                socket.sessionID,
                {
                    userID:socket.userID,
                    username:socket.username,
                    room:roomFactory.getUserRoom(socket.userID),
                    connected:false
                }
            );
        }
        setTimeout(()=>{
            const session = sessionStorage.getSession(socket.sessionID);
            if(session!=undefined){
                if(session.connected){
                }
                else{
                    // remove player sessions from server sessionStorage
                    let roomID = roomFactory.getUserRoomID(socket.userID);
                    reinitializeTictactoeRoom(socket.userID);
                    removePlayerSessions(roomID,socket.sessionID,socket.userID);

                    socket.to(''+roomID).emit('game-end-opponent-disconnected',{
                        disconnected:true
                    });
                }
            }
        },600);
    });
});

setTimeout(()=>{
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
},10);
console.log('e');

server.listen(PORT,()=>{
    console.log('liseting...');
})




