import React from 'react';
import { Card, CardContent, Grid, CircularProgress } from '@material-ui/core';
import { LoadingCardPropTypes } from 'src/interfaces/iproptypes';

const LoadingCard = ({ color, height }: LoadingCardPropTypes) => {
  return (
    <Card>
      <CardContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ height: height }}
        >
          <CircularProgress style={{ color: color }} />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
