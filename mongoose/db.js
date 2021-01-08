const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/test";
const shoppingList = require('../models/shoppingList');
let CONNECTION = false;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
.then(()=>{
    CONNECTION=true;
})
.catch(err => 
    console.log("!!! Error while connecting please check your mongodb service")
);

const db = mongoose.connection;
db.on('error', console.error.bind('Connection error:'))

// function to add the values in the backend
function addNewShoppingListItem(item){
    if(item===null || item===''){
        return new Promise((resolve,reject)=>{
            reject(405);
        })
    }
    if(!CONNECTION){
        return new Promise((resolve,reject)=>{
            reject(502);
        })
    }
    const newItem = new shoppingList({
        name: item
    })
    return newItem.save();
}

// function to get all the shopping list items
function getAllTheShoppingListItems(){
    if(!CONNECTION){
        return new Promise((resolve,reject)=>{
            reject(502);
        })
    }
    return shoppingList.find({});
}

// clear all the items
function deleteAllItems(){
    if(!CONNECTION){
        return new Promise((resolve,reject)=>{
            reject(502);
        })
    }
    return shoppingList.remove({});
}

// delete the selected items
function deleteSelectedItem(name){
    if(!CONNECTION){
        return new Promise((resolve,reject)=>{
            reject(502);
        })
    }
    return shoppingList.deleteOne({"name": name});
}

module.exports = {
    addNewShoppingListItem,
    getAllTheShoppingListItems,
    deleteAllItems,
    deleteSelectedItem
}