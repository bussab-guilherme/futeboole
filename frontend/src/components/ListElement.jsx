import React from "react";
import './ListElement.css';

const listElementStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    font: '30px Arial, sans-serif',
    color: 'white', 
};

function ListElement({ name, position, pontos }) {

    return (
        <div style={listElementStyle}>{position}: {name} - {pontos}</div>
    );
}

export default ListElement;
