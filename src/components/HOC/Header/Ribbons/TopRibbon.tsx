import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

import {
  Grid,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Link,
  Button,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@mui/icons-material/Add';

import { InfoTooltip } from '../../Tooltips';
import { TooltipCard } from '../../Cards';
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_LIGHT,
  COLOR_PRIMARY,
  COLOR_RED,
  COLOR_RED_LIGHT,
  COLOR_BLACK,
  RoutesMap,
} from 'src/const';
import { TopRibbonPropTypes } from 'src/interfaces/iproptypes';
import userIcon from '../../../assets/userIcon.png';
import logoMobile from '../../../assets/logoMobile.jpg';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.down(900)]: {
      display: 'none',
    },
  },
  avatar: {
    width: 56,
    height: 56,
    cursor: 'pointer',
    [theme.breakpoints.down(900)]: {
      width: 46,
      height: 46,
    },
  },
  chip: {
    marginTop: 4,
  },
  search: {
    '& input': {
      fontWeight: 500,
    },
  },
  customButtonActive: {
    background: COLOR_PRIMARY_DARK, //`radial-gradient(circle, hsla(189, 96%, 29%, 1) 0%, hsla(178, 100%, 38%, 1) 100%);`,
    borderRadius: 5,
    border: 0,
    color: 'white',
    height: 40,
    padding: '0 15px',
    boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
    '&:hover': {
      background: COLOR_PRIMARY_LIGHT,
    },
    [theme.breakpoints.down(900)]: {
      display: 'none',
    },
  },
  customButton: {
    background: COLOR_RED,
    borderRadius: 5,
    border: 0,
    color: 'white',
    height: 40,
    padding: '0 15px',
    boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
    '&:hover': {
      background: COLOR_RED_LIGHT,
    },
    [theme.breakpoints.down(1090)]: {
      fontSize: 12,
      '&:first-child': {
        marginLeft: -50,
      },
    },
    [theme.breakpoints.down(900)]: {
      display: 'none',
    },
  },
  logoMobile: {
    width: '9rem',
    height: 38,
    [theme.breakpoints.down(370)]: {
      width: '6rem',
      height: 30,
    },
  },
  mobileHeader: {
    [theme.breakpoints.up(900)]: {
      display: 'none',
    },
  },
  menuIcon: {
    color: COLOR_PRIMARY_DARK,
    fontSize: '3rem',
  },
  filterIconActive: {
    color: COLOR_PRIMARY_DARK,
    fontSize: '2rem',
  },
  filterIcon: {
    color: COLOR_RED,
    fontSize: '2rem',
  },
  creditsText: {
    color: COLOR_PRIMARY,
    fontSize: '1rem',
    marginRight: '20px',
    cursor: 'pointer',
  },
  iconButton: {
    padding: 3,
  },
  addCreditsBtn: {
    fontSize: 20,
    color: COLOR_PRIMARY_DARK,
    display: 'inline-block',
    marginBottom: '3px',
  },
}));

const TopRibbon = ({
  logoutThunk,
  graph,
  user,
  filterOpen,
  toggleDrawer,
  dashboardState,
  openAlert,
  sidebarOpen,
  setSidebarOpen,
  filterApplied,
  handleMarketSidebarClick,
  sample,
  setSubscriptionModalOpen,
}: TopRibbonPropTypes) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleClick = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutThunk();
    history.push(RoutesMap.Home);
  };

  const openSettings = () => {
    handleMarketSidebarClick('settings');
  };

  let userName = user && user.userName;
  if (!userName) {
    userName = 'Trial';
  }

  const handleSubscriptionModalOpen = () => {
    setSubscriptionModalOpen(true);
  };

  return (
    <>
      <Grid
        item
        container
        spacing={4}
        justify="flex-end"
        alignItems="center"
        className={classes.container}
      >
        <InfoTooltip
          title={<TooltipCard content="It gives access to one market dashboard per credit." />}
        >
          <Typography variant="caption" color="textPrimary" className={classes.creditsText}>
            {' '}
            Search Credits: {user.credits}{' '}
            <IconButton className={classes.iconButton} onClick={handleSubscriptionModalOpen}>
              <AddIcon className={classes.addCreditsBtn} />
            </IconButton>
          </Typography>
        </InfoTooltip>

        {!filterOpen &&
          (dashboardState.showOverviewDashboard || dashboardState.showPricingDashboard) && (
            <Button
              id="filterButton"
              className={clsx(classes.customButtonActive, {
                [classes.customButtonActive]: dashboardState.showOverviewDashboard && filterApplied,
                [classes.customButton]: dashboardState.showOverviewDashboard && !filterApplied,
              })}
              aria-label="open drawer"
              onClick={toggleDrawer}
            >
              <FilterListIcon />
              {dashboardState.showPricingDashboard ? 'Create CompSet' : 'Filters'}
            </Button>
          )}

        <Grid item>
          <Avatar className={classes.avatar} onClick={handleClick} src={userIcon}></Avatar>

          <Menu
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={openSettings}>Settings</MenuItem>
            <MenuItem>
              <Link
                href="https://support.airbtics.com/"
                target="_blank"
                style={{ textDecoration: 'none', color: COLOR_BLACK }}
              >
                FAQ
              </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* Mobile UI */}
      <Grid
        item
        container
        justify="space-between"
        alignItems="center"
        className={classes.mobileHeader}
      >
        <Button onClick={() => setSidebarOpen(true)}>
          <MenuIcon className={classes.menuIcon} />
        </Button>

        <Button>
          <img src={logoMobile} className={classes.logoMobile} />
        </Button>

        {!filterOpen && dashboardState.showOverviewDashboard && (
          <Button id="filterButtonMobile" aria-label="open drawer" onClick={toggleDrawer}>
            <FilterListIcon
              className={clsx(classes.filterIconActive, {
                [classes.filterIconActive]: dashboardState.showOverviewDashboard && filterApplied,
                [classes.filterIcon]: dashboardState.showOverviewDashboard && !filterApplied,
              })}
            />
          </Button>
        )}

        <Grid item>
          <Avatar className={classes.avatar} onClick={handleClick} src={userIcon}></Avatar>

          <Menu
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={openSettings}>Settings</MenuItem>
            <MenuItem>
              <Link
                href="https://support.airbtics.com/"
                target="_blank"
                style={{ textDecoration: 'none', color: COLOR_BLACK }}
              >
                FAQ
              </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </>
  );
};

export default TopRibbon;

// disabled
/*
{!sample &&  (
  <Grid item>
    <Link
      href="https://app.airbtics.com/"
      target="_blank"
      style={{ textDecoration: 'none' }}
    >
      <Button
        className={classes.customButton}
        style={{ background: COLOR_PRIMARY_LIGHT, color: COLOR_PRIMARY_DARK }}
      >
        aaa
      </Button>
    </Link>
  </Grid>
)}*/
