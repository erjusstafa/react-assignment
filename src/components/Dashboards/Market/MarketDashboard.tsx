import React, { useCallback, useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import { Modal, Container, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { DashboardState, Listing } from '../../../interfaces/idashboard';
import { DashboardPropTypes, FilterVal } from '../../../interfaces/iproptypes';
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';

import { OverviewDashboard } from '../Market/Pages';
import { InfoTooltip } from '../../HOC/Tooltips';
import { getFilteredListings, titleCase } from 'src/utils';
import { Login, Register } from '../../Modals';
import { FiltersRibbon } from '../../HOC/Header/Ribbons';
import { Header, Sidebar, Filter } from '../../HOC';
import { TooltipCard } from '../../HOC/Cards';
import '../Dashboard.scss';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_LIGHT,
  LIGHT_GREY,
  DARK_GREY,
  BACKGROUND_COLOR,
} from 'src/const';
import { callApi } from 'src/core/callApi';

const drawerWidth = 195;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: BACKGROUND_COLOR,
      boxShadow: `inset 0px 5px 10px 0px ${DARK_GREY}`,
    },
    content: {
      [theme.breakpoints.up(900)]: {
        paddingLeft: drawerWidth + theme.spacing(2),
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
    container: {
      paddingTop: theme.spacing(15),
      [theme.breakpoints.down(900)]: {
        paddingTop: theme.spacing(15),
      },
      paddingBottom: theme.spacing(6),
    },
    paperModal: {
      position: 'absolute',
      backgroundColor: BACKGROUND_COLOR,
      padding: theme.spacing(8),
      borderRadius: '70px',
      [theme.breakpoints.up('xs')]: {
        width: 340,
      },
      [theme.breakpoints.up('sm')]: {
        width: 530,
      },
      [theme.breakpoints.up('lg')]: {
        width: 650,
      },
    },
    signupModal: {
      position: 'absolute',
      [theme.breakpoints.up('xs')]: {
        width: 340,
      },
      [theme.breakpoints.up('sm')]: {
        width: 530,
      },
      [theme.breakpoints.up('lg')]: {
        width: 650,
      },
      height: 620,
      backgroundColor: LIGHT_GREY,
      borderRadius: 10,
      //border: '2px solid #000',
      //boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    warningModal: {
      position: 'absolute',
      backgroundColor: BACKGROUND_COLOR,
      padding: theme.spacing(4),
      borderRadius: 10,
      [theme.breakpoints.up('xs')]: {
        width: 300,
      },
    },
    customButton: {
      background: COLOR_PRIMARY_DARK,
      borderRadius: 5,
      border: 70,
      color: 'white',
      height: 45,
      padding: '0 15px',
      boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
      '&:hover': {
        background: COLOR_PRIMARY_LIGHT,
      },
    },
    customButtonReversed: {
      background: BACKGROUND_COLOR,
      borderRadius: 5,
      border: 70,
      color: COLOR_PRIMARY_DARK,
      height: 45,
      padding: '0 15px',
      boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
      '&:hover': {
        background: COLOR_PRIMARY_LIGHT,
      },
    },
    creditsText: {
      color: COLOR_PRIMARY,
      fontSize: '1rem',
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
  })
);

// consts
const setMarketingTrackingURL =
  'https://4b5jgzfm05.execute-api.us-east-2.amazonaws.com/default/setMarketingTracking';

