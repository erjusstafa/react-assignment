import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { configureStore } from 'src/core/StoreProvier/configureStore';

const store = configureStore({});

const StoreProvider = ({ children }) => <Provider store={store}>{children}</Provider>;

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export type AppDispatch = typeof store.dispatch;
export default StoreProvider;
