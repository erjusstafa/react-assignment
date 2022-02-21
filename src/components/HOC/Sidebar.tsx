import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { COLOR_PRIMARY_DARK } from 'src/const';
import logo from '../assets/logo.svg';
import logoMini from '../assets/logoMini.svg';
import brightPricingLogo from '../assets/brightPricingLogo.png';
import brightPricingLogoMini from '../assets/brightPricingLogoMini.png';
import leftArrow1 from '../assets/leftArrow1.svg';
import rightArrow1 from '../assets/rightArrow1.svg';
import { SidebarProps } from 'src/interfaces/iproptypes';
import { InfoTooltip } from './Tooltips';
import { TooltipCard } from './Cards';

import { Drawer, List, Icon, Link, Button, Typography, Divider } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TrendingUpSharpIcon from '@material-ui/icons/TrendingUpSharp';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  logoButton: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  logo: {
    width: 160,
    height: 50,
  },
  logoMini: {
    paddingLeft: 10,
    paddingTop: 10,
    width: 50,
    height: 50,
  },
  toolbarLogoMini: {
    paddingTop: 10,
    width: 40,
    height: 40,
  },
  hide: {
    display: 'none',
  },
  paperDrawer: {
    backgroundColor: COLOR_PRIMARY_DARK,
    position: 'fixed',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: 195,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(8),
    [theme.breakpoints.down(900)]: {
      display: 'none',
    },
  },
  switch: {
    position: 'fixed',
    top: theme.spacing(8),
    left: theme.spacing(22) + 4,
    zIndex: 5000,
    cursor: 'pointer',
    fontSize: 30,
    filter: 'drop-shadow(0px 1px 2px #000000)',
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  switchClosed: {
    position: 'fixed',
    top: theme.spacing(8),
    left: theme.spacing(6),
    zIndex: 5000,
    cursor: 'pointer',
    fontSize: 30,
    filter: 'drop-shadow(0px 1px 2px #000000)',
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sideBar: {
    width: 195,
    paddingLeft: 20,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sidebarText: {
    fontSize: 16,
    paddingLeft: 20,
    color: '#ffffff',
  },
  toolbar: {
    width: 195,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  toolbarText: {
    fontSize: 16,
    color: '#ffffff',
  },
  divider: {
    background: '#fff',
    height: 2,
    marginTop: 5,
  },
}));

const Sidebar = ({
  parent,
  handleMarketSidebarClick,
  handlePricingSidebarClick,
  sidebarOpen,
  setSidebarOpen,
  matches,
  selectedSidebarIndex,
  handleSidebarListItemClick,
}: SidebarProps) => {
  const classes = useStyles();

  useEffect(() => {
    if (matches) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [matches]);

  const sideBarIconStyle = { fontSize: 25, color: '#ffffff', padding: '2 0' };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.paperDrawer, {
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen,
        }),
      }}
    >
      {/* Button */}
      {sidebarOpen ? (
        <Icon
          className={clsx({
            [classes.switch]: sidebarOpen,
            [classes.switchClosed]: !sidebarOpen,
          })}
          aria-label="open drawer"
          onClick={() => setSidebarOpen(false)}
        >
          <img src={leftArrow1} />
        </Icon>
      ) : (
        <Icon
          className={clsx({
            [classes.switch]: sidebarOpen,
            [classes.switchClosed]: !sidebarOpen,
          })}
          aria-label="open drawer"
          onClick={() => setSidebarOpen(true)}
        >
          <img src={rightArrow1} />
        </Icon>
      )}

      <Button
        className={classes.logoButton}
        onClick={() => {
          if (handleMarketSidebarClick) handleMarketSidebarClick('main');
          handleSidebarListItemClick(0);
        }}
      >
        {sidebarOpen ? (
          <img src={parent === 'market' ? logo : brightPricingLogo} className={classes.logo} />
        ) : (
          <img
            src={parent === 'market' ? logoMini : brightPricingLogoMini}
            className={classes.logoMini}
          />
        )}
      </Button>

      {/* Market */}
      {parent === 'market' && handleMarketSidebarClick && (
        <List disablePadding={false}>
          <ListItem
            button
            classes={{ root: classes.sideBar }}
            selected={selectedSidebarIndex === 0}
            onClick={() => {
              handleMarketSidebarClick('main');
              handleSidebarListItemClick(0);
              if (matches) {
                setSidebarOpen(false);
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon style={sideBarIconStyle} />
              <ListItemText classes={{ primary: classes.sidebarText }} primary="Investment" />
            </ListItemIcon>
          </ListItem>

          <InfoTooltip
            title={
              <TooltipCard content="Discover what a property could earn as a short-term rental" />
            }
            placement="left"
          >
            <ListItem
              id="estimatorBtn"
              button
              classes={{ root: classes.sideBar }}
              selected={selectedSidebarIndex === 1}
              onClick={() => {
                handleMarketSidebarClick('estimator');
                handleSidebarListItemClick(1);
                if (matches) {
                  setSidebarOpen(false);
                }
              }}
            >
              <ListItemIcon>
                <MonetizationOnIcon style={sideBarIconStyle} />
                <ListItemText classes={{ primary: classes.sidebarText }} primary="Estimator" />
              </ListItemIcon>
            </ListItem>
          </InfoTooltip>

          <InfoTooltip
            title={
              <TooltipCard content="Find out the supply and demand of various amenities and services. Identify highly profitable neighborhoods using heatmaps." />
            }
            placement="left"
          >
            <ListItem
              id="insightsBtn"
              button
              classes={{ root: classes.sideBar }}
              selected={selectedSidebarIndex === 2}
              onClick={() => {
                handleMarketSidebarClick('insights');
                handleSidebarListItemClick(2);
                if (matches) {
                  setSidebarOpen(false);
                }
              }}
            >
              <ListItemIcon>
                <InsightsIcon style={sideBarIconStyle} />
                <ListItemText classes={{ primary: classes.sidebarText }} primary="Insights" />
              </ListItemIcon>
            </ListItem>
          </InfoTooltip>

          <InfoTooltip
            title={<TooltipCard content="All the data you need to optimize your pricing." />}
            placement="left"
          >
            <ListItem
              id="compsetBtn"
              button
              classes={{ root: classes.sideBar }}
              selected={selectedSidebarIndex === 3}
              onClick={() => {
                handleMarketSidebarClick('pricing');
                handleSidebarListItemClick(3);
                if (matches) {
                  setSidebarOpen(false);
                }
              }}
            >
              <ListItemIcon>
                <TrendingUpSharpIcon style={sideBarIconStyle} />
                <ListItemText classes={{ primary: classes.sidebarText }} primary="CompSet" />
              </ListItemIcon>
            </ListItem>
          </InfoTooltip>

          <InfoTooltip
            title={
              <TooltipCard content="Analyze similar listings, future booking & pricing data in your market." />
            }
            placement="left"
          >
            <ListItem
              button
              classes={{ root: classes.sideBar }}
              selected={selectedSidebarIndex === 4}
              onClick={() => {
                handleMarketSidebarClick('guests');
                handleSidebarListItemClick(4);
                if (matches) {
                  setSidebarOpen(false);
                }
              }}
            >
              <ListItemIcon>
                <PeopleIcon style={sideBarIconStyle} />
                <ListItemText classes={{ primary: classes.sidebarText }} primary="Guests" />
              </ListItemIcon>
            </ListItem>
          </InfoTooltip>
        </List>
      )}

      {/* Pricing */}
      {parent === 'pricing' && handlePricingSidebarClick && (
        <List disablePadding={false}>
          <ListItem
            button
            classes={{ root: classes.sideBar }}
            selected={selectedSidebarIndex === 0}
            onClick={() => {
              handlePricingSidebarClick('listings');
              handleSidebarListItemClick(0);
              if (matches) {
                setSidebarOpen(false);
              }
              window.history.pushState({}, '', `/pricing`);
            }}
          >
            <ListItemIcon>
              <HomeIcon style={sideBarIconStyle} />
              <ListItemText classes={{ primary: classes.sidebarText }} primary="My Listings" />
            </ListItemIcon>
          </ListItem>
        </List>
      )}

      <List disablePadding={false} style={{ position: 'absolute', bottom: '0', left: '0' }}>
        <Divider className={classes.divider} style={{ marginTop: 10 }} />
        <Divider className={classes.divider} />

        <ListItem button classes={{ root: classes.toolbar }}>
          <Link
            href={
              parent === 'market' ? 'https://app.airbtics.com/pricing' : 'https://app.airbtics.com'
            }
            target="_blank"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItemIcon>
              <img
                src={parent === 'market' ? brightPricingLogoMini : logoMini}
                className={classes.toolbarLogoMini}
              />
              <ListItemText
                classes={{ primary: classes.sidebarText }}
                primary={parent === 'market' ? 'Dynamic Pricing' : 'Market Dashboard'}
              />
            </ListItemIcon>
          </Link>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
