import React from 'react';

const Footer = () => {
  return (
    <footer
      className="page-footer light-blue darken-4 white-text"
      style={{
        position: 'fixed',
        bottom: '0',
        width: '100%',
        padding: '5px 0',
        fontSize: '10px',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="container center-align">
        <span>
          2025 &copy; All rights reserved by{' '}
          <a
            href="https://www.healthcare.in"
            className="white-text"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            www.healthcare.in
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
