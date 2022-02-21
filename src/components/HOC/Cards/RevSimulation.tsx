import { Card, CardContent, Grid, Typography, IconButton } from '@material-ui/core';
import FiberManualRecordSharpIcon from '@material-ui/icons/FiberManualRecordSharp';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import React from 'react';
import { Bar, BarChart, Tooltip, YAxis, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';
import { COLOR_PRIMARY, COLOR_TOOLTIP_BACKGROUND } from 'src/const';
import { RevSimulationPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    maxHeight: 375,
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0,
    },
    [theme.breakpoints.up('sm')]: {
      maxHeight: 370,
    },
  },
  successText: {
    color: theme.palette.success.main,
    fontWeight: 900,
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
  iconButton: {
    padding: 5,
  },
}));

const RevSimulation = ({ data, currency }: RevSimulationPropTypes) => {
  const classes = useStyles();

  const CustomTooltip = ({ active, payload, label, classes }) => {
    if (active) {
      return (
        <Card>
          <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
            <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
              Year: {payload[0].payload.year}
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 500 }}>
              <IconButton className={classes.iconButton}>
                <FiberManualRecordSharpIcon style={{ fontSize: 14, color: '#e69c5a' }} />{' '}
              </IconButton>
              Expense & Tax: ${payload[0].payload.expenseAndTax}
              <br />
              <IconButton className={classes.iconButton}>
                <FiberManualRecordSharpIcon style={{ fontSize: 14, color: '#4d9cd6' }} />{' '}
              </IconButton>
              Revenue: ${payload[0].payload.revenue}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <ResponsiveContainer height={300} width="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              style={{
                fontSize: '0.65rem',
                fontFamily: 'Roboto',
              }}
            />
            <YAxis
              unit={currency}
              style={{
                fontSize: '0.65rem',
                fontFamily: 'Roboto',
              }}
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
              type="monotone"
              dataKey="expenseAndTax"
              fill="#e69c5a"
              stackId="a"
              unit={currency}
              barSize={3}
              background={{ fill: '	#FFFFFF' }}
            />
            <Bar
              type="monotone"
              dataKey="revenue"
              fill="#4d9cd6"
              unit={currency}
              barSize={3}
              stackId="b"
              background={{ fill: '	#FFFFFF' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

RevSimulation.propTypes = {
  data: PropTypes.array,
};

export default RevSimulation;
