import React,{useState,useEffect} from 'react';
import '../styles/Alert.css';
const {ipcRenderer} = window.require('electron');

const Alert = () => {
    const [alertValue, setAlertValue] = useState("");
    useEffect(() => {
        ipcRenderer.on('item:error' , (e, err)=>{
            setAlertValue(err);
        })

        setTimeout(()=>{
            setAlertValue("");
        },5000)
    }, [alertValue])

    const clickHandler = () => {
        setAlertValue("");
    }

    if(alertValue!==""){
        return (
            <div className="alertBackground">
                <div className="alert">
                    <span onClick={clickHandler} className="alert-cross">
                        <i className="fas fa-times"></i>
                    </span>
                    {alertValue}
                </div>
            </div>
        )
    }else{
        return <></>
    }
}

export default Alert
