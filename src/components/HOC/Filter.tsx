import React, { useState, useEffect, useCallback, useMemo } from 'react';

import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormGroup,
  MenuItem,
  InputLabel,
  Theme,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Checkbox,
} from '@material-ui/core';
import { Slider, Box } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_LIGHT,
  BACKGROUND_COLOR,
  COLOR_ACCENT_1,
} from 'src/const';
import { FilterVal } from 'src/interfaces/iproptypes';
import { TooltipCard } from './Cards';
import InfoTooltip from './Tooltips/InfoTooltip';
import { infoIconStyle } from '../Dashboards/Market/styles/style';

const RIPPLE_SIZE = 100;
const RIPPLE_COLOR = COLOR_ACCENT_1;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 'auto',
    width: 'auto',
    background: BACKGROUND_COLOR,
  },
  filterContainer: {
    width: 'auto',
    padding: 20,
    [theme.breakpoints.down(900)]: {
      width: 300,
    },
  },
  selectObjInv: {
    width: 500,
    [theme.breakpoints.down(900)]: {
      width: 220,
      marginBottom: 20,
      marginRight: 0,
    },
  },
  selectObj: {
    width: 150,
    marginRight: 20,
    '&:last-child': {
      marginRight: 0,
    },
    [theme.breakpoints.down(900)]: {
      width: 220,
      marginBottom: 20,
      marginRight: 0,
    },
  },
  sliderObj: {
    width: 225,
    marginRight: 40,
    '&:last-child': {
      marginRight: 0,
    },
    [theme.breakpoints.down(900)]: {
      width: 220,
      marginBottom: 20,
      marginRight: 0,
    },
  },
  checkboxObj: {
    width: 490,
    [theme.breakpoints.down(900)]: {
      width: 220,
      marginBottom: 20,
    },
  },
  select: {
    '&:before': {
      borderColor: COLOR_PRIMARY,
    },
    '&:after': {
      borderColor: COLOR_PRIMARY,
    },
    '&:not(.Mui-disabled):hover::before': {
      borderColor: COLOR_PRIMARY,
    },
  },
  addFilterButton: {
    color: COLOR_PRIMARY_DARK,
    fontSize: 40,
  },
  paperModal: {
    backgroundColor: BACKGROUND_COLOR,
    width: 600,
    padding: theme.spacing(2),
  },
  mapContainer: {
    height: 400,
  },
  filterDivider: {
    width: 500,
    height: 3,
    background: COLOR_PRIMARY_DARK,
    margin: '10px 0',
    [theme.breakpoints.down(900)]: {
      width: 240,
    },
  },
  iconButton: {
    padding: 3,
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: -RIPPLE_SIZE / 2,
    marginLeft: -RIPPLE_SIZE / 2,
    width: RIPPLE_SIZE,
    height: RIPPLE_SIZE,
    animation: `$rippleAnimation 1000ms ${theme.transitions.easing.easeOut}`,
    animationIterationCount: 'infinite',
    opacity: 0,
    borderRadius: '50%',
    boxShadow: `0 0 6px 3px ${RIPPLE_COLOR}`,
  },
  '@keyframes rippleAnimation': {
    '0%': {
      transform: 'scale(0.1, 0.1)',
      opacity: 0,
    },
    '1%': {
      opacity: 1,
    },
    '50% ': {
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.2, 1.2)',
      opacity: 0,
    },
  },
}));

const buttonStyle = makeStyles((theme: Theme) => ({
  root: {
    background: COLOR_PRIMARY_DARK, //`radial-gradient(circle, hsla(189, 96%, 29%, 1) 0%, hsla(178, 100%, 38%, 1) 100%);`,
    borderRadius: 5,
    border: 0,
    color: 'white',
    padding: '10px 30px',
    boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
    '&:hover': {
      background: COLOR_PRIMARY_LIGHT,
    },
    fontSize: 18,
    marginLeft: 40,
    marginBottom: 20,
  },
  locationButton: {
    background: COLOR_PRIMARY_DARK, //`radial-gradient(circle, hsla(189, 96%, 29%, 1) 0%, hsla(178, 100%, 38%, 1) 100%);`,
    borderRadius: 5,
    border: 0,
    color: 'white',
    height: 40,
    width: 140,
    padding: '0 15px',
    boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
    '&:hover': {
      background: COLOR_PRIMARY_LIGHT,
    },
    marginLeft: 20,
  },
  modalButton: {
    background: COLOR_PRIMARY_DARK, //`radial-gradient(circle, hsla(189, 96%, 29%, 1) 0%, hsla(178, 100%, 38%, 1) 100%);`,
    borderRadius: 5,
    border: 0,
    color: 'white',
    height: 30,
    padding: '0 15px',
    boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
    '&:hover': {
      background: COLOR_PRIMARY_LIGHT,
    },
    display: 'flex',
    float: 'right',
  },
}));

