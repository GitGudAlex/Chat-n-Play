import React from 'react';
import '../Ludo.css';

function House(props){

    let first;
    let second;
    let third;
    let fourth; 

    switch (props.position) {
        case "top-right": 
            first = 101;
            second = 102;
            third = 103;
            fourth = 104;
            break;
        case "top-left": 
            first = 113;
            second = 114;
            third = 115;
            fourth = 116;
            break;
        case "bottom-right": 
            first = 105;
            second = 106;
            third = 107;
            fourth = 108;
            break;
        case "bottom-left": 
            first = 109;
            second = 110;
            third = 111;
            fourth = 112;
            break;
      }

    return(
        <div> 
            <button id = {first} disabled style = {{'backgroundColor': props.color}} className= "house"></button>
            <button id = {second} disabled style = {{'backgroundColor': props.color}} className = "house"></button>
            <button id = {third} disabled style = {{'backgroundColor': props.color}} className = "house"></button>
            <button id = {fourth} disabled style = {{'backgroundColor': props.color}} className = "house"></button>
        </div>
    )
}

export default House;

