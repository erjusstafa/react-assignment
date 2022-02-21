import React, { useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Grid,
  Menu,
  MenuItem,
  Link,
  Avatar,
  Typography,
  IconButton,
} from '@material-ui/core';

import userIcon from '../../assets/userIcon.png';
import { RoutesMap, COLOR_BLACK, COLOR_PRIMARY } from 'src/const';
import { PricingHeaderPropTypes } from 'src/interfaces/iproptypes';

const drawerWidth = 195;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    zIndex: 500,
    position: 'fixed',
    background: 'white',
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
  avatar: {
    width: 56,
    height: 56,
    cursor: 'pointer',
    [theme.breakpoints.down(900)]: {
      width: 46,
      height: 46,
    },
  },
  trialText: {
    color: COLOR_PRIMARY,
    fontSize: '1rem',
    marginRight: '20px',
  },
}));

const PricingHeader = ({ sidebarOpen, logoutThunk, user }: PricingHeaderPropTypes) => {
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

  let daysLeftForTrial = 0;
  if (user.userSignUpDay) {
    const trialBeginsAt = new Date(user.userSignUpDay);
    const now = new Date();
    const daysSinceUserSignedUp = Math.ceil(
      (now.getTime() - trialBeginsAt.getTime()) / (1000 * 3600 * 24)
    );
    daysLeftForTrial = 31 - daysSinceUserSignedUp;
  }

  return (
    <AppBar
      className={clsx(classes.root, {
        [classes.content]: sidebarOpen,
        [classes.contentShift]: !sidebarOpen,
      })}
    >
      <Toolbar>
        <Grid item container spacing={4} justifyContent="flex-end" alignItems="center">
          <Typography variant="caption" color="textPrimary" className={classes.trialText}>
            {daysLeftForTrial > 0 ? daysLeftForTrial : 0} days left for trial
          </Typography>

          <Grid item>
            <Avatar className={classes.avatar} onClick={handleClick} src={userIcon}></Avatar>

            <Menu
              anchorEl={anchorEl}
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
      </Toolbar>
    </AppBar>
  );
};

export default PricingHeader;
