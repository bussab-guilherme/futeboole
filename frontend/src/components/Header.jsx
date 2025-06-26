import React from 'react';
import { Link } from 'react-router-dom'; 
import logoFuteboole from '../assets/logo_futeboole.png';
import { useEffect } from "react"

function Header() {
    useEffect(() => {
      fetch("/api/users/profile", {
        method: "GET",
        credentials: "include"
      }).then((res) => {
        if (!res.ok) {
          window.location.href = "/login"
        } else {
        res.json().then(data => {
            const match = data.match(/Hello, (.+?)\. This is your profile\./);
            const userId = match ? match[1] : null;
        });
        }
      })
      }, [])
    
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px  50px',
        backgroundColor: '#38b6ff',
        color: 'white',
    };

    const logoStyle = {
        height: '200px',
        width:'200px',
        objectFit: 'cover',
        objectPosition:'center'
        
    };

    return (
        <header style={headerStyle}>
            <img src={logoFuteboole} alt="Logo" style={logoStyle} />
        </header>
    );
}

export default Header;
