import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { FiltersRibbon, TopRibbon } from './Ribbons';
import { HeaderPropTypes } from 'src/interfaces/iproptypes';

const drawerWidth = 195;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    zIndex: 500,
    position: 'fixed',
    backgroundColor: 'white',
  },
  content: {
    [theme.breakpoints.up(900)]: {
      paddingLeft: drawerWidth + theme.spacing(3.5),
      transition: theme.transitions.create('padding', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  contentShift: {
    [theme.breakpoints.up(900)]: {
      paddingLeft: theme.spacing(8),
      transition: theme.transitions.create('padding', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
}));

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  resetFilter,
  getSearch,
  search,
  searchChange,
  logoutThunk,
  graph,
  user,
  isLoggedIn,
  setLoginModalOpen,
  setIsFilterChange,
  filterOpen,
  toggleDrawer,
  setFilteredListings,
  dashboardState,
  setdashboardState,
  openAlert,
  matches,
  filterApplied,
  handleMarketSidebarClick,
  sample,
  setSubscriptionModalOpen,
}: HeaderPropTypes) => {
  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, {
        [classes.content]: sidebarOpen,
        [classes.contentShift]: !sidebarOpen,
      })}
    >
      <Toolbar>
        {user && (
          <TopRibbon
            logoutThunk={logoutThunk}
            graph={graph}
            user={user}
            filterOpen={filterOpen}
            toggleDrawer={toggleDrawer}
            dashboardState={dashboardState}
            openAlert={openAlert}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            filterApplied={filterApplied}
            handleMarketSidebarClick={handleMarketSidebarClick}
            sample={sample}
            setSubscriptionModalOpen={setSubscriptionModalOpen}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  resetFilter: PropTypes.func,
  getSearch: PropTypes.func,
  searchChange: PropTypes.func,
  logoutThunk: PropTypes.func,
};

export default Header;
