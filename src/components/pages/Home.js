import React from 'react';
import logo from '../../logo.svg';
import '../styles/Home.css';
const {ipcRenderer} = window.require('electron');
//const {ipcRenderer} = electron;

const Home = () => {

    const click = ()=>{
        ipcRenderer.send('item:add', 'addValue');
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button onClick={click}>click me</button>
            </header>
        </div>
    );
};

export default Home;
