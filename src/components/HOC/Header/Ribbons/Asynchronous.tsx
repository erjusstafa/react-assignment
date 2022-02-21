import React, { useCallback } from 'react';
import fetch from 'cross-fetch';
import lodash from 'lodash';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, IconButton } from '@material-ui/core';
import PinDropIcon from '@mui/icons-material/PinDrop';

import { COLOR_PRIMARY_LIGHT, COLOR_ACCENT_1, COLOR_PRIMARY } from 'src/const';
import { returnLoadingText } from 'src/utils';
import { SearchObject } from 'src/interfaces/idashboard';
import { SearchBarPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles({
  options: {
    '&:hover': {
      backgroundColor: COLOR_PRIMARY_LIGHT,
      fontColor: '#abcdef',
      textColor: '#abcdef',
    },
  },
  input: {
    color: '#000',
  },
});

const Asynchronous = ({
  getSearch,
  search,
  searchChange,
  showAlert,
  notShowAlert,
  resetFilter,
  isLoggedIn,
  setLoginModalOpen,
  setIsFilterChange,
  setFilteredListings,
  setdashboardState,
  matches,
}: SearchBarPropTypes) => {
  const styles = useStyles();

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([] as SearchObject[]);
  const [searchBarState, setSearchBarState] = React.useState('');
  const [loadingState, setLoadingState] = React.useState(false);

  const loading = open && loadingState;
  const emptySearchBar = open && searchBarState.length === 0;

  const history = useHistory();

  const handleSearchChange = useCallback((_, values) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    }

    if (!values) {
      return;
    }
    if (values.isDefaultOption) {
      history.push('/tailored/t');
      return;
    }

    let newObj = {
      name: values.name,
      lat: values.lat,
      lng: values.lng,
      polygon: values.polygon,
      multiPolygon: values.multiPolygon,
      country: values.country,
      countryCode: values.countryCode,
      city: values.city,
      bounds: values.bounds,
      isTailoredRegion: false,
    };

    let countryParam = values.country ? values.country.toLowerCase().replace(/ /g, '-') : '0';
    let cityParam = values.city ? values.city.toLowerCase() : '0';
    let districtParam = values.name.toLowerCase();
    if (isLoggedIn) {
      window.history.pushState(
        {},
        '',
        `/airbnb-data/${countryParam}/${cityParam}/${districtParam}`
      );
      window.location.reload();
      // setdashboardState({
      //   showOverviewDashboard: true,
      //   showGuestsDashboard: false,
      //   showRevenueDashboard: false,
      //   showPricingDashboard: false,
      //   showBenchmarkDashboard: false,
      // });
      // setIsFilterChange(true);
      // searchChange({ ...search, data: { ...search.data, ...newObj } });
      // getSearch();
      // setFilteredListings([]);
      // resetFilter();
    }
  }, []);

  const handleInputChange = useCallback(async (event, values) => {
    setSearchBarState(values);
    setLoadingState(true);
    let headers = new Headers({
      authorization: `Bearer ${localStorage.getItem('auth-token')}`,
      mode: 'cors',
    });
    //let apiTest = 'https://wnwvnwko88.execute-api.us-east-2.amazonaws.com/default/searchAutoCompleteTest?prefix='+values
    let api =
      'https://6s9ohv0u0g.execute-api.us-east-2.amazonaws.com/default/searchAutoComplete?prefix=' +
      values;
    let countries: { message: any } = {
      message: [],
    };
    try {
      const response = await fetch(api, { headers });
      //const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
      countries = await response.json();
    } catch (error) {}
    setLoadingState(false);

    if (countries && countries.message && countries.message.constructor === Array) {
      if (values.length > 0 && countries.message.length === 0) {
        showAlert();
      } else {
        notShowAlert();
      }

      let searchObjs: SearchObject[] = [];
      countries.message.forEach(function(item, index) {
        let districtName = item[0];
        let cityName = item[5];
        let countryName = item[6];
        let searchName = '';
        if (cityName && cityName != 0) {
          searchName = item[0] + ', ' + cityName + ' (' + countryName + ')';
        } else if (countryName && countryName != 0) {
          searchName = item[0] + ' (' + countryName + ')';
        } else {
          searchName = item[0];
        }
        searchObjs.push({
          searchName: searchName,
          name: item[0],
          lat: item[2],
          lng: item[1],
          polygon: item[3],
          multiPolygon: item[4],
          city: item[5],
          country: item[6],
          countryCode: item[8],
          bounds: item[9],
        });
      });
      !matches &&
        searchObjs.push({
          searchName: values,
          name: 'TailoredRegion',
          isDefaultOption: true,
        });

      setOptions(searchObjs);
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {})();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="search"
      open={open}
      style={{ paddingRight: 0, marginRight: 0 }}
      classes={{
        option: styles.options,
      }}
      onOpen={() => {
        setOpen(true);
        setOptions([
          {
            searchName: 'TailoredRegion',
            name: 'TailoredRegion',
            isDefaultOption: true,
          },
        ]);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={option => {
        return option.searchName;
      }}
      renderOption={(props, option) => {
        if (props.isDefaultOption) {
          return (
            <Typography>
              <IconButton
                style={{
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 0,
                }}
              >
                <PinDropIcon
                  style={{
                    fontSize: 40,
                    display: 'inline-block',
                    marginBottom: '3px',
                  }}
                />
              </IconButton>
              Set market on map
            </Typography>
          );
        } else {
          return props.searchName;
        }
      }}
      options={options}
      loading={loading}
      onChange={handleSearchChange} // this one being called after user click the value in the dropdown
      onInputChange={lodash.debounce((value, event) => handleInputChange(value, event), 600)} // this one being called whenever user inputs a letter
      noOptionsText={'No search result'}
      loadingText={returnLoadingText(emptySearchBar)}
      renderInput={params => (
        <TextField
          {...params}
          label="Search your city"
          placeholder={search.data.name}
          InputLabelProps={{
            shrink: true,
            color: 'primary',
          }}
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            className: styles.input,
            endAdornment: (
              <React.Fragment>
                {!emptySearchBar && loading ? <CircularProgress color="primary" size={20} /> : null}
                <Divider orientation="vertical" flexItem style={{ margin: 10 }} />
                <SearchTwoToneIcon style={{ color: COLOR_PRIMARY }} />
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

Asynchronous.propTypes = {
  searchChange: PropTypes.func,
  getSearch: PropTypes.func,
  resetFilter: PropTypes.func,
};

export default Asynchronous;
