const isAuthenticated=(sessionStorage)=>{
    return (req,res,next)=>{
        const cookieAuth=req.cookies.sessionID;
        // console.log(cookieAuth);
        const isCookieAuth=sessionStorage.sessionExist(cookieAuth);
        console.log('session exsists'+isCookieAuth+'sessionid!:'+cookieAuth+'data'+JSON.stringify(sessionStorage.getSession(cookieAuth)));
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

const existentRoom = (roomFactory) => {
    return (req,res,next)=>{
        const existentRoom=roomFactory.roomExist(req.cookies.roomID);

        if(!existentRoom){
            // false room does not exist
            req.existentRoom=existentRoom;
            next();
        }
        else{
            // room exist
            req.existentRoom=existentRoom;
            next();
        }
    };
};

const redirect=(req,res,next)=>{
    const url=req.originalUrl;
    if(url=='/' && req.isAuth && req.existentRoom==true){
        res.redirect('http://localhost:3000/'+req.cookies.roomID);
    }
    else if(url!='/' && !req.isAuth){
        res.redirect('http://localhost:3000/');
    }
    else if(url!='/' && req.isAuth && req.existentRoom==false){
        res.redirect('http://localhost:3000/');
    }
    else{
        next();
    }
}

module.exports={isAuthenticated,redirect,existentRoom}



