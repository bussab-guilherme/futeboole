import React from 'react';
import { Link } from 'react-router-dom'; 
import logoFuteboole from '../assets/logo_futeboole.png';


function Header() {
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 50px',
        backgroundColor: '#38b6ff',
        color: 'white',
        
    };

    const logoStyle = {
        height: '120px',
        width: 'auto',
    };

    return (
        <header style={headerStyle}>
            <img src={logoFuteboole} alt="Logo" style={logoStyle} />
        </header>
    );
}

export default Header;
