const express = require('express')
const app = express();
const port = 3000;
const cors = require('cors')
const auth = require('./auth.js')
const {User} = require('./db.js')
const z = require('zod')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key ="1234";

app.use(express.json());
app.use(cors());

const signupzod = z.object({
name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
    password: z.string().min(5, { message: 'Password must be at least 5 characters' })
});

app.post('/signup',async (req,res)=>{
    try
    {
        const {name,email,password} = signupzod.parse(req.body);
        const userexist = await User.findOne({email});
        if(userexist)
        {
            return res.status(401).json({
                msg:'email already exist'
            });
        }

        const hashpassword = await bcrypt.hash(password,10);
        await User.create(
        {name,email,password:hashpassword,todo:[]}
        );

        res.status(200).json({
            msg:"account created"
        });
        console.log("account created");
    }
    catch(err)
    {
        if(err instanceof z.ZodError)
        {
            return res.status(400).json({ msg: 'Invalid signup data', errors: err.errors });
        }
        else
        {
            console.error('Signup server error:', err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
});

const loginzod = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(5, { message: 'Invalid password' })
});

app.post('/login',async (req,res)=>{
    try
    {
        const {email,password} = loginzod.parse(req.body);
        const userexist = await User.findOne({email});
        if(!userexist)
        {
            return res.status(401).json({
                msg:'user not found'
            });
        }

        const ismatch = await bcrypt.compare(password,userexist.password);
        if(!ismatch)
        {
            return res.status(402).json({
                msg:'invalid password'
            });
        }

        const token = jwt.sign({email},key);
        res.status(200).json({
            token
        });
    }
    catch(err)
    {
        if (err instanceof z.ZodError)
        {
            return res.status(400).json({
                msg:'Invalid login data', errors: err.errors
            });
        }
        console.error('Login server error:', err);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

app.get('/fetchtodo',auth,async(req,res)=>{
    try
    {
        const email = req.email;
        const userexist = await User.findOne({email});
        if(!userexist)
        {
            return res.status(402).json({
                msg:'user does not exist'
            });
        }

        res.status(200).json({
            todo:userexist.todo
        });
    }
    catch(err)
    {
        console.error('Error fetching todos:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

const titlezod = z.object({
    title: z.string().min(1, { message: 'Title is required' })
});

app.post('/addtodo',auth,async(req,res)=>{
    try
    {
        const {title} = titlezod.parse(req.body);
        const email = req.email;
        const userexist = await User.findOne({email});
        if(!userexist)
        {
            return res.status(402).json({
                msg:'user does not exist'
            });
        }

        await User.findOneAndUpdate(
            {email:req.email},
            {$push:{todo:{title,done:false}}},
            {new:true}
        );

        res.status(200).json({
            msg:'todo added successfully'
        });
    }
    catch(err)
    {
        if (err instanceof z.ZodError)
        {
            return res.status(400).json({ 
                msg: 'Invalid todo data', errors: err.errors
            });
        }
        console.error('Error adding todo:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

app.delete('/deletetodo/:id',auth,async(req,res)=>{
    try
    {
        const email = req.email;
        const {id} = req.params;
        const userexist = await User.findOne({email});
        if(!userexist)
        {
            return res.status(402).json({
                msg:'user does not exist'
            });
        }

        await User.findOneAndUpdate(//......
            {email:req.email},
            {$pull:{todo:{_id:id}}},
            {new:true}
        );
        res.status(200).json({ msg: 'Todo deleted successfully' });
    }
    catch(err)
    {
        console.error('Error deleting todo:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

app.put('/markdone/:id',auth,async(req,res)=>{
    try
    {
        const {id} = req.params;
        const email = req.email;
        const userexist = await User.findOne({email});
        if(!userexist)
        {
            return res.status(402).json({
                msg:'user does not exist'
            });
        }

        await User.findOneAndUpdate( //.....
            {email:req.email,"todo._id": id},
            {$set:{"todo.$.done": true}},
            {new:true}
        );
        res.status(200).json({ msg: 'Todo marked as done' });
    }
    catch(err)
    {
        console.error('Error updating todo:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});