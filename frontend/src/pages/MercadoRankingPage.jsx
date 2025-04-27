import React from 'react';
import Page from '../containers/Page';
import Block from '../containers/Block';
import Button from '../containers/Button';
import Footer from '../containers/Footer';
import Header from '../containers/PageHeader';
import Mercado from '../components/Mercado';
import Ranking from '../components/Ranking';
import { useState } from 'react';


function MercadoRankingPage() {
  const [mostrar, setMostrar] = useState('mercado'); // "mercado" ou "ranking"

  return (
    <Page>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gap: '20px' }}>
          <Button onClick={() => setMostrar('mercado')}>Mercado</Button>
          <Button onClick={() => setMostrar('ranking')}>Ranking</Button>
        </div>

        {mostrar === 'mercado' && <Mercado />}
        {mostrar === 'ranking' && <Ranking />}
    </Page>
  );
}

export default MercadoRankingPage;
