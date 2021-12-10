const http = require('http');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000||process.env.PORT;

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

// set routes
app.get('',isAuthenticated(sessionStorage),existentRoom(sessionStorage),redirect,(req,res)=>{
    res.render('index.ejs');
});

app.get('/:roomID',isAuthenticated(sessionStorage),redirect,(req,res)=>{
    res.render('room.ejs');
});

// app.get('/other',isAuthenticated(sessionStorage),redirect,(req,res)=>{
//     res.render('other.ejs');
// });

// set socketio middleware
io.use((socket, next) => {
    console.log('middleware');
    const sessionID = socket.handshake.auth.session;
    if (sessionID) {
        console.log('exist');
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
    if (!username) {
      return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = uuidv4();
    socket.userID = uuidv4();
    socket.username = username;
    
    next();
});

// set socketio stream
io.on('connection', (socket) => {
    console.log('a user connected userID'+socket.userID);
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
        // debug working
        // console.log('debug'+player1+''+player2);

        // add room id to socket as a property
        socket.roomID=roomID;
        // both current players join room:roomID
        socket.join(''+roomID);
        
        if(player1&&player2){
            // emit room details to both current players in room:roomID
            io.in(''+roomID).emit('room-details',{
                roomID:roomFactory.getUserRoomID(socket.userID),
                player1Username:roomFactory.getRoomPlayer1Username(socket.roomID),
                player2Username:roomFactory.getRoomPlayer2Username(socket.roomID),
                connected:true
            });
        }   
        else{
            // waiting player will be emitted searching as true
            socket.emit('searching-for-player',{
                searching:true
            });
        }     
    });

    // choose turn prompt session
    socket.on('choose-turn-prompt-session',()=>{
        let playerTurn = roomFactory.getRoomPlayerFirstTurn(socket.roomID);
        if(playerTurn==socket.userID){
            socket.emit('player-choose-turn-prompt-session',{});
        }
        else{
            socket.emit('wait-player-choose-turn-prompt-session',{});
        }
    });

    // set players turn
    socket.on('set-players-turns',({turnChoosen})=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        let playerPos=roomFactory.getPlayerPosition(socket.userID,roomID);

        if(playerPos=='player1'){
            let player2=roomFactory.getRoomPlayer2(roomID);
            if(turnChoosen=='first'){
                roomFactory.setRoomPlayerTurn(socket.userID,roomID);
                roomFactory.setPlayerSymbol(socket.userID,'X',roomID);
                roomFactory.setPlayerSymbol(player2,'O',roomID);
            }
            else if(turnChoosen=='second'){
                roomFactory.setRoomPlayerTurn(player2,roomID);
                roomFactory.setPlayerSymbol(player2,'X',roomID);
                roomFactory.setPlayerSymbol(socket.userID,'O',roomID);
            }
        }
        else if(playerPos=='player2'){
            let player1=roomFactory.getRoomPlayer1(roomID);
            if(turnChoosen=='first'){
                roomFactory.setRoomPlayerTurn(socket.userID,roomID);
                roomFactory.setPlayerSymbol(socket.userID,'X',roomID);
                roomFactory.setPlayerSymbol(player1,'O',roomID);
            }
            else if(turnChoosen=='second'){
                roomFactory.setRoomPlayerTurn(player1,roomID);
                roomFactory.setPlayerSymbol(player1,'X',roomID);
                roomFactory.setPlayerSymbol(socket.userID,'O',roomID);
            }
        }

        io.in(''+roomID).emit('tictactoe-start-game',{
            board:roomFactory.getRoomBoardGame(roomID),
            currentTurn:roomFactory.getCurrentRoomPlayerUsernameTurn(roomID),
            player1Symbol:roomFactory.getPlayer1Symbol(roomID),
            player2Symbol:roomFactory.getPlayer2Symbol(roomID)
        });
    });

    socket.on('tictactoe-game',({markPos})=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        // turn of current player
        let currentPlayerTurn=roomFactory.getCurrentRoomPlayerTurn(roomID);
        // player1 and player2
        let player1=roomFactory.getRoomPlayer1(roomID);
        let player2=roomFactory.getRoomPlayer2(roomID);
        
        if(currentPlayerTurn==socket.userID){
            // opposite player symbol
            let oppositePlayerSymbol=null;
            // set opposite player turn
            if(currentPlayerTurn!=player1){
                oppositePlayerSymbol=roomFactory.getUserSymbol(player1,roomID);
                roomFactory.setRoomPlayerTurn(player1,roomID);
            }
            else if(currentPlayerTurn!=player2){
                oppositePlayerSymbol=roomFactory.getUserSymbol(player1,roomID);
                roomFactory.setRoomPlayerTurn(player2,roomID);
            }

            // current player symbol
            let currentPlayerSymbol=roomFactory.getUserSymbol(socket.userID,roomID);
            // update tictactoeboard based on current player symbol 
            let board = roomFactory.getRoomBoardGame(roomID);
            board.setValue(markPos,currentPlayerSymbol);
            // debug purpose
            // console.log(board.displayCurrentTictactoeBoard());
            // check if winner
            let winningPlayer=board.checkWinner(currentPlayerSymbol,oppositePlayerSymbol);
            if(winningPlayer=='player1'){
                io.in(''+roomID).emit('game-finished',{
                    board:roomFactory.getRoomBoardGame(roomID).board,
                    winner:roomFactory.getRoomPlayer1Username(roomID)
                });
            }
            else if(winningPlayer=='player2'){
                io.in(''+roomID).emit('game-finished',{
                    board:roomFactory.getRoomBoardGame(roomID).board,
                    winner:roomFactory.getRoomPlayer2Username(roomID)
                });
            }
            else{
                // let currentPlayerTurn=roomFactory.getCurrentRoomPlayerTurn(roomID);
                io.in(''+roomID).emit('tictactoe-game',{
                    board:roomFactory.getRoomBoardGame(roomID).board,
                    currentTurn:roomFactory.getCurrentRoomPlayerUsernameTurn(roomID)
                });
            }   
        }
    });

    socket.on('rematch',()=>{

    });

    socket.on('disconnect',()=>{
        console.log('disconnected!!!');
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
    });
});

server.listen(PORT,()=>{
    console.log('liseting...');
})








