import React from "react";
import ListElement from "./ListElement";
import Block from "../containers/Block";
import './Ranking.css';
import Page from "../containers/Page";




function Ranking() {
    
    
    const users = [
        { id: 1, name: "João", pontos: 10, acertos: 8 },
        { id: 2, name: "Maria", pontos: 8, acertos: 6 },
        { id: 3, name: "Pedro", pontos: 6, acertos: 4 },
        { id: 1, name: "João", pontos: 10, acertos: 8 },
        { id: 2, name: "Maria", pontos: 8, acertos: 6 },
        { id: 3, name: "Pedro", pontos: 6, acertos: 4 },{ id: 1, name: "João", pontos: 10, acertos: 8 },
        { id: 2, name: "Maria", pontos: 8, acertos: 6 },
        { id: 3, name: "Pedro", pontos: 6, acertos: 4 },{ id: 1, name: "João", pontos: 10, acertos: 8 },
        { id: 2, name: "Maria", pontos: 8, acertos: 6 },
        { id: 3, name: "Pedro", pontos: 6, acertos: 4 },
    ];
    const listItems = [
        ...users.map((user, index) => (
            <ListElement 
                key={`${user.id}-${index}`} 
                name={user.name} 
                pontos={user.pontos} 
                acertos={user.acertos} 
                position={index + 1} 
            />
        ))
    ];
    return (
        <Page>
            <h1>Ranking</h1>
            <Block style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <div className='rankingContainer fade-in'>
                    <ol style={{ listStyle: 'none', padding: 0 }}>
                        {listItems.map((item, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                {item}
                            </li>
                        ))}
                    </ol>
                </div>
            </Block>
        </Page>
    );
}
export default Ranking;