import React,{useEffect,useState} from 'react';
import '../styles/Home.css';
import ShoppingList from '../common/ShoppingList';
const {ipcRenderer} = window.require('electron');

const Home = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        ipcRenderer.on('item:add', (e, item)=>{
            setList(() =>([...list,item]));
        })

        ipcRenderer.on('item:clear', ()=>{
            setList([]);
        })
    }, [list])

    // function to delete the selected item
    const deleteSelected = (item) => {
        setList(list.filter((val)=>{
            return val!==item;
        }))
    }

    return (
        <div className="Home">
            <h1>Shopping List</h1>
            <ol className="shoppingList">
                <ShoppingList list={list} deleteSelected={deleteSelected}/>
            </ol>
        </div>
    );
};

export default Home;
