const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/test";
const shoppingList = require('../models/shoppingList');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// function to add the values in the backend
function addNewShoppingListItem(item){
    if(item===null || item===''){
        return {
            err: 'Null of Empty item',
            status: 405
        };
    }
    const newItem = new shoppingList({
        name: item
    })
    return newItem.save();
}

// function to get all the shopping list items
function getAllTheShoppingListItems(){
    return shoppingList.find({});
}

// clear all the items
function deleteAllItems(){
    return shoppingList.remove({});
}

// delete the selected items
function deleteSelectedItem(name){
    return shoppingList.deleteOne({"name": name});
}

module.exports = {
    addNewShoppingListItem,
    getAllTheShoppingListItems,
    deleteAllItems,
    deleteSelectedItem
}