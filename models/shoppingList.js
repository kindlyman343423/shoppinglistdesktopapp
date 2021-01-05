const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingList = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('shoppingList', shoppingList);