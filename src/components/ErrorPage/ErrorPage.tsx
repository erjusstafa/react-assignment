import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT } from 'src/const';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
  },
  faceIcon: {
    fontSize: '15rem',
    color: COLOR_PRIMARY_LIGHT,
  },
}));

const ErrorPage = ({}) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>
        <SentimentVeryDissatisfiedIcon className={classes.faceIcon} />
      </Grid>

      <Grid item>
        <Typography variant="h1" style={{ color: COLOR_PRIMARY_LIGHT, fontWeight: 'bold' }}>
          Oops!
        </Typography>
      </Grid>

      <Grid item style={{ color: COLOR_PRIMARY_LIGHT, paddingTop: 20 }}>
        <Typography>
          There seems to be an error! Please try refreshing your page.
          <br />
          If this error still persists, please contact{' '}
          <a
            href="mailto:data@airbtics.com"
            style={{ textDecoration: 'none', color: COLOR_PRIMARY_DARK }}
          >
            data@airbtics.com
          </a>
          .
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ErrorPage;
