import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './core/serviceWorker';
import './index.scss';
import { hotjar } from 'react-hotjar';
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: 'GTM-MQQ6MJ9',
};

ReactDOM.render(<App />, document.getElementById('root'));
hotjar.initialize(1926311, 6);
TagManager.initialize(tagManagerArgs);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
