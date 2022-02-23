import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Asynchronous from './Asynchronous';
import { FiltersRibbonPropTypes, HeaderPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles(theme => ({
  root: {
    // paddingTop: theme.spacing(3),
    color: 'white',
    zIndex: 500,
    [theme.breakpoints.down(900)]: {
      marginBottom: 20,
    },
  },
}));

const FiltersRibbon = ({
  resetFilter,
  search,
  getSearch,
  searchChange,
  isLoggedIn,
  setLoginModalOpen,
  setIsFilterChange,
  setFilteredListings,
  setdashboardState,
  matches,
}: FiltersRibbonPropTypes) => {
  const classes = useStyles();

  const [checked, setChecked] = React.useState(false);
  const handleSearachInputChange = () => {
    setChecked(true);
  };

  const handleSearchInputNoNeed = () => {
    setChecked(false);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
      className={classes.root}
    >
      <Grid item sm={10} xs={12} lg={6}>
        <Asynchronous
          search={search}
          searchChange={searchChange}
          getSearch={getSearch}
          resetFilter={resetFilter}
          showAlert={handleSearachInputChange}
          notShowAlert={handleSearchInputNoNeed}
          isLoggedIn={isLoggedIn}
          setLoginModalOpen={setLoginModalOpen}
          setIsFilterChange={setIsFilterChange}
          setFilteredListings={setFilteredListings}
          setdashboardState={setdashboardState}
          matches={matches}
        />
      </Grid>
    </Grid>
  );
};

FiltersRibbon.propTypes = {
  resetFilter: PropTypes.func,
  filterChange: PropTypes.func,
  getGraphData: PropTypes.func,
  getSearch: PropTypes.func,
};

export default FiltersRibbon;
