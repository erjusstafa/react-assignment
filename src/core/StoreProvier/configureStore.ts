import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { rootReducer } from 'src/core/rootReducer';
import { callApi } from 'src/core/callApi';

// Redux dev tools
let devTools = f => f;

const enableReduxDevtools =
  (process as any).browser &&
  process.env.NODE_ENV !== 'production' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__;

if (enableReduxDevtools) {
  devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__();
}

export const configureStore = (initialState = {}) =>
  createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk.withExtraArgument(callApi)), devTools)
  );
