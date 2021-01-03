import React, { useState } from 'react';
import '../styles/Add.css';
const {ipcRenderer} = window.require('electron');

const Add = () => {
    const [itemName, setItemName] = useState('');

    const inputHandler = (e) => {
        setItemName(e.target.value);
    }

    // sending values to main.js
    const submitHandler = (e) => {
        e.preventDefault();
        ipcRenderer.send('item:add', itemName);
        setItemName("");
    };

    return (
        <div className="addScreen">
            <h2>Add Item</h2>
            <form onSubmit={submitHandler}>
                <input 
                    type="text" 
                    value={itemName}
                    onChange={inputHandler}
                    className="input" 
                    autoFocus/>
                <br/>
                <button type="submit" className="submitButton">
                    Add
                </button>
            </form>
        </div>
    );
};

export default Add;
