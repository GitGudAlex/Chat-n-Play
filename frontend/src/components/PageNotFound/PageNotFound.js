import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <h1>404 - Seite nicht gefunden!</h1>
    <Link to="/">
      Zur Startseite
    </Link>
  </div>
);

export default NotFound;