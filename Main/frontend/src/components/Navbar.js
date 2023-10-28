import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faWrench } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <FontAwesomeIcon icon={faHome} />
        </li>
        <li className="nav-item">
          <FontAwesomeIcon icon={faFolder} />
        </li>
        <li className="nav-item">
          <FontAwesomeIcon icon={faWrench} />
        </li>
      </ul>
      <div className="navbar-brand">
        <a href="/" className="navbar-logo">
          CLOST|R
        </a>
      </div>
    </nav>
  );
}

export default Navbar;

/*
 <div className="column" id="column-1">
            <PatientForm />
          </div>

          <div className="column" id="column-2">
            <BtnCentro />
          </div>

          <div className="column" id="column-3">
            <Resultado />
          </div>*/ 
