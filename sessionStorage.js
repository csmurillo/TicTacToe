class UserSessionStorage {
    
    constructor(){
        this.userSessionStorage=new Map();
    }

    saveSession(sessionID,sessionInfo){
        this.userSessionStorage.set(sessionID,sessionInfo);
    }
    
    getStorage(){
        return this.userSessionStorage;
    }

    getSession(sessionID){
        return this.userSessionStorage.get(sessionID);
    }

    sessionExist(sessionID){
        if(this.userSessionStorage.get(sessionID)){
            return true;
        }
        return false;
    }

}
// const userSession=()=>{
//     return new UserSessionStorage();
// };

module.exports = { UserSessionStorage }