const MarketDashboard = ({
  setVisibleListings,
  getMarkersLoadEnd,
  getMarkers,
  listings,
  vrboListings,
  visibleListings,
  visibleVRBOListings,
  multipleMarkersCallLoading,
  search,
  user,
  getSearch,
  searchChange,
  resetFilter,
  getTokenThunk,
  getUserInfo,
  getVRBOMarkers,
  setVisibleVRBOListings,
  isUserAllowed,
}: DashboardPropTypes) => {
  const classes = useStyles();
  const isLoggedIn = Boolean(getTokenThunk());
  const location = useLocation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(900));

  // url params
  let { country, city, district, source, isSample, isTailored, id, settings } = useParams<{
    country: string;
    city: string;
    district: string;
    source: string;
    isSample: string;
    isTailored: string;
    id: string;
    settings: string;
  }>();

  // query params
  const searchParams = location.search;
  const langQuery = new URLSearchParams(searchParams).get('lang') || '';
  const pageQuery = new URLSearchParams(searchParams).get('page') || '';
  const typeQuery = new URLSearchParams(searchParams).get('type') || '';
  const regionQuery = new URLSearchParams(searchParams).get('region') || '';

  console.log('IS USER ALLOWED [DASHBOARD] ', isUserAllowed);

  // declarations
  const [landing, setLanding] = useState('investing');
  const getDistrictInfoURL = `https://9flsw98863.execute-api.us-east-2.amazonaws.com/default/getDistrictInfo?district=${district}&city=${city}&country=${country}`;
  const states = require('us-state-codes');
  const cityName =
    search.data.countryCode == 'US' || country == 'united-states'
      ? states.getStateNameByStateCode(city)
      : search.data.city;
  const [isFilterChange, setIsFilterChange] = useState(true);
  const [sample, setSample] = useState(true);
  let totalNumberOfListings = 0;
  const [boundedListings, setBoundedListings] = useState([] as Listing[]);
  const [filteredListings, setFilteredListings] = useState([] as Listing[]);
  const [dynamicTrigger, setDynamicTrigger] = useState(false);
  const [filterVal, setFilterVal] = useState({
    roomType: 'entire_home',
    bedrooms: [1, 3],
    bathrooms: [1, 3],
    accommodates: [4, 8],
    minimum_nights: [1, 30],
    hostType: {
      independent: true,
      professional: true,
    },
    amenities: {
      pool: false,
      hot_tub: false,
      all: true,
    },
  } as FilterVal);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupPage, setSignupPage] = React.useState(true);
  const [dashboardState, setdashboardState] = React.useState({
    showOverviewDashboard: true,
    showGuestsDashboard: false,
    showRevenueDashboard: false,
    showPricingDashboard: false,
    showEstimatorDashboard: false,
    showInsightsDashboard: false,
    showSettingsDashboard: false,
  } as DashboardState);
  const [selectedSidebarIndex, setSelectedSidebarIndex] = useState(0);
  let isAdmin = user && user.role && user.role === 'admin' ? true : false;
  const [openAlert, setOpenAlert] = React.useState(true);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [showSearchCreditDeductWarningModal, setShowSearchCreditDeductWarningModal] = useState(
    false
  );
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [overviewDashboardMode, setOverviewDashboardMode] = useState({
    showInvesting: true,
    showRentalArbitrage: false,
  });
  const [showVideo, setShowVideo] = useState(false);

  // analytics

  useEffect(() => {
    if (pageQuery && !isLoggedIn) {
      callApi(
        setMarketingTrackingURL,
        {
          queryParams: {
            page: pageQuery,
          },
        },
        false
      );
    }
  }, []);

  // get district info
  useEffect(() => {
    if (country && city && district) {
      setSample(false);
      try {
        setIsFilterChange(false);
        axios.get(getDistrictInfoURL).then(res => {
          let districtObj = res.data.message;

          let newSearchObj = {
            name: districtObj['name'],
            lat: districtObj['lat'],
            lng: districtObj['lng'],
            polygon: districtObj['polygon'],
            multiPolygon: districtObj['multiPolygon'],
            city: districtObj['city'],
            country: districtObj['country'],
            countryCode: districtObj['countryCode'],
            bounds: districtObj['bounds'],
            isTailoredRegion: false,
          };
          searchChange({ ...search, data: { ...search.data, ...newSearchObj } });
          getSearch();
          resetFilter();
        });
      } catch (error) {
        console.log('Unhandled error while calling getDistrictInfo ', error);
      }
    }

    if (
      (source && source === 'homepage') ||
      (!country &&
        !city &&
        !district &&
        !isTailored &&
        !isSample &&
        !source &&
        !location.pathname.includes('airbnb-calculator'))
    ) {
      setLoginModalOpen(true);
    }

    if (settings && settings === 'settings') {
      handleMarketSidebarClick('settings');
    }
  }, []);

  // api calls
  useEffect(() => {
    if (!country && !city && !district) {
      getMarkers();
    }
  }, [getMarkers]);

  useEffect(() => {
    if (!country && !city && !district) {
      getVRBOMarkers();
    }
  }, [getVRBOMarkers]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, getMarkers]);

  // route checks
  useEffect(() => {
    if (location.pathname.includes('airbnb-calculator')) {
      setLanding('estimator');
      handleMarketSidebarClick('estimator');
      handleSidebarListItemClick(1);
    }
  }, [location]);

  // dashboard logic
  const applyFilter = useCallback(() => {
    setDynamicTrigger(true);
    setTimeout(() => {
      setDynamicTrigger(false);
    }, 500);

    setFilterVal((e: FilterVal) => {
      if (!visibleListings.loading) {
        const tempFilteredListings = getFilteredListings(listings.data, e);
        setFilteredListings(tempFilteredListings);

        let tempVisibleListings: Listing[] = [];
        setBoundedListings((e: Listing[]) => {
          if (e.length > 0)
            tempVisibleListings = tempFilteredListings.filter(value => e.includes(value));
          else {
            tempVisibleListings = tempFilteredListings.filter(value =>
              listings.data.includes(value)
            );
          }
          setVisibleListings(tempVisibleListings);
          return e;
        });
      }
      return e;
    });
  }, [visibleListings]);

  const redirectToLoginPage = () => {
    setSignupPage(false);
  };

  const redirectToSignupPage = () => {
    setSignupPage(true);
  };

  const handleMarketSidebarClick = (event: string) => {
    let emptyState = {
      showOverviewDashboard: false,
      showGuestsDashboard: false,
      showRevenueDashboard: false,
      showPricingDashboard: false,
      showEstimatorDashboard: false,
      showInsightsDashboard: false,
      showSettingsDashboard: false,
    };

    if (event === 'main') {
      emptyState['showOverviewDashboard'] = true;
    }

    setdashboardState(emptyState);
  };

  const handleSidebarListItemClick = (index: number) => {
    setSelectedSidebarIndex(index);
  };

  useEffect(() => {
    if (!isUserAllowed && isLoggedIn && user.credits === 0) {
      setSubscriptionModalOpen(true);
    } else setSubscriptionModalOpen(false);
  }, [isUserAllowed, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user.credits > 0) {
      setShowSearchCreditDeductWarningModal(true);
    }
  }, [isLoggedIn, user.credits]);

  if (!visibleListings.loading) {
    totalNumberOfListings = visibleListings.data.length;
  }

  const toggleDrawer = () => {
    setFilterOpen(!filterOpen);
  };

  if (!country) {
    country = '';
  }

  const redirectToBrightPricing = () => {
    window.location.href = 'https://app.airbtics.com/pricing/';
  };

  const toggleOverviewDashboardMode = (event: string) => {
    let emptyMode = {
      showInvesting: false,
      showRentalArbitrage: false,
    };

    if (event === 'investing') {
      emptyMode['showInvesting'] = true;
    }
    if (event === 'rentalArbitrage') {
      emptyMode['showRentalArbitrage'] = true;
    }
    setOverviewDashboardMode(emptyMode);
  };

  // Product Walkthrough
  const handleVideoClose = useCallback(() => {
    setShowVideo(false);
    window.location.reload();
  }, []);

  const showTutorial = useCallback(() => {
    if (user.userDescription !== 'property_manager') toggleOverviewDashboardMode('investing');
    setShowVideo(false);
  }, []);

  return (
    <>
      {/* title and meta tags */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {!visibleListings.loading
            ? isFilterChange
              ? `Airbnb Data on ${visibleListings.data.length} listings in ${titleCase(
                  search.data.name
                )} | Airbtics | ${search.data.country}, ${cityName}`
              : `Airbnb Data on ${visibleListings.data.length} listings in ${titleCase(
                  district
                )} | Airbtics | ${titleCase(country.replaceAll('-', ' '))}, ${cityName}`
            : isFilterChange
            ? `Airbnb Data on listings in ${titleCase(search.data.name)} | Airbtics | ${
                search.data.country
              }, ${cityName}`
            : `Airbnb Data on listings in ${titleCase(district)} | Airbtics | ${titleCase(
                country.replaceAll('-', ' ')
              )}, ${cityName}`}
        </title>
      </Helmet>

      <Header
        isLoggedIn={isLoggedIn}
        setLoginModalOpen={setLoginModalOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setIsFilterChange={setIsFilterChange}
        filterOpen={filterOpen}
        toggleDrawer={toggleDrawer}
        setFilteredListings={setFilteredListings}
        dashboardState={dashboardState}
        setdashboardState={setdashboardState}
        openAlert={openAlert}
        matches={matches}
        filterApplied={filterApplied}
        handleMarketSidebarClick={handleMarketSidebarClick}
        sample={sample}
        setSubscriptionModalOpen={setSubscriptionModalOpen}
      />

      <Sidebar
        parent="market"
        handleMarketSidebarClick={handleMarketSidebarClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        matches={matches}
        selectedSidebarIndex={selectedSidebarIndex}
        handleSidebarListItemClick={handleSidebarListItemClick}
      />

      <Filter
        listings={visibleListings}
        isDisabled={!isUserAllowed}
        filterVal={filterVal}
        setFilterVal={setFilterVal}
        applyFilter={applyFilter}
        open={filterOpen}
        toggleDrawer={toggleDrawer}
        dashboardState={dashboardState}
        matches={matches}
        setFilterApplied={setFilterApplied}
        setSubscriptionModalOpen={setSubscriptionModalOpen}
      />

      <main
        className={clsx(classes.root, {
          [classes.content]: sidebarOpen,
          [classes.contentShift]: !sidebarOpen,
        })}
      >
        <Container className={classes.container}>
          {matches &&
            !dashboardState.showSettingsDashboard &&
            !dashboardState.showEstimatorDashboard && (
              <FiltersRibbon
                resetFilter={resetFilter}
                search={search}
                getSearch={getSearch}
                searchChange={searchChange}
                isLoggedIn={isLoggedIn}
                setLoginModalOpen={setLoginModalOpen}
                setIsFilterChange={setIsFilterChange}
                setFilteredListings={setFilteredListings}
                setdashboardState={setdashboardState}
                matches={matches}
              />
            )}

          {matches && (
            <InfoTooltip
              title={<TooltipCard content="It gives access to one market dashboard per credit." />}
            >
              <Typography variant="caption" color="textPrimary" className={classes.creditsText}>
                {' '}
                Search Credits: {user.credits}{' '}
                <IconButton
                  className={classes.iconButton}
                  onClick={() => setSubscriptionModalOpen(true)}
                >
                  <AddIcon className={classes.addCreditsBtn} />
                </IconButton>
                <br />
                <br />
              </Typography>
            </InfoTooltip>
          )}

          {dashboardState.showOverviewDashboard && (
            <OverviewDashboard
              search={search}
              isUserAllowed={isUserAllowed}
              isAdmin={isAdmin}
              listings={listings}
              vrboListings={vrboListings}
              multipleMarkersCallLoading={multipleMarkersCallLoading}
              titleCase={titleCase}
              visibleListings={visibleListings}
              sample={sample}
              dashboardState={dashboardState}
              openAlert={openAlert}
              setOpenAlert={setOpenAlert}
              setBoundedListings={setBoundedListings}
              setFilteredListings={setFilteredListings}
              setVisibleListings={setVisibleListings}
              visibleVRBOListings={visibleVRBOListings}
              setVisibleVRBOListings={setVisibleVRBOListings}
              matches={matches}
              filterApplied={filterApplied}
              getMarkersLoadEnd={getMarkersLoadEnd}
              dynamicTrigger={dynamicTrigger}
              setDynamicTrigger={setDynamicTrigger}
              setSubscriptionModalOpen={setSubscriptionModalOpen}
              overviewDashboardMode={overviewDashboardMode}
              toggleOverviewDashboardMode={toggleOverviewDashboardMode}
            />
          )}
        </Container>
      </main>

      <div>
        <Modal
          open={loginModalOpen && !isLoggedIn}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
          >
            <div className={`${classes.signupModal} modal-custom`}>
              {signupPage ? (
                <Register
                  redirectToLoginPage={redirectToLoginPage}
                  setShowVideo={setShowVideo}
                  getUserInfo={getUserInfo}
                  lang={langQuery}
                  page={pageQuery}
                  type={typeQuery}
                  region={regionQuery}
                  landing={landing}
                  device={matches ? 'mobile' : 'desktop'}
                />
              ) : (
                <Login redirectToSignupPage={redirectToSignupPage} />
              )}
            </div>
          </Grid>
        </Modal>
      </div>

      <div>
        {user && user.userDescription !== 'Trial' && (
          <Modal
            open={showVideo}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '100vh' }}
            >
              <div className={`${classes.paperModal} modal-custom`}>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  style={{ marginTop: 20 }}
                >
                  <Typography variant="h6" style={{ fontSize: 25 }}>
                    Welcome to Airbtics!👋
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  style={{ marginTop: 15, marginBottom: 30 }}
                >
                  <Typography variant="subtitle1">
                    Be the short-term rental expert!👍{' '}
                    {user && user.userDescription === 'property_manager'
                      ? `Your Airbnb Pricing Sorted 👍 We'll guide you through our product so that you can easily 1) turn on dynamic pricing 2) create a competitor set 3) see market insights.`
                      : `We'll guide you through our product so that you can easily simulate metrics like cap rate and cash return.`}
                  </Typography>
                </Grid>

                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  style={{ marginTop: 50, marginBottom: 20 }}
                >
                  <Button className={classes.customButtonReversed} onClick={handleVideoClose}>
                    Later
                  </Button>
                  <Button className={classes.customButton} onClick={showTutorial}>
                    Let's go!
                  </Button>
                </Grid>
              </div>
            </Grid>
          </Modal>
        )}
      </div>

      <div>
        {user && user.userDescription !== 'Trial' && (
          <Modal
            open={!isUserAllowed && showSearchCreditDeductWarningModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '100vh' }}
            >
              <div className={`${classes.warningModal} modal-custom`}>
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                  style={{ marginBottom: 30 }}
                >
                  <Typography variant="subtitle1">Would you like to unlock this market?</Typography>
                </Grid>

                <Grid container direction="row" justify="space-evenly" alignItems="center">
                  <Button
                    className={classes.customButtonReversed}
                    onClick={() => setShowSearchCreditDeductWarningModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={classes.customButton}
                    onClick={() => {
                      setShowSearchCreditDeductWarningModal(false);
                      getMarkers(true);
                      window.location.reload();
                    }}
                  >
                    Confirm
                  </Button>
                </Grid>
              </div>
            </Grid>
          </Modal>
        )}
      </div>
    </>
  );
};

MarketDashboard.propTypes = {
  getMarkers: PropTypes.func,
  getGraphData: PropTypes.func,
  getSearch: PropTypes.func,
  searchChange: PropTypes.func,
  resetFilter: PropTypes.func,
  getTokenThunk: PropTypes.func,
  getUserInfo: PropTypes.func,
  getStatsPerADR: PropTypes.func,
  getReviewStream: PropTypes.func,
  getBookingChanges: PropTypes.func,
};

export default MarketDashboard;
