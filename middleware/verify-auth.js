const isAuthenticated=(sessionStorage)=>{
    return (req,res,next)=>{
        const cookieAuth=req.cookies.sessionID;
        console.log(cookieAuth);
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
const redirect=(req,res,next)=>{
    const url=req.originalUrl;
    
    if(req.isAuth && url=='/'){
        res.redirect('http://localhost:3000/other');
    }
    else if(!req.isAuth && url=='/other/') {
        res.redirect('http://localhost:3000/');
    }
    else{
        next();
    }
}
module.exports={isAuthenticated,redirect}

