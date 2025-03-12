const mongoose = require('mongoose')

async function connectdb()
{
    try
    {
        await mongoose.connect('mongodb+srv://yogender:ZD8C3DbnTEhO0TRS@cluster0.rctln.mongodb.net/');
        console.log('connected to db');
    }
    catch(err)
    {
        console.log('failed to connect');
    }
}

connectdb()

const todoschema = new mongoose.Schema({
title:String,
done:Boolean
});

const userschema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    todo:[todoschema]
});

const User = mongoose.model('User',userschema);

module.exports={User};