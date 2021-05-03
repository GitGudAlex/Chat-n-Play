import React from 'react';
import '../Ludo.css';

function House(props){
    return(
        <div> 
        <button id = {props.first} className = {props.color}></button>
        <button id = {props.second} className = {props.color}></button>
        <button id = {props.third} className = {props.color}></button>
        <button id = {props.fourth} className = {props.color}></button>
    </div>
    )
}

export default House;

