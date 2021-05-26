const express=require('express');
const app=express();
const path=require('path');

app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'./views'));
app.use(express.static(path.join(__dirname,'./static')));

app.get('/',(req,res)=>{
    res.render('pages/index');
});
app.get('/room/:id',(req,res)=>{
    res.render('pages/tictactoe');
});

const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`PORT is ${port}`);
});
