import React from 'react';

import { Card, CardContent, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, COLOR_TOOLTIP_BACKGROUND } from '../../../const';
import { TooltipCardPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles((theme: Theme) => ({
  customButton: {
    background: COLOR_PRIMARY_DARK,
    borderRadius: 30,
    border: 0,
    color: 'white',
    height: 40,
    padding: '0 15px',
    '&:hover': {
      background: COLOR_PRIMARY_LIGHT,
    },
    marginTop: 10,
  },
}));

const TooltipCard = ({ title, content, link, contentAdditional=''}: TooltipCardPropTypes) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
        <Grid container direction="column" alignItems="flex-start">
          {title && (
            <Typography variant="h6" style={{ fontWeight: 'bolder', marginBottom: 5 }}>
              {title}
            </Typography>
          )}

          <Typography variant="body2" style={{ fontWeight: 500 }}>
            {content}
          </Typography>

          <Typography variant="body2" style={{ fontWeight: 500 }}>
            <br/> {contentAdditional}
          </Typography>

          {link && (
            <Button className={classes.customButton} onClick={() => window.open(link)}>
              <Typography variant="button" style={{ fontWeight: 'bolder' }}>
                Learn More
              </Typography>
            </Button>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TooltipCard;
