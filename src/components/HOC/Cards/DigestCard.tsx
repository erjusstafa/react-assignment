// @ts-nocheck
import React, { useMemo } from 'react';
import {
  Tooltip,
  LineChart,
  ResponsiveContainer,
  ReferenceDot,
  Line,
  CartesianGrid,
  XAxis,
} from 'recharts';

import { Card, CardContent, Grid, Typography, IconButton, Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import LockSharpIcon from '@material-ui/icons/LockSharp';

import { TooltipCard } from '.';
import InfoTooltip from '../Tooltips/InfoTooltip';
import { infoIconStyle } from '../../Dashboards/Market/styles/style';
import { COLOR_PRIMARY_DARK, COLOR_E, COLOR_TOOLTIP_BACKGROUND } from 'src/const';
import { ADR, OccupancyRate } from 'src/interfaces/idashboard';
import { DigestCardPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
    overflow: 'visible',
    [theme.breakpoints.up('sm')]: {
      height: 170,
    },
    [theme.breakpoints.up('lg')]: {
      height: 150,
    },
  },
  digestCardHeaderText: {
    fontSize: 17,
    fontWeight: 400,
  },
  successText: {
    color: theme.palette.success.main,
    fontWeight: 900,
  },
  iconButton: {
    padding: 3,
  },
  errorText: {
    color: theme.palette.error.main,
    fontWeight: 900,
  },
  subtleText: {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
  },
  rateText: {
    fontWeight: 900,
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
  lineBlurClass: {
    filter: 'blur(10)',
  },
  linearProgress: {
    width: '100%',
    marginBottom: 20,
    color: COLOR_PRIMARY_DARK,
  },
}));

const loadingStyle = makeStyles((theme: Theme) => ({
  colorPrimary: {
    backgroundColor: props => props.backgroundColor,
  },
  barColorPrimary: {
    backgroundColor: COLOR_TOOLTIP_BACKGROUND,
  },
}));

const getChangeTooltip = (title: string) => {
  if (title.includes('Occupancy')) {
    return "This month's Occupancy Rate compared to last month's";
  }
  if (title.includes('Median Nightly Rate')) {
    return "This month's Median Nightly Rate compared to last month's";
  }
  return '';
};

export const getYAxistName = (titleVal: string) => {
  if (titleVal.includes('Occupancy')) {
    return 'Occupancy Rate';
  }
  if (titleVal.includes('Median Nightly Rate')) {
    return 'Median Nightly Rate';
  }
  return '';
};

const formatRate = (rate: string, titleVal: string) => {
  return rate + getUnit(titleVal);
};

const getUnit = (titleVal: string) => {
  if (titleVal.includes('Occupancy')) {
    return '%';
  }
  if (titleVal.includes('Median Nightly Rate')) {
    return '$';
  }
  return '';
};
const parseGraphVal = (values: ADR[] | OccupancyRate[], yAxis: string, today: Date) => {
  let returnVal: {
    'Median Nightly Rate'?: number;
    'Occupancy Rate'?: number;
    timePeriod: string;
  }[] = [];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (yAxis.includes('Nightly')) {
    for (let ADRObj of values) {
      returnVal.push({
        timePeriod:
          monthNames[parseInt(ADRObj['date'].split('-')[1]) - 1] +
          ', ' +
          ADRObj['date'].split('-')[0],
        [yAxis]: ADRObj['adr'],
      });
    }
    return returnVal;
  }

  if (yAxis == 'Occupancy Rate') {
    let occupancyRates = values.slice(values.length - 12);
    for (let occupancyRateObject of occupancyRates) {
      returnVal.push({
        timePeriod:
          monthNames[parseInt(occupancyRateObject['date'].split('-')[1]) - 1] +
          ', ' +
          occupancyRateObject['date'].split('-')[0],
        [yAxis]: occupancyRateObject['occupancy_rate'],
      });
    }
    return returnVal;
  }

  console.log('Oops something went wrong. Check DigestCard element');
  return returnVal;
};

const getMonthOverMonthChange = (
  graphData,
  title: string,
  isDisabled: boolean,
  yAxis: string,
  classes
) => {
  let text = '';
  let className = '';

  if (graphData.length == 0) {
    return [text, className];
  }

  let deltaNum = (
    graphData[graphData.length - 1][yAxis] - graphData[graphData.length - 2][yAxis]
  ).toFixed(2);
  const isPositive = parseFloat(deltaNum) >= 0;
  text = isPositive ? `+${formatRate(deltaNum, title)}↑` : `${formatRate(deltaNum, title)}↓`;
  className = isPositive ? classes.successText : classes.errorText;

  return [text, className];
};

