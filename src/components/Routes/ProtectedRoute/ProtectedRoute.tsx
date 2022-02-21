import React from 'react';
import { Route } from 'react-router-dom';

const ProtectedRoute = ({ getTokenThunk, ...rest }) => {
  const isLoggedIn = Boolean(getTokenThunk());
  return <Route {...rest} />;
};

export default ProtectedRoute;
