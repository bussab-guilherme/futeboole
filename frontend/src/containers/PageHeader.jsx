import React from 'react';

const headerStyle = {
    fontSize: '1.7rem',
    fontWeight: 'bold',
    color: '#e4e4e4',
    marginBottom: '20px',
    padding: '1px',
};

function PageHeader({ title }) {
  return (
    <header style={headerStyle}>
      <h1>{title}</h1>
    </header>
  );
}

export default PageHeader;