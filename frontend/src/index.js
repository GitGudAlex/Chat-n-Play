import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

import './index.css';
import '../src/fonts/coffeeteademo.woff';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { fdatasyncSync } from 'fs';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