const Filter = ({
  listings,
  isDisabled,
  filterVal,
  setFilterVal,
  applyFilter,
  open,
  toggleDrawer,
  dashboardState,
  matches,
  setFilterApplied,
  setSubscriptionModalOpen,
}) => {
  const buttonClass = buttonStyle();
  const classes = useStyles();

  const [hostTypeAlert, setHostTypeAlert] = useState(false);

  let columnTypes = {
    bedrooms: 'number',
    bathrooms: 'number',
    accommodates: 'number',
    room_type: 'dropdown',
    host_name: 'string',
    hostListingCount: 'number',
    minimum_nights: 'number',
  };

  // Room Types
  const roomTypesObj = dashboardState.showOverviewDashboard
    ? {
        entire_home: 'Entire House',
        condo: 'Apartment (Condo)',
        private_room: 'Private Room',
        shared_room: 'Shared Room',
        hotel_room: 'Hotel',
        all: 'Show all listings',
      }
    : {
        entire_home: 'Entire House',
        private_room: 'Private Room',
        shared_room: 'Shared Room',
        hotel_room: 'Hotel',
        all: 'Show all listings',
      };
  const handleRoomTypeChange = useCallback((event: SelectChangeEvent) => {
    setFilterVal((filterVal: FilterVal) => {
      return { ...filterVal, roomType: event.target.value };
    });
  }, []);

  // Bedrooms & Bathrooms
  const bedroomsAndBathroomsMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 6,
      label: '6+',
    },
  ];
  const handleBedroomsChange = (event: Event, newValue: number | number[]) => {
    setFilterVal((filterVal: FilterVal) => {
      return { ...filterVal, bedrooms: newValue as number[] };
    });
  };
  const handleBathroomsChange = (event: Event, newValue: number | number[]) => {
    setFilterVal((filterVal: FilterVal) => {
      return { ...filterVal, bathrooms: newValue as number[] };
    });
  };

  // Minimum Nights
  const handleMinimumNightsChange = (event: Event, newValue: number | number[]) => {
    setFilterVal((filterVal: FilterVal) => {
      return { ...filterVal, minimum_nights: newValue as number[] };
    });
  };
  const minimumNightsMarks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 30,
      label: '30+',
    },
  ];

  // Accomodates
  const handleAccomodatesChange = (event: Event, newValue: number | number[]) => {
    setFilterVal((filterVal: FilterVal) => {
      return { ...filterVal, accommodates: newValue as number[] };
    });
  };
  const accomodatesMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 16,
      label: '16',
    },
  ];

  // Host Type
  const handleHostTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterVal((filterVal: FilterVal) => {
      return {
        ...filterVal,
        hostType: { ...filterVal.hostType, [event.target.name]: event.target.checked },
      };
    });
  };
  const { independent, professional } = filterVal.hostType;

  // Amenities
  const handleAmenitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterVal((filterVal: FilterVal) => {
      return {
        ...filterVal,
        amenities: { ...filterVal.amenities, [event.target.name]: event.target.checked },
      };
    });
  };
  const { pool, hot_tub, all } = filterVal.amenities;

  if (dashboardState.showPricingDashboard) {
    columnTypes = { ...columnTypes, ...{ coordinate: 'string' } };
  }

  const triggerFilter = () => {
    if (dashboardState.showOverviewDashboard) {
      if (filterVal.hostType.independent || filterVal.hostType.professional) {
        applyFilter();
        setFilterApplied(true);
        setHostTypeAlert(false);
      } else {
        setHostTypeAlert(true);
      }
    }
  };

  return (
    <>
      <Drawer variant="temporary" anchor="right" open={open} onClose={toggleDrawer}>
        <Grid container direction="column" id="filter" className={classes.root}>
          {/* Investment Dashboard Filter */}

          {dashboardState.showOverviewDashboard && (
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              className={classes.filterContainer}
            >
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.filterContainer}
                style={{ marginTop: -20 }}
              >
                <Typography variant="h5" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Filter
                </Typography>
                <Divider className={classes.filterDivider} />

                {dashboardState.showOverviewDashboard && hostTypeAlert && (
                  <Alert severity="error" style={{ marginTop: 10 }}>
                    Select at least one host-type
                  </Alert>
                )}
              </Grid>

              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.filterContainer}
              >
                <Grid item className={classes.selectObjInv}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="type">Type</InputLabel>
                    <Select
                      value={filterVal.roomType}
                      onChange={handleRoomTypeChange}
                      labelId="type"
                      id="type"
                      label="Type"
                      size="small"
                    >
                      {Object.keys(roomTypesObj).map((roomType, index) => (
                        <MenuItem key={index} value={`${roomType}`}>
                          {roomTypesObj[roomType]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.filterContainer}
              >
                <Box className={classes.sliderObj}>
                  <Typography color="textSecondary" gutterBottom>
                    Bedrooms
                  </Typography>
                  <Slider
                    size="small"
                    value={filterVal.bedrooms}
                    min={0}
                    max={6}
                    marks={bedroomsAndBathroomsMarks}
                    onChange={handleBedroomsChange}
                    valueLabelDisplay="auto"
                    sx={{
                      color: COLOR_PRIMARY,
                    }}
                  />
                </Box>

                <Box className={classes.sliderObj}>
                  <Typography color="textSecondary" gutterBottom>
                    Bathrooms
                  </Typography>
                  <Slider
                    size="small"
                    value={filterVal.bathrooms}
                    min={0}
                    max={6}
                    marks={bedroomsAndBathroomsMarks}
                    onChange={handleBathroomsChange}
                    valueLabelDisplay="auto"
                    sx={{
                      color: COLOR_PRIMARY,
                    }}
                  />
                </Box>
              </Grid>

              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.filterContainer}
              >
                <Box className={classes.sliderObj}>
                  <Typography color="textSecondary" gutterBottom>
                    Sleeps
                  </Typography>
                  <Slider
                    size="small"
                    value={filterVal.accommodates}
                    min={0}
                    max={16}
                    marks={accomodatesMarks}
                    onChange={handleAccomodatesChange}
                    valueLabelDisplay="auto"
                    sx={{
                      color: COLOR_PRIMARY,
                    }}
                  />
                </Box>

                <Box className={classes.sliderObj}>
                  <Typography color="textSecondary" gutterBottom>
                    Minimum Stay
                  </Typography>
                  <Slider
                    size="small"
                    value={filterVal.minimum_nights}
                    min={1}
                    max={30}
                    marks={minimumNightsMarks}
                    onChange={handleMinimumNightsChange}
                    valueLabelDisplay="auto"
                    sx={{
                      color: COLOR_PRIMARY,
                    }}
                  />
                </Box>
              </Grid>

              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.filterContainer}
              >
                <Grid item className={classes.sliderObj}>
                  <FormControl component="fieldset" variant="outlined" size="small">
                    <FormLabel component="legend">
                      Host Type{' '}
                      <InfoTooltip
                        title={
                          <TooltipCard content="We assume a host is an independent host if the host has less than 5 listings." />
                        }
                      >
                        <IconButton className={classes.iconButton}>
                          <InfoOutlinedIcon style={infoIconStyle} />
                        </IconButton>
                      </InfoTooltip>
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={independent}
                            onChange={handleHostTypeChange}
                            name="independent"
                            style={{ color: COLOR_PRIMARY }}
                          />
                        }
                        label="Independent"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={professional}
                            onChange={handleHostTypeChange}
                            name="professional"
                            style={{ color: COLOR_PRIMARY }}
                          />
                        }
                        label="Professional"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>

                <Grid item className={classes.sliderObj}>
                  <FormControl component="fieldset" variant="outlined" size="small">
                    <FormLabel component="legend">
                      Amenities{' '}
                      <InfoTooltip
                        title={
                          <TooltipCard content="If you check for a specific amenity, you will only see listings that have that amenity." />
                        }
                      >
                        <IconButton className={classes.iconButton}>
                          <InfoOutlinedIcon style={infoIconStyle} />
                        </IconButton>
                      </InfoTooltip>
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={pool}
                            onChange={handleAmenitiesChange}
                            name="pool"
                            style={{ color: COLOR_PRIMARY }}
                          />
                        }
                        label="Pool"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={hot_tub}
                            onChange={handleAmenitiesChange}
                            name="hot_tub"
                            style={{ color: COLOR_PRIMARY }}
                          />
                        }
                        label="Hottub"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={all}
                            onChange={handleAmenitiesChange}
                            name="all"
                            style={{ color: COLOR_PRIMARY }}
                          />
                        }
                        label="Show all listings"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            // className={classes.filterContainer}
          >
            <Grid item>
              {!isDisabled ? (
                <Button
                  id="filterUpdateBtn"
                  className={buttonClass.root}
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={triggerFilter}
                >
                  {dashboardState.showPricingDashboard ? 'Create CompSet' : 'Update'}
                </Button>
              ) : listings.loading ? (
                <CircularProgress size={27} />
              ) : (
                <Tooltip
                  title={
                    dashboardState.showPricingDashboard
                      ? 'Subscribe now to create CompSets'
                      : 'Subscribe now to unlock this dashboard'
                  }
                >
                  <Button
                    className={buttonClass.root}
                    size="large"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSubscriptionModalOpen(true);
                    }}
                  >
                    <LockSharpIcon style={{ fontSize: 22 }} />
                    Subscribe
                  </Button>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default Filter;