const CustomTooltip = ({ active, payload, label, classes }) => {
  if (active && payload && payload.length > 0) {
    return (
      <Card>
        <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
          <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
            {payload[0].payload.timePeriod}
          </Typography>
          <Typography variant="body2" style={{ fontWeight: 500 }}>
            {payload[0].name}: {payload[0].value}
            {payload[0].unit}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return null;
};

const DigestCard = ({
  title,
  data,
  color,
  isDisabled,
  multipleMarkersCallLoading,
  dynamicTrigger,
  setSubscriptionModalOpen,
}: DigestCardPropTypes) => {
  const classes = useStyles();
  const { colorPrimary, barColorPrimary } = loadingStyle({ backgroundColor: color });

  let yAxis = getYAxistName(title);

  let referPointCalc = 0;
  let referValueCalc = 0;
  let delta = 0;
  let rate = '';

  let today = new Date();
  let month = today.getMonth();

  const [graphData] = useMemo(() => {
    return [parseGraphVal(data, yAxis, today)];
  }, [data]);

  if (title.includes('Occupancy')) {
    let occupancyRateSum = 0;
    for (let x in graphData) {
      occupancyRateSum = occupancyRateSum + (graphData[x]['Occupancy Rate'] as number);
    }
    rate = (occupancyRateSum / graphData.length).toFixed(0);
  }

  if (title.includes('Median Nightly Rate')) {
    let averageDailyRateSum = 0;
    for (let x in graphData) {
      averageDailyRateSum = averageDailyRateSum + (graphData[x]['Median Nightly Rate'] as number);
    }
    rate = (averageDailyRateSum / graphData.length).toFixed(0);
  }

  const [referPoint, referValue] = useMemo(() => {
    let referPointCalc = 0;
    let referValueCalc = 0;

    if (title.includes('Median Nightly Rate') && graphData.length > 0) {
      referPointCalc = graphData.length - 1;
      referValueCalc = graphData[graphData.length - 1]['Median Nightly Rate'] as number;
    }

    if (title.includes('Occupancy Rate') && graphData.length > 0) {
      referPointCalc = graphData.length - 1;
      referValueCalc = graphData[graphData.length - 1]['Occupancy Rate'] as number;
    }

    return [referPointCalc, referValueCalc];
  }, [referPointCalc, referValueCalc]);

  const [deltaText, deltaClass] = getMonthOverMonthChange(
    graphData,
    title,
    isDisabled,
    yAxis,
    classes
  );

  let blurGraph = {};
  if (isDisabled && title.includes('Occupancy')) {
    blurGraph = {
      webkitFilter: 'blur(2px)',
    };
  }
  const tooltipObj = {
    'Median Nightly Rate': [
      `The past 12 months' average nightly rate of listings on the map.`,
      `It doesn't include a cleaning fee, service fee, or extra guest fee.`,
    ],
    'Occupancy Rate': [
      `The past 12 months' average occupancy rate of listings on the map.`,
      `Occupancy Rate = Number of booked days / Number of available days`,
    ],
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container>
          {multipleMarkersCallLoading && (
            <Grid item className={classes.linearProgress}>
              <LinearProgress
                classes={{ colorPrimary: colorPrimary, barColorPrimary: barColorPrimary }}
              />
            </Grid>
          )}
          {dynamicTrigger && !multipleMarkersCallLoading && (
            <Grid item className={classes.linearProgress}>
              <LinearProgress
                classes={{ colorPrimary: colorPrimary, barColorPrimary: barColorPrimary }}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <Typography variant="h2" className={classes.digestCardHeaderText}>
              {title}
              <InfoTooltip
                title={
                  <TooltipCard
                    title={title}
                    content={tooltipObj[title][0]}
                    contentAdditional={tooltipObj[title][1]}
                    link="https://support.airbtics.com/"
                  />
                }
              >
                <IconButton className={classes.iconButton}>
                  <InfoOutlinedIcon style={infoIconStyle} />
                </IconButton>
              </InfoTooltip>
            </Typography>

            {isDisabled && title == 'Occupancy Rate' ? (
              <IconButton
                onClick={() => {
                  setSubscriptionModalOpen(true);
                }}
              >
                <LockSharpIcon style={{ fontSize: 40, color: '#4aa59a' }} />
              </IconButton>
            ) : (
              <Typography className={classes.rateText} variant="h4">
                {formatRate(rate, title)}
              </Typography>
            )}

            <InfoTooltip title={<TooltipCard content={getChangeTooltip(title)} />}>
              <Typography className={deltaClass}>{deltaText}</Typography>
            </InfoTooltip>
          </Grid>

          <Grid item container xs={6} justify="flex-end">
            <Grid container item xs={12} style={{ position: 'relative', top: '0', left: '0' }}>
              <ResponsiveContainer height={100} width="100%">
                <LineChart data={graphData} style={blurGraph}>
                  <Line
                    animationDuration={150}
                    type="monotone"
                    dataKey={yAxis}
                    stroke={color}
                    strokeWidth={3}
                    unit={getUnit(title)}
                  />
                  <XAxis dataKey="timePeriod" hide={true} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="4 12" />
                  <ReferenceDot x={referPoint} y={referValue} r={6} fill={color} />
                  <Tooltip
                    position={{ x: 0, y: 80 }}
                    content={<CustomTooltip classes={classes} active payload label />}
                  />
                </LineChart>
              </ResponsiveContainer>

              {isDisabled && title.includes('Occupancy') && (
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DigestCard;
