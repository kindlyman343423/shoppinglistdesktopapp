import React from 'react';
const { ipcRenderer } = window.require('electron');

const ShoppingList = ({ list, deleteSelected }) => {
    const addToList = () => {
        ipcRenderer.send('item:openAddWindow');
    };

    if (Array.isArray(list) && list.length > 0) {
        return list.map((item) => (
            <li key={item} className="listItem">
                <span
                    style={{ float: 'right',fontSize: '20px' }}
                    onClick={deleteSelected.bind(this, item)}
                >
                    <i className="far fa-times-circle"></i>
                </span>
                {item}
            </li>
        ));
    } else {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ padding: '30px' }}>
                    <i
                        className="fas fa-cart-plus fa-6x"
                        onClick={addToList}
                        style={{cursor: 'pointer'}}
                    ></i>
                </div>
            </div>
        );
    }
};

export default ShoppingList;
