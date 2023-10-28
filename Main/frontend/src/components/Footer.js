import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faStopwatch, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <a href="/" className="footer-Add">
          <FontAwesomeIcon icon={faUserPlus} />
        </a>
      </div>
      <nav className="navbar">
        <ul className="footer-nav">
          <li className="footer-item">
            <FontAwesomeIcon icon={faDatabase} />
          </li>
          <li className="footer-item">
            <FontAwesomeIcon icon={faStopwatch} />
          </li>
          <li className="footer-item envelope">
          <a href="mailto:walidsabhi99@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
