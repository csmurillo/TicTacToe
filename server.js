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

// set middlewares
app.use(cookieParser());
app.use(express.static('public'));
app.use('/images', express.static('public/images'))
app.use('/css', express.static('public/css'))

// set ejs
app.use(expressLayouts);
app.set('views', './public/views');
app.set('view engine','ejs');

const {isAuthenticated,redirect} = require('./middleware/verify-auth');

// set routes
app.get('',isAuthenticated(sessionStorage),redirect,(req,res)=>{
    res.render('index.ejs');
});

app.get('/other',isAuthenticated(sessionStorage),redirect,(req,res)=>{
    res.render('other.ejs');
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
    console.log('a user connected'+socket.id);

    // save session
    sessionStorage.saveSession(
        socket.sessionID,
        {
            userID:socket.userID,
            username:socket.username,
            connected:true
        }
    );

    // emit session details
    socket.emit('session',{
        sessionID:socket.sessionID,
        userID:socket.userID,
        username:socket.username,
        connected:true
    });

    socket.on('disconnect',()=>{
        console.log('disconnected!!!');
        // save session
        sessionStorage.saveSession(
            socket.sessionID,
            {
                userID:socket.userID,
                username:socket.username,
                connected:false
            }
        );
    });

});

server.listen(PORT,()=>{
    console.log('liseting...');
})



