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
            room:roomFactory.getUserRoom(socket.userID),
            connected:true
        }
    );

    // join session
    socket.on('join-session',()=>{
        const roomID = roomFactory.joinRoom(socket.userID);

        console.log('joinsesh'+roomID);

        socket.emit('start-game-session',{
            sessionID:socket.sessionID,
            userID:socket.userID,
            username:socket.username,
            roomID:roomID,
            room:roomFactory.getUserRoom(socket.userID),
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

    // game session
    socket.on('game-session',()=>{
        let roomID=roomFactory.getUserRoomID(socket.userID);
        let room=roomFactory.getUserRoom(socket.userID);
        let player1=room.player1;
        let player2=room.player2;
        socket.join(''+roomID);
        if(player1&&player2){
            // game in progress
            io.in(''+roomID).emit('game',{
                sessionID:socket.sessionID,
                userID:socket.userID,
                username:socket.username,
                roomID:roomFactory.getUserRoomID(socket.userID),
                room:roomFactory.getUserRoom(socket.userID),
                connected:true
            });

        }   
        else{
            socket.emit('loading-game',{
                loading:'loading'
            });
        }     
    });
    // game start
    socket.on('board-game',()=>{

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


