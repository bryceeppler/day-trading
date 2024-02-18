const mongoose = require('mongoose');
const base = require('./baseModel');

const UsersSchema = new mongoose.Schema({
    user_name: { type: String, required: true, unqiue: true },
    password: { type: String, required: true, unique: false },
    name: { type: String, required: true, unique: false },
    balance: { type: Number, required: true, min: [0, "balance must be non-negative"], default: 0 }
})

const User = mongoose.model(base.COLLECTIONS.USER, UsersSchema);

module.exports = User;