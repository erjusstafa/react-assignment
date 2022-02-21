import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Bar, BarChart, Tooltip, YAxis, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  Menu,
} from '@material-ui/core';
import { Alert, Tooltip as MuiTooltip, Divider } from '@mui/material';
import { makeStyles, Theme } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { calculateRev } from 'src/utils';
import { RevSimulation } from '.';
import {
  ADR,
  CalculatorInputField,
  OccupancyRate,
  profitCalReturnObj,
  revCalReturnObj,
  Revenue,
} from 'src/interfaces/idashboard';
import { infoIconStyle } from '../../Dashboards/Market/styles/style';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_TOOLTIP_BACKGROUND,
  DARK_GREY,
  investmentCalculatorInputFields,
  rentalArbitrageCalculatorInputFields,
} from 'src/const';
import TooltipCard from './TooltipCard';
import InfoTooltip from '../Tooltips/InfoTooltip';

const useStyles = makeStyles((theme: Theme) => ({
  profitGraphRoot: {
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
  iconButton: {
    padding: 5,
  },
  linearProgress: {
    width: '100%',
    marginBottom: 20,
    color: COLOR_PRIMARY_DARK,
  },
  inputFieldLabel: {
    fontSize: 12,
  },
  inputSubfieldContainer: {
    padding: theme.spacing(2),
    width: 400,
  },
  dropDownToggleBtn: {
    color: COLOR_PRIMARY,
  },
}));

const NumberFormatCustom = raw => {
  return <NumberFormat value={raw} displayType={'text'} thousandSeparator />;
};

const months = [3, 6, 9, 12, 24];
const calculateProfit = (
  monthlyRev: number,
  monthlyExpense: number,
  monthlyRent: number,
  oneTimeCost: number
) => {
  const monthlyCost = monthlyExpense + monthlyRent;
  const monthlyProfit = Math.round(monthlyRev - monthlyCost);
  const graphVal = months.map(nMonths => {
    const nMonthsTotalExpense = Math.round(monthlyCost * nMonths + oneTimeCost);
    const nMonthsTotalRev = Math.round(monthlyRev * nMonths);
    return {
      nMonths,
      nMonthsTotalExpense,
      nMonthsTotalRev,
    };
  });

  return {
    monthlyProfit: monthlyProfit,
    graphVal,
  };
};

const RevenueSimulationCard = ({
  values,
  setValues,
  handleValueChange,
  dynamicADR,
  dynamicOccupancyRate,
  dynamicRev,
  dynamicCleaningFees,
  setDynamicVals,
  overviewDashboardMode,
  isDisabled,
  dynamicTrigger,
}) => {
  const classes = useStyles();

  const avgADR =
    dynamicADR.reduce((partial_sum: number, adrObj: ADR) => partial_sum + adrObj.adr, 0) /
    dynamicADR.length;
  const avgOccupancyRate =
    dynamicOccupancyRate.reduce(
      (partial_sum: number, occupancyRateObject: OccupancyRate) =>
        partial_sum + occupancyRateObject.occupancy_rate,
      0
    ) / dynamicOccupancyRate.length;
  const avgRev =
    dynamicRev.reduce((partial_sum: number, revObj: Revenue) => partial_sum + revObj.revenue, 0) /
    dynamicRev.length;

  useEffect(() => {
    if (overviewDashboardMode.showInvesting) {
      setDynamicVals({
        ...values,
        adr: avgADR,
        occupancy: avgOccupancyRate,
        annualRevenue: Math.round(avgRev * 12),
      });
      setSubfieldValues({
        ...subfieldValues,
        occupancyRate: Math.round(avgOccupancyRate),
        nightlyRate: Math.round(avgADR),
        cleaningFees: dynamicCleaningFees,
        bookingsPerMonth: Math.round(avgOccupancyRate / 10),
        cleaningFeesExpenses: Math.round(avgOccupancyRate / 10) * dynamicCleaningFees * 12,
      });
    }
  }, [avgADR, avgOccupancyRate, avgRev, dynamicCleaningFees]);

  useEffect(() => {
    if (overviewDashboardMode.showRentalArbitrage) {
      setDynamicVals({
        ...values,
        revenue: avgRev,
      });
    }
  }, [avgRev]);

  let inputFields: CalculatorInputField[] = [];
  if (overviewDashboardMode.showInvesting) {
    inputFields = investmentCalculatorInputFields;
  }
  if (overviewDashboardMode.showRentalArbitrage) {
    inputFields = rentalArbitrageCalculatorInputFields;
  }

  const [inputSubfieldDropdown, setInputSubfieldDropdown] = useState({
    annualRevenue: false,
    annualExpenses: false,
    startupCosts: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleInputSubfieldDropDownState = (key: string) => {
    let initialInputSubfieldDropDownState = {
      annualRevenue: false,
      annualExpenses: false,
      startupCosts: false,
    };
    setInputSubfieldDropdown({
      ...initialInputSubfieldDropDownState,
      [key]: !inputSubfieldDropdown[key],
    });
  };

  const handleInputSubfieldDropDownClick = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
  };
  const handleInputSubfieldDropDownClose = () => {
    setAnchorEl(null);
  };

  const [subfieldValues, setSubfieldValues] = useState({
    occupancyRate: 0,
    nightlyRate: 0,
    cleaningFees: 0,
    bookingsPerMonth: 0,
    managementFee: 0,
    lodgingTax: 5,
    propertyTax: 10,
    mortgageFees: 0,
    cleaningFeesExpenses: 0,
    maintenance: 1000,
    insurance: 500,
    utilities: 500,
    hoaFees: 0,
    other: 0,
    homeFurnishings: 0,
    homeImprovements: 0,
    closingCosts: 0,
  });

  const handleSubfieldValueChange = (key: string, event) => {
    if (
      (key === 'occupancyRate' ||
        key === 'managementFee' ||
        key === 'lodgingTax' ||
        key === 'propertyTax') &&
      (event.target.value > 100 || event.target.value < 0)
    ) {
      window.alert('Please enter a number between 0 and 100');
      setSubfieldValues({
        ...subfieldValues,
        [key]: subfieldValues[key],
      });
    } else if (key === 'bookingsPerMonth' && (event.target.value > 31 || event.target.value < 0)) {
      window.alert('Please enter a number between 0 and 31');
      setSubfieldValues({
        ...subfieldValues,
        [key]: subfieldValues[key],
      });
    } else if (event.target.value < 0) {
      window.alert('Please enter a number greater than 0');
      setSubfieldValues({
        ...subfieldValues,
        [key]: subfieldValues[key],
      });
    } else {
      setSubfieldValues({
        ...subfieldValues,
        [key]: event.target.value,
      });
    }
  };

  useEffect(() => {
    if (overviewDashboardMode.showInvesting) {
      // make sure all the inputs are numbers
      for (let key in subfieldValues) {
        subfieldValues[key] = parseFloat(subfieldValues[key]);
        if (isNaN(subfieldValues[key])) {
          subfieldValues[key] = 0;
        }
      }
      setValues({
        ...values,
        annualRevenue:
          (Math.round(subfieldValues.nightlyRate * 30.5 * (subfieldValues.occupancyRate / 100)) +
            subfieldValues.cleaningFees * subfieldValues.bookingsPerMonth) *
          12,
        annualExpenses: Math.round(
          (subfieldValues.managementFee / 100) * values.annualRevenue +
            (subfieldValues.lodgingTax / 100) * values.annualRevenue +
            (subfieldValues.propertyTax / 100) * values.annualRevenue +
            subfieldValues.mortgageFees +
            subfieldValues.cleaningFeesExpenses +
            subfieldValues.maintenance +
            subfieldValues.insurance +
            subfieldValues.utilities +
            subfieldValues.hoaFees +
            subfieldValues.other
        ),
        startupCosts:
          subfieldValues.homeFurnishings +
          subfieldValues.homeImprovements +
          subfieldValues.closingCosts,
      });
    }
  }, [subfieldValues]);

  let revCalReturnObj: boolean | revCalReturnObj = {} as revCalReturnObj;
  if (overviewDashboardMode.showInvesting) {
    revCalReturnObj = calculateRev({ ...values, downPayment: values.purchasePrice });
  }

  let profitCalReturnObj: profitCalReturnObj = {} as profitCalReturnObj;
  if (overviewDashboardMode.showRentalArbitrage) {
    profitCalReturnObj = calculateProfit(
      avgRev,
      Number(values.monthlyExpense),
      Number(values.monthlyRent),
      Number(values.oneTimeCost)
    );
  }

  const CustomTooltip = ({ active, payload, label, classes }) => {
    if (active && payload) {
      return (
        <Card>
          <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
            <Typography variant="body2" style={{ fontWeight: 500 }}>
              {payload[0].payload.nMonths} months Total Expense: $
              {payload[0].payload.nMonthsTotalExpense}
              <br />
              {payload[0].payload.nMonths} months Total Revenue: $
              {payload[0].payload.nMonthsTotalRev}
              <Divider style={{ background: DARK_GREY, marginTop: 10, marginBottom: 10 }} />
              {payload[0].payload.nMonths} months Total Profit: $
              {payload[0].payload.nMonthsTotalRev - payload[0].payload.nMonthsTotalExpense}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} id="calculator">
          {dynamicTrigger && (
            <Grid item className={classes.linearProgress}>
              <LinearProgress />
            </Grid>
          )}

          {overviewDashboardMode.showInvesting && (
            <Grid item style={{ width: '100%' }}>
              <Typography>
                {' '}
                Profit Simulation
                <InfoTooltip
                  title={
                    <TooltipCard
                      title="Profit Simulation"
                      content="This simulation uses the past 12 months' average nightly rate and occupancy rate from the listings that you are seeing in the map view. This simulation assumes inflation of expenses and nightly rates (1.5%/year), appreciation of property price (1.5%/year), and 20% profit tax. If you want to change these variables, you can go to Calculator by clicking the button in the bottom left, and put the occupancy rate and the nightly rate you see from the above charts."
                      link="https://support.airbtics.com/"
                    />
                  }
                >
                  <IconButton className={classes.iconButton}>
                    <InfoOutlinedIcon style={infoIconStyle} />{' '}
                  </IconButton>
                </InfoTooltip>
              </Typography>
            </Grid>
          )}

          {overviewDashboardMode.showRentalArbitrage && (
            <Grid item style={{ width: '100%' }}>
              <Typography>
                {' '}
                Revenue & Expense Simulation
                <MuiTooltip title="This simulation uses the past 12 months' average revenue from the listings that you are seeing in the map view.">
                  <IconButton className={classes.iconButton}>
                    <InfoOutlinedIcon style={infoIconStyle} />{' '}
                  </IconButton>
                </MuiTooltip>
              </Typography>
            </Grid>
          )}

          {isDisabled && (
            <Grid item style={{ width: '100%' }}>
              <Alert severity="error" style={{ marginTop: 10 }}>
                You need to subscribe to this market to use this simulator!
              </Alert>
            </Grid>
          )}

          <Grid item container spacing={4} style={{ width: '100%' }}>
            {inputFields.map((field, index) => (
              <>
                <InfoTooltip
                  title={
                    field.tooltip && (
                      <TooltipCard
                        title={field.label}
                        content={field.tooltip}
                        link="https://support.airbtics.com/"
                      />
                    )
                  }
                  arrow
                >
                  <Grid item xs={6} key={index}>
                    {field.input ? (
                      <TextField
                        id={field.label}
                        label={field.label}
                        variant="outlined"
                        defaultValue={values[field.key]}
                        value={values[field.key]}
                        onChange={handleValueChange(field.key)}
                        type="number"
                        error={!values[field.key]}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    ) : (
                      <>
                        <Typography className={classes.inputFieldLabel}>{field.label}</Typography>
                        <Grid container>
                          <Grid item xs={10}>
                            <Typography variant="h6">${values[field.key]}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              style={{ padding: 0 }}
                              aria-label="toggle sub-input fields"
                              onClick={e => {
                                handleInputSubfieldDropDownState(field.key);
                                handleInputSubfieldDropDownClick(e);
                              }}
                            >
                              {inputSubfieldDropdown[field.key] ? (
                                <ArrowDropUpIcon
                                  className={classes.dropDownToggleBtn}
                                  fontSize="large"
                                />
                              ) : (
                                <ArrowDropDownIcon
                                  className={classes.dropDownToggleBtn}
                                  fontSize="large"
                                />
                              )}
                            </IconButton>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </InfoTooltip>

                {inputSubfieldDropdown[field.key] && (
                  <Menu
                    anchorEl={anchorEl}
                    getContentAnchorEl={null}
                    open={Boolean(anchorEl)}
                    onClose={e => {
                      handleInputSubfieldDropDownClose();
                      handleInputSubfieldDropDownState(field.key);
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <Grid container direction="column" className={classes.inputSubfieldContainer}>
                      <Typography variant="h6" style={{ marginBottom: 20, marginTop: 0 }}>
                        {field.label}
                      </Typography>

                      <Grid item container spacing={4}>
                        {field.subfields &&
                          field.subfields.map((subfield, subfieldIndex) => (
                            <Grid item xs={6} key={subfieldIndex}>
                              <TextField
                                id={subfield.label}
                                label={subfield.label}
                                variant="outlined"
                                size="small"
                                defaultValue={subfieldValues[subfield.key]}
                                value={subfieldValues[subfield.key]}
                                onChange={e => handleSubfieldValueChange(subfield.key, e)}
                                type="number"
                                error={!subfieldValues[subfield.key]}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {subfield.unit}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>
                  </Menu>
                )}
              </>
            ))}
          </Grid>

          {overviewDashboardMode.showInvesting && (
            <Grid item style={{ width: '100%' }}>
              <RevSimulation data={revCalReturnObj['revenueObjs']} currency="$" />
            </Grid>
          )}

          {overviewDashboardMode.showInvesting && (
            <Grid item style={{ width: '100%' }}>
              <InfoTooltip
                title={
                  <TooltipCard content="Cash-on-Cash return measures the annual return the investor made on the property in relation to the amount of mortgage paid during the same year." />
                }
                arrow
              >
                <Typography display="inline">
                  {' '}
                  Cash Return:{' '}
                  <Box display="inline" fontWeight={500}>
                    {revCalReturnObj['cac']}%
                  </Box>{' '}
                </Typography>
              </InfoTooltip>

              <InfoTooltip
                title={
                  <TooltipCard content="The yearly profit is based on the historical performance of the listings you see on the map combined with the information you provided above. To be specific, it uses the occupancy rate, the median nightly rate and the revenue values that you can see in the above charts." />
                }
                arrow
              >
                <Typography>
                  Profit Before Tax:{' '}
                  <Box display="inline" fontWeight={500}>
                    ${NumberFormatCustom(revCalReturnObj['firstYearProfitAfterTax'])}
                  </Box>
                </Typography>
              </InfoTooltip>

              <InfoTooltip
                title={
                  <TooltipCard content="Rental yield is the amount of money you make on an investment property by measuring the gap between your overall costs and the income you receive from renting out your property." />
                }
                arrow
              >
                <Typography>
                  {' '}
                  Net Rental Yield:{' '}
                  <Box display="inline" fontWeight={500}>
                    {revCalReturnObj['netRentalYield']}%
                  </Box>{' '}
                </Typography>
              </InfoTooltip>

              <InfoTooltip title={<TooltipCard content="" />} arrow>
                <Typography>
                  {' '}
                  Net Operating Income:{' '}
                  <Box display="inline" fontWeight={500}>
                    ${NumberFormatCustom(revCalReturnObj['netOperatingIncome'])}
                  </Box>{' '}
                </Typography>
              </InfoTooltip>
            </Grid>
          )}

          {overviewDashboardMode.showRentalArbitrage && (
            <Grid item style={{ width: '100%' }}>
              <InfoTooltip
                title={
                  <TooltipCard content="It is the expected amount of profit you will be generating each month. Monthly Revenue - Monthly Expense = Monthly Profit. It uses historical performance data of the listings you see on the map to calculate Monthly Revenue." />
                }
              >
                <Typography display="inline">
                  Monthly Profit:{' '}
                  <Box display="inline" fontWeight={500}>
                    ${profitCalReturnObj['monthlyProfit']}
                  </Box>{' '}
                </Typography>
              </InfoTooltip>
            </Grid>
          )}

          {overviewDashboardMode.showRentalArbitrage && (
            <Grid item style={{ width: '100%' }}>
              <Grid container className={classes.profitGraphRoot}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <ResponsiveContainer height={300} width="100%">
                    <BarChart
                      data={profitCalReturnObj['graphVal']}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="nMonths"
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'Roboto',
                        }}
                      />
                      <YAxis
                        unit="$"
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
                        dataKey="nMonthsTotalExpense"
                        fill="#e69c5a"
                        stackId="a"
                        unit="$"
                        barSize={20}
                        background={{ fill: '	#FFFFFF' }}
                      />
                      <Bar
                        type="monotone"
                        dataKey="nMonthsTotalRev"
                        fill="#4d9cd6"
                        unit="$"
                        barSize={20}
                        stackId="b"
                        background={{ fill: '	#FFFFFF' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RevenueSimulationCard;

{
  /* <InfoTooltip
  title={
    <TooltipCard title={field.label} content={field.tooltip} link="https://support.airbtics.com/" />
  }
  arrow
></InfoTooltip> */
}
