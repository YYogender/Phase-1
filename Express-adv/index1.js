const express=require('express');
const jwt=require('jsonwebtoken');
const app=express();
const port=3000;
const key="1234";

app.use(express.json());

const users=[];


function auth(req,res,next)
{
    const token=req.headers.authorization;
    const decode=jwt.verify(token,key);
    const finduser=users.find(u=>u.name===decode.name);
    if(finduser)
    {
        req.name=decode.name;
        next();
    }
    else
    {
        res.status(401).json({
            msg:'invalid token !'
        });
    }
}

app.post('/signup',(req,res)=>{
    const {name,password,number}=req.body;
    const exist=users.find(u=>u.name===name)
    
    if(exist)
    {
        return res.send('name already exist !');
    }

    users.push({name:name,password:password,number:number});
    res.status(200).json({
        msg:'account created'
    });

});


app.post('/login',(req,res)=>{
    const {name,password}=req.body;
    const exist=users.find(u=>u.name===name && u.password===password);
    if(exist)
    {
        const token=jwt.sign({name},key);
        res.status(200).json({
            msg:token
        });
    }
    else
    {
        res.send('can not find user !');
    }
});

app.get('/me',auth,(req,res)=>{
    const name=req.name;

    const exist=users.find(u=>u.name===name);
    if(exist)
    {
        res.status(200).json({
            msg:exist.number
        });
    }
    else
    {
        res.send('not exist !');
    }
});

app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
});