import React from "react";
import './Mercado.css';
import Block from "../containers/Block";
import Page from "../containers/Page";


function Mercado() {
    
    return (
        <Page>
            <h1>Mercado</h1>
            <Block style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <div className='fade-in'>
                    <p>Olá!</p>
                </div>
            </Block>
        </Page>
    );
}
export default Mercado;