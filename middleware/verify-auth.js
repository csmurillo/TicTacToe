const isAuthenticated=(sessionStorage)=>{
    return (req,res,next)=>{
        const cookieAuth=req.cookies.sessionID;
        // console.log(cookieAuth);
        const isCookieAuth=sessionStorage.sessionExist(cookieAuth);
        if(isCookieAuth){
            req.isAuth=true;
            next();
        }
        else{
            req.isAuth=false;
            next();
        }
    };
};

const existentRoom = (sessionStorage) => {
    return (req,res,next)=>{
        console.log('inside existent room');
        const sessionID=req.cookies.sessionID;
        const session=sessionStorage.getSession(sessionID);
        console.log(session+'what is this');
        if(session){
            const room = session.room;
            req.room=room;
            console.log('has something'+room);
        }
        next();
    };
};

const redirect=(req,res,next)=>{
    const url=req.originalUrl;
    if(req.isAuth && url=='/'){
        res.redirect('http://localhost:3000/'+req.room);
    }
    else if(!req.isAuth && url!='/') {
        res.redirect('http://localhost:3000/');
    }
    else{
        next();
    }
}
module.exports={isAuthenticated,redirect,existentRoom}
