socket.on("connect_error", (err) => {
    if(err.message=='usernameExist'){
        const usernameError= document.getElementById('username-error');
        const inputUsername= document.getElementById('username');
        inputUsername.style.border="2px solid red";
        inputUsername.style.borderRadius="5px";
        usernameError.innerHTML="Username exists";
        usernameError.style.color="red";
        usernameError.style.fontSize="12px";
    }
    console.log('-----------------------------------------------------------------------------');
    console.log(err.message); // prints the message associated with the error
    console.log('client error client error client error client error client error client error');
    console.log('client error client error client error client error client error client error');
    console.log('-----------------------------------------------------------------------------');
});