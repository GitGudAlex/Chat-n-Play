import React from 'react';
import Title from '../Home/Title/Title';
import { Link } from 'react-router-dom';

import './PageNotFound.css'

const NotFound = () => (
  <div className="background">
    <header className="sticky-top">
      <Title text="Chat N' Play" height="100px" fontSize="5em"/>
    </header>
    <h2 id="error-message">404 - Seite nicht gefunden!</h2>
    <Link to="/">
      <div className='d-flex justify-content-center'>
        <button type="button" className="btn btn-dark btn-lg"> Zur Startseite</button>
      </div>
    </Link>
  </div>
);

export default NotFound;