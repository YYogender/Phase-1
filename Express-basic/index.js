const express=require('express');
const app=express();
const port=3000;
app.use(express.json());
const users=[];

app.post('/signup',(req,res)=>{
    const {name,email,password}=req.body;

    const exist = users.find(u=>u.name === name);
    if(exist)
        {
            return res.send('name already exist !');
        } 

    users.push({name:name,email:email,password:password});
    res.status(200).json({
        msg:'account created'
    });
});

app.get('/login',(req,res)=>{
    const {name,password}=req.headers;
    const exist=users.find(u=>u.name === name && u.password === password);
    if(exist)
    {
        return res.send(exist.email);
    }

    res.send('inavalid');
})

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});
