import React from 'react';
import Title from '../Home/Title/Title';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <header className="sticky-top">
      <Title text="Chat N' Play" height="150px" fontSize="5em"/>
    </header>
    <h1>404 - Seite nicht gefunden!</h1>
    <Link to="/">
      Zur Startseite
    </Link>
  </div>
);

export default NotFound;