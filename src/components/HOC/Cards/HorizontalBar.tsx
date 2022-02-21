import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, Grid, Typography, LinearProgress, Button } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import { COLOR_E, COLOR_TOOLTIP_BACKGROUND, COLOR_PRIMARY_DARK } from 'src/const';
import { Link } from 'react-router-dom';
import { UtilityData } from 'src/interfaces/idashboard';
import { HorizontalBarProps } from 'src/interfaces/iproptypes';

const useStyles = makeStyles((theme: Theme) => ({
  big: {
    flex: 1,
    maxHeight: 555,
    [theme.breakpoints.up('sm')]: {
      maxHeight: 550,
    },
  },
  small: {
    flex: 1,
    maxHeight: 240,
    [theme.breakpoints.up('sm')]: {
      maxHeight: 245,
    },
  },
  iconButton: {
    padding: 5,
  },
  horizontalBarHeaderText: {
    fontSize: 17,
    fontWeight: 400,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  sampleText: {
    color: COLOR_E,
    fontWeight: 600,
    transform: 'rotate(-30deg)',
    msTransform: 'rotate(-30deg)' /* IE 9 */,
    webkitTransform: 'rotate(-30deg),' /* Opera, Chrome, and Safari */,
  },
  linearProgress: {
    width: '100%',
    marginBottom: 20,
    color: COLOR_PRIMARY_DARK,
  },
}));

const parseData = (data: UtilityData) => {
  let barData: { name: string; val: number }[] = [];
  for (let key in data) {
    let keyPretty = key;
    if (key == 'cleaningFee') {
      keyPretty = 'Cleaning Fee';
    }
    if (key == 'additionalPersonFee') {
      keyPretty = 'Additional Guest Fee';
    }
    barData.push({
      name: keyPretty,
      val: data[key],
    });
  }
  return barData;
};

const getTootltipKey = (title: string) => {
  if (title == 'Extra Pricing') {
    return 'Price';
  }
  return 'Value';
};

const HorizontalBarCard = ({
  title,
  data,
  color,
  unit,
  totalSupply,
  isDisabled,
  search,
  dynamicTrigger,
  setSubscriptionModalOpen,
}: HorizontalBarProps) => {
  const classes = useStyles();
  let graphData = parseData(data);
  let noPropertyAvail = false;
  if (graphData.length === 0) {
    noPropertyAvail = true;
  }
  let chartContainerHeight = graphData.length > 5 ? 400 : 100;
  let barSize = 9;

  let blurGraph = {};
  if (isDisabled) {
    blurGraph = {
      webkitFilter: 'blur(2px)',
    };
  }

  const CustomTooltip = ({ active, payload, label, classes }) => {
    if (active) {
      return (
        <Card>
          <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
            <Typography variant="body2" style={{ fontWeight: 500 }}>
              {getTootltipKey(title)}: {payload[0].value}
              {payload[0].payload.name === 'Additional Guest Fee' ? `${unit}/pp` : unit}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <Card className={graphData.length > 5 ? classes.big : classes.small}>
      <CardContent>
        <Grid container>
          {dynamicTrigger && (
            <Grid item className={classes.linearProgress}>
              <LinearProgress />
            </Grid>
          )}

          <Typography variant="h2" className={classes.horizontalBarHeaderText}>
            {title}
          </Typography>

          <Grid container item xs={12} style={{ position: 'relative', top: '0', left: '0' }}>
            <ResponsiveContainer height={chartContainerHeight} width="100%">
              {noPropertyAvail ? (
                <Typography color="textSecondary">No property matching this criteria. </Typography>
              ) : (
                <BarChart
                  width={400}
                  height={chartContainerHeight}
                  data={graphData}
                  layout="vertical"
                  margin={{
                    top: 3,
                    right: 30,
                    left: 20,
                    bottom: 3,
                  }}
                  barCategoryGap={9}
                  style={blurGraph}
                >
                  <XAxis type="number" hide={true} />

                  <YAxis
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'Roboto',
                    }}
                    domain={[0, 5000]}
                    dataKey="name"
                    type="category"
                  />

                  <Tooltip
                    contentStyle={{
                      fontSize: '0.85rem',
                      fontFamily: 'Roboto',
                    }}
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip classes={classes} active payload label />}
                  />

                  <Bar
                    isAnimationActive={true}
                    animationDuration={250}
                    dataKey="val"
                    unit={unit}
                    fill={color}
                    background={{ fill: '#eee' }}
                    barSize={barSize}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>

            {isDisabled && setSubscriptionModalOpen && (
              <Backdrop className={classes.backdrop} open={true} invisible={true}>
                <Typography variant="h5" className={classes.sampleText}>
                  <Button
                    onClick={() => {
                      setSubscriptionModalOpen(true);
                    }}
                    style={{ all: 'unset', cursor: 'pointer' }}
                  >
                    SAMPLE
                  </Button>
                </Typography>
              </Backdrop>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HorizontalBarCard;
