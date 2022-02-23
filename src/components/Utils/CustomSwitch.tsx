import React, { useState } from 'react';
import clsx from 'clsx';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Paper, IconButton } from '@material-ui/core';
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import ListTwoToneIcon from '@mui/icons-material/ListTwoTone';
import { COLOR_PRIMARY_DARK, LIGHT_GREY } from 'src/const';
import { CustomSwitchPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    switchOuterContainer: {
      padding: 5,
      borderRadius: 100,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
    },
    switchInnerContainer: {
      backgroundColor: LIGHT_GREY,
      borderRadius: 100,
    },
    switch: {
      fontSize: 10,
    },
    switchActive: {
      backgroundColor: COLOR_PRIMARY_DARK,
      '&:hover': {
        backgroundColor: COLOR_PRIMARY_DARK,
      },
    },
    switchIcon: {
      color: COLOR_PRIMARY_DARK,
    },
    switchIconActive: {
      color: 'white',
    },
  })
);

const CustomSwitch = ({ active, setActive }: CustomSwitchPropTypes) => {
  const classes = useStyles();

  return (
    <Paper className={classes.switchOuterContainer}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={classes.switchInnerContainer}
      >
        <IconButton
          className={clsx({
            [classes.switchActive]: active.map,
            [classes.switch]: !active.map,
          })}
        >
          <LocationOnTwoToneIcon
            className={clsx({
              [classes.switchIconActive]: active.map,
              [classes.switchIcon]: !active.map,
            })}
          />
        </IconButton>

        <IconButton
          className={clsx({
            [classes.switchActive]: active.list,
            [classes.switch]: !active.list,
          })}
          onClick={() => setActive({ map: false, list: true })}
        >
          <ListTwoToneIcon
            className={clsx({
              [classes.switchIconActive]: active.list,
              [classes.switchIcon]: !active.list,
            })}
          />
        </IconButton>
      </Grid>
    </Paper>
  );
};

export default CustomSwitch;
