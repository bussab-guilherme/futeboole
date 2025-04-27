import React from 'react';

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: '20px',
};

function Page({ children }) {
  return (
    <div style={pageStyle}>
      {children}
    </div>
  );
}

export default Page;