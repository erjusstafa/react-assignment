import React from 'react';
import { TooltipRenderProps } from 'react-joyride';

import { Grid, Card, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_LIGHT,
  COLOR_TOOLTIP_BACKGROUND,
} from '../../../const';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customButton: {
      background: COLOR_PRIMARY,
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
      background: COLOR_TOOLTIP_BACKGROUND,
      borderRadius: 5,
      border: 70,
      color: COLOR_PRIMARY,
      height: 45,
      padding: '0 15px',
      boxShadow: '0 1px 1px 1px rgba(255, 255, 255, .3)',
      '&:hover': {
        background: COLOR_PRIMARY,
        color: 'white',
      },
    },
  })
);

const JoyrideTooltip = ({
  index,
  step,
  tooltipProps,
  primaryProps,
  backProps,
  isLastStep,
}: TooltipRenderProps) => {
  const classes = useStyles();

  return (
    <Card {...tooltipProps}>
      <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND, width: 400 }}>
        <Typography variant="body1">{step.content}</Typography>
      </CardContent>
      {!step.hideFooter && (
        <CardActions style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
          <Grid container direction="row" justifyContent="space-between">
            {index > 0 && (
              <Button className={classes.customButtonReversed} {...backProps}>
                Back
              </Button>
            )}
            <Button className={classes.customButton} {...primaryProps}>
              {isLastStep ? `Let's Go!` : 'Next'}
            </Button>
          </Grid>
        </CardActions>
      )}
    </Card>
  );
};

export default JoyrideTooltip;
