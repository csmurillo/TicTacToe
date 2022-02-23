class UserSessionStorage {    
    constructor(){
        this.userSessionStorage=new Map();
    }
    saveSession(sessionID,sessionInfo){
        this.userSessionStorage.set(sessionID,sessionInfo);
    }
    removeSession(sessionID){
        console.log('session deleted'+sessionID);
        this.userSessionStorage.delete(sessionID);
    }
    getStorage(){
        return this.userSessionStorage;
    }
    getSession(sessionID){
        console.log('session retrieved'+sessionID);
        console.log('!,,,!'+this.userSessionStorage.get(sessionID)+'!,,,!');
        console.log('!((((((((((((((()))))))))))))))!');
        return this.userSessionStorage.get(sessionID);
    }
    sessionExist(sessionID){
        console.log('check sessionExist'+this.userSessionStorage.get(sessionID)+'~~~~');
        if(this.userSessionStorage.get(sessionID)){
            return true;
        }
        return false;
    }
}

module.exports = { UserSessionStorage }





