import { render } from 'solid-js/web';

import './global/app';
import './global/app.css';

import AppHome from './components/app-home/app-home';

const root = document.getElementById('app');

if (!root) {
  throw new Error('App root not found.');
}

render(() => <AppHome />, root);
