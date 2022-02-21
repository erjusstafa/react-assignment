import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import { theme } from './theme';

const MuiThemeProvider = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

MuiThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MuiThemeProvider;
