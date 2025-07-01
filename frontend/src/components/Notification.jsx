import React from 'react';
import './Votacao.css'; // Usaremos o mesmo CSS por simplicidade

function Notification({ message, type }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`notification notification-${type}`}>
      {message}
    </div>
  );
}

export default Notification;