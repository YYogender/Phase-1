const mongoose = require('mongoose');

async function dbconnect() {
    try {
        await mongoose.connect('mongodb+srv://yogender:ZD8C3DbnTEhO0TRS@cluster0.rctln.mongodb.net/', {
        });
        console.log('Connected to DB');
    } catch (err) {
        console.error('Failed to connect:', err);
    }
}

dbconnect();

const todoschema = new mongoose.Schema({
    title: { type: String, required: true },
    done: { type: Boolean, default: false }
});

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    todo: [todoschema]
});

const User = mongoose.model('User', userschema);

module.exports = { User };
