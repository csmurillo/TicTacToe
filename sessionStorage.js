class UserSessionStorage {    
    constructor(){
        this.userSessionStorage=new Map();
    }
    saveSession(sessionID,sessionInfo){
        this.userSessionStorage.set(sessionID,sessionInfo);
    }
    removeSession(sessionID){
        this.userSessionStorage.delete(sessionID);
    }
    getStorage(){
        return this.userSessionStorage;
    }
    getSession(sessionID){
        return this.userSessionStorage.get(sessionID);
    }
    getSessionID(userID){
        for (const [key, value] of  this.userSessionStorage.entries()) {
            if(value.userID==userID){
                return key;
            }
        }
        return null;
    }
    sessionExist(sessionID){
        if(this.userSessionStorage.get(sessionID)){
            return true;
        }
        return false;
    }
    userNameExist(username){
        for (const [key, value] of  this.userSessionStorage.entries()) {
            console.log(key, value.username);
            if(username.toLowerCase()==value.username.toLowerCase()){
                return true;
            }
        }
        return false;
    }
}
module.exports = { UserSessionStorage }



