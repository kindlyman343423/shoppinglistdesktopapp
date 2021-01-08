import React,{useEffect,useState} from 'react';
import '../styles/Home.css';
import ShoppingList from '../common/ShoppingList';
import Alert from '../common/Alert';

const Home = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        window.api.receive('item:add', (item)=>{
            if(Array.isArray(item) && item.length>0){
                const arr = item.map(val => {
                    return val._doc.name;
                })
                setList(() =>([...list,...arr]));
            }else{
                setList(() =>([...list,item]));
            }
        })
        window.api.receive('item:clear',()=>{
            setList([]);
        })

    }, [list])

    // function to delete the selected item
    const deleteSelected = (item) => {
        window.api.send('item:clearSelected', item);
        setList(list.filter((val)=>{
            return val!==item;
        }))
    }

    return (
        <>
            <Alert />
            <div className="Home">
                <h1>Shopping List</h1>
                <ol className="shoppingList">
                    <ShoppingList list={list} deleteSelected={deleteSelected}/>
                </ol>
            </div>
        </>
    );
};

export default Home;
