// @ts-nocheck
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_LIGHT,
  COLOR_ACCENT_1,
  COLOR_ACCENT_2,
  outerCoords,
  COLOR_TOOLTIP_BACKGROUND,
} from 'src/const';

import {
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Button,
  ButtonGroup,
  Link,
  CardMedia,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import DownloadIcon from '@mui/icons-material/Download';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import {
  ADR,
  Listing,
  OccupancyRate,
  UtilityData,
  Coordinates,
  ListViewData,
} from '../../../../interfaces/idashboard';
import { OverviewDashboardPropTypes, SearchProp } from '../../../../interfaces/iproptypes';
import { infoIconStyle } from '../styles/style';
import {
  DigestCard,
  HorizontalBarCard,
  RevenueSimulationCard,
  TooltipCard,
} from '../../../HOC/Cards';
import { Pointer } from '../../../HOC';
import { InfoTooltip, PointerTooltip } from '../../../HOC/Tooltips';
import { CustomSwitch, renderCellExpand } from '../../../Utils';
import {
  processPolygon,
  getBoundedListings,
  safeMarkersLoad,
  getBoundedVRBOListings,
  jsonArrayToCSV,
  getDynamicADR,
  getDynamicOccupancyRate,
  getDynamicRev,
  getDynamicExtraFees,
  getListViewData,
} from 'src/utils';
import { LoadingCard } from '../../../HOC/Cards';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardsContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    mapCardContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mapTopRightToolbarContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    mapIframe: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    mapContainer: {
      [theme.breakpoints.up('xs')]: {
        height: 580,
      },
      [theme.breakpoints.up(900)]: {
        height: 600,
      },
      position: 'static',
      transition: theme.transitions.create('position', {
        easing: theme.transitions.easing.easeOut,
        duration: '0.3s',
      }),
    },
    invisbleMarkerDataText: {
      fontSize: 14,
      fontWeight: 400,
      marginRight: 20,
    },
    digestCardContainer: {
      width: '33%',
      height: 150,
    },
    exportButton: {
      background: COLOR_PRIMARY_DARK,
      padding: '10px 20px',
      color: 'white',
      '&:hover': {
        background: COLOR_PRIMARY_LIGHT,
      },
    },
    iconButton: {
      padding: 3,
    },
    toggleButton: {
      background: COLOR_TOOLTIP_BACKGROUND,
      '&:hover': {
        background: COLOR_PRIMARY_DARK,
        color: 'white',
      },
    },
    toggleButtonActive: {
      background: COLOR_PRIMARY_DARK,
      color: 'white',
      '&:hover': {
        background: COLOR_PRIMARY_DARK,
      },
    },
    tableRoot: {
      '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
        display: 'none',
      },
    },
  })
);

const OverviewDashboard = ({
  search,
  isUserAllowed,
  isAdmin,
  listings,
  vrboListings,
  multipleMarkersCallLoading,
  titleCase,
  visibleListings,
  sample,
  dashboardState,
  openAlert,
  setOpenAlert,
  setBoundedListings,
  setFilteredListings,
  setVisibleListings,
  visibleVRBOListings,
  setVisibleVRBOListings,
  matches,
  filterApplied,
  getMarkersLoadEnd,
  dynamicTrigger,
  setDynamicTrigger,
  setSubscriptionModalOpen,
  overviewDashboardMode,
  toggleOverviewDashboardMode,
}: OverviewDashboardPropTypes) => {
  const classes = useStyles();
  let isDisabled = !isUserAllowed;
  let notEnoughSample = false;
  if (!visibleListings.loading && visibleListings.data.length < 25) {
    notEnoughSample = true;
  }

  const [stickOnScroll, setStickOnScroll] = useState(false);
  useScrollPosition(
    ({ currPos }) => {
      const isSticky = currPos.y < -300;
      if (isSticky !== stickOnScroll) setStickOnScroll(isSticky);
    },
    [stickOnScroll]
  );

  let dynamicADR: ADR[] = [];
  let dynamicOccupancyRate: OccupancyRate[] = [];
  let dynamicRev: Revenue[] = [];
  let dynamicExtraFees: UtilityData = {};

  const listViewCols: GridColDef[] = [
    { field: 'listingID', headerName: 'Listing ID', width: 200, hide: true },
    {
      field: 'thumbnail_url',
      headerName: 'Listing',
      width: 200,
      renderCell: (params: any) => (
        <PointerTooltip
          data={visibleListings.data.find(item => item.listingID === params.row.listingID)}
          component={
            <Card style={{ borderRadius: 5 }}>
              <CardMedia component="img" height="40" image={params.value} alt="Listing Image" />
            </Card>
          }
          canDelete={true}
          listings={listings.data}
          visibleListings={visibleListings.data}
          getMarkersLoadEnd={getMarkersLoadEnd}
          setVisibleListings={setVisibleListings}
          isDisabled={isDisabled}
        />
      ),
    },
    {
      field: 'avgNightlyRate',
      headerName: 'Nightly Rate',
      flex: 1,
      renderCell: (params: any) => (
        <Typography>${params.value != -1 ? params.value : 'N/A'}</Typography>
      ),
    },
    {
      field: 'avgOccupancyRate',
      headerName: 'Occupancy Rate',
      flex: 1,
      renderCell: (params: any) =>
        isDisabled ? (
          <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
        ) : (
          <Typography>{params.value != -1 ? params.value : 'N/A'}%</Typography>
        ),
    },
    {
      field: 'avgRevenue',
      headerName: 'Revenue',
      flex: 1,
      renderCell: (params: any) =>
        isDisabled ? (
          <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
        ) : (
          <Typography>${params.value != -1 ? params.value : 'N/A'}</Typography>
        ),
    },
  ];

  let listViewData: ListViewData[] = [];

  console.log("visibleListings.data",visibleListings.data);
  

  if (!visibleListings.loading && !visibleVRBOListings.loading) {
    dynamicADR = getDynamicADR(visibleListings.data);
    dynamicExtraFees = getDynamicExtraFees(visibleListings.data);
    if (!isDisabled) {
      dynamicOccupancyRate = getDynamicOccupancyRate(visibleListings.data);
      dynamicRev = getDynamicRev(visibleListings.data); // This function needs to be implemented in utils.ts.
    }
    listViewData = getListViewData(visibleListings.data, isDisabled);
  }

  const exportData = () => {
    let data: {
      [key: string]: number | string;
    }[] = [];
    listings.data.forEach(listingObject => {
      let generatedPropertyType = '';
      let propertyType = listingObject.property_type;
      let roomType = listingObject.room_type;
      if (roomType === 'entire_home' && propertyType !== 'condo') {
        generatedPropertyType = 'Entire Home';
      } else if (propertyType === 'condo' && roomType !== 'entire_home') {
        generatedPropertyType = 'condo';
      } else generatedPropertyType = roomType;

      let exportedListingObject = {
        'Listing URL': `http://${listingObject.listing_url}`,
        'Property Type': generatedPropertyType,
        Latitude: listingObject.latitude,
        Longitude: listingObject.longitude,
        'Star Rating': listingObject.review_scores_rating,
        'Number of Active Days': listingObject.activeDaysCount,
        Bedrooms: listingObject.bedrooms,
        'Has pool': listingObject.pool,
        'Cleaning Fee': listingObject.cleaningFee,
        'Extra Guest Fee': listingObject.extraGuestFee,
      };
      listingObject.adr.forEach(adrObject => {
        exportedListingObject[`Daily Rate (${adrObject.date})`] = adrObject.adr;
      });
      listingObject.occupancy_rate.forEach(occupancyRateObject => {
        exportedListingObject[`Occupancy Rate (${occupancyRateObject.date})`] =
          occupancyRateObject.occupancy_rate;
      });
      listingObject.revenue.forEach(revenueObject => {
        exportedListingObject[`Revenue (${revenueObject.date})`] = revenueObject.revenue;
      });
      data.push(exportedListingObject);
    });

    const csvData = jsonArrayToCSV(data);
    const blob = new Blob([csvData], {
      type: 'text/csv',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${search.data && search.data.name ? search.data.name.replaceAll(' ', '_') : 'exported'
      }_data.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSampleData = () => {
    const url = 'https://airbtics-resource.s3.us-east-2.amazonaws.com/sample_data.csv';
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [active, setActive] = useState({
    map: true,
    list: false,
  });

  const [revCalVals, setRevCalVals] = useState({
    occupancy: 0,
    adr: 0,
    annualRevenue: 0,
    availability: 100,
    purchasePrice: 0,
    startupCosts: 0,
    annualExpenses: 0,
    interestRate: 1,
    annualADRIncrease: 1.5,
    annualAppreciation: 1.5,
    expenseIncrease: 1.5,
    profitTax: 0,
  });
  const handleRevCalValueChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRevCalVals({ ...revCalVals, [prop]: event.target.value });
  };
  const [allRevCalInputsFilled, setAllRevCalInputsFilled] = useState(false);
  useEffect(() => {
    if (
      revCalVals.annualRevenue &&
      revCalVals.annualExpenses &&
      revCalVals.purchasePrice &&
      revCalVals.startupCosts &&
      !allRevCalInputsFilled
    ) {
      setAllRevCalInputsFilled(true);
    }
  }, [revCalVals]);

  const [profitCalVals, setProfitCalVals] = useState({
    revenue: 0,
    monthlyRent: 0,
    monthlyExpenses: 0,
    oneTimeCost: 0,
  });
  const handleProfitCalValueChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfitCalVals({ ...profitCalVals, [prop]: event.target.value });
  };
  const [allProfitCalInputsFilled, setAllProfitCalInputsFilled] = useState(false);
  useEffect(() => {
    if (
      profitCalVals.monthlyRent &&
      profitCalVals.monthlyExpense &&
      profitCalVals.oneTimeCost &&
      !allProfitCalInputsFilled
    ) {
      setAllProfitCalInputsFilled(true);
    }
  }, [profitCalVals]);

  return (
    <Grid container direction="column" spacing={2}>
      {/* Universal view*/}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        item
      >
        <ButtonGroup variant="contained" size={matches ? 'small' : 'medium'}>
          <InfoTooltip
            title={
              <TooltipCard content="Simulate the ROI of properties you are considering purchasing." />
            }
          >
            <Button
              id="investingBtn"
              className={clsx({
                [classes.toggleButtonActive]: overviewDashboardMode.showInvesting,
                [classes.toggleButton]: !overviewDashboardMode.showInvesting,
              })}
              onClick={() => toggleOverviewDashboardMode('investing')}
            >
              Investing
            </Button>
          </InfoTooltip>

          <InfoTooltip
            title={
              <TooltipCard content="Simulate the ROI of properties you are considering for rental arbitrage." />
            }
          >
            <Button
              className={clsx({
                [classes.toggleButtonActive]: overviewDashboardMode.showRentalArbitrage,
                [classes.toggleButton]: !overviewDashboardMode.showRentalArbitrage,
              })}
              onClick={() => toggleOverviewDashboardMode('rentalArbitrage')}
            >
              Rental Arbitrage
            </Button>
          </InfoTooltip>
        </ButtonGroup>

        <Grid item>
          {!isUserAllowed && (
            <Collapse in={openAlert}>
              <Grid style={{ width: '100%' }}>
                <Alert
                  severity="info"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {!visibleListings.loading && (
                    <Link
                      onClick={() => {
                        setSubscriptionModalOpen(true);
                      }}
                    >
                      Subscribe
                    </Link>
                  )}{' '}
                  now to gain full data access to {titleCase(search.data.name)}. Not sure how the
                  dashboard looks like?{' '}
                  <Link
                    href="https://app.airbtics.com/"
                    target="_blank"
                    style={{ textDecoration: 'none' }}
                  >
                    Visit our sample dashboard!
                  </Link>
                </Alert>
              </Grid>
            </Collapse>
          )}

          {notEnoughSample && (
            <Typography color="secondary">
              {' '}
              The below data can be less accurate due to lack of samples. We recommend you to
              broaden your filter criteria.{' '}
            </Typography>
          )}

          {!visibleListings.loading && visibleListings.data.length === 0 && (
            <Typography color="secondary">
              {' '}
              There isnt any listing matching your criteria{' '}
            </Typography>
          )}

          {sample && dashboardState.showOverviewDashboard && (
            <Collapse in={openAlert}>
              <Grid style={{ width: '100%' }}>
                <Alert
                  severity="info"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  style={{ marginTop: 10 }}
                >
                  You are viewing a demo market to explore the analytics and features available with
                  purchase. Find your market in the search box above.
                </Alert>
              </Grid>
            </Collapse>
          )}

          {dashboardState.showOverviewDashboard && !filterApplied && isUserAllowed && (
            <Grid style={{ width: '100%' }}>
              <Alert severity="error" style={{ marginTop: 10 }}>
                Filter isn't configured! Make sure you set up your filter to get an accurate market
                view.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2} item>
        <Grid item xs={12} md={4} lg={4}>
          {listings.loading || visibleListings.loading ? (
            <LoadingCard color={COLOR_ACCENT_1} height={150} />
          ) : (
            <DigestCard
              title="Occupancy Rate"
              data={dynamicOccupancyRate}
              color={COLOR_ACCENT_1}
              isDisabled={isDisabled}
              multipleMarkersCallLoading={multipleMarkersCallLoading}
              dynamicTrigger={dynamicTrigger}
              setSubscriptionModalOpen={setSubscriptionModalOpen}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          {listings.loading || visibleListings.loading ? (
            <LoadingCard color={COLOR_ACCENT_2} height={150} />
          ) : (
            <DigestCard
              title="Median Nightly Rate"
              data={dynamicADR}
              color={COLOR_ACCENT_2}
              isDisabled={isDisabled}
              multipleMarkersCallLoading={multipleMarkersCallLoading}
              dynamicTrigger={dynamicTrigger}
              setSubscriptionModalOpen={setSubscriptionModalOpen}
            />
          )}
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          {listings.loading || visibleListings.loading ? (
            <LoadingCard color={COLOR_ACCENT_2} height={150} />
          ) : (
            <DigestCard
              title="Revenue Rate"
              data={dynamicADR}
              color={COLOR_ACCENT_1}
              isDisabled={isDisabled}
              multipleMarkersCallLoading={multipleMarkersCallLoading}
              dynamicTrigger={dynamicTrigger}
              setSubscriptionModalOpen={setSubscriptionModalOpen}
            />
          )}
        </Grid>

        {/* Mobile view */}

        {matches && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <div className={classes.mapCardContainer}>
                  {multipleMarkersCallLoading ? (
                    <CircularProgress style={{ marginBottom: 10, marginTop: -5 }} />
                  ) : (
                    <InfoTooltip
                      title={
                        <TooltipCard content="Download a CSV file with historical performance data of individual listings in this market. If you are not subscribed to the market, you will get the sample CSV." />
                      }
                    >
                      <Button
                        className={classes.exportButton}
                        style={{ marginBottom: 10, marginTop: -5 }}
                        onClick={isDisabled || isAdmin ? exportSampleData : exportData}
                      >
                        <DownloadIcon style={{ paddingRight: 5 }} /> Export
                      </Button>
                    </InfoTooltip>
                  )}

                  <div className={classes.mapTopRightToolbarContainer}>
                    <InfoTooltip
                      title={
                        <Card>
                          <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
                            <Grid container direction="column" alignItems="flex-start">
                              <Typography variant="body2" style={{ fontWeight: 500 }}>
                                &#8226; The map only shows 500 listings at a time. If you don't see
                                your listing, try zoning in.
                                <br />
                                <br />
                                &#8226; The green, yellow and red marker colors represent the type
                                of listings. Green - Entire place, Orange - Private Room, Red -
                                Hotel or Shared rooms.
                              </Typography>
                            </Grid>
                          </CardContent>
                        </Card>
                      }
                    >
                      <Typography className={classes.invisbleMarkerDataText}>
                        <IconButton className={classes.iconButton}>
                          <InfoOutlinedIcon style={infoIconStyle} />
                        </IconButton>
                      </Typography>
                    </InfoTooltip>

                    <CustomSwitch active={active} setActive={setActive} />
                  </div>
                </div>

                <Paper id="map" className={classes.mapContainer}>
                  {!search.loading && active.list && (
                    <div style={{ height: '100%' }}>
                      <DataGrid
                        className={classes.tableRoot}
                        rows={listViewData}
                        columns={listViewCols}
                        disableColumnFilter={true}
                        disableColumnMenu={true}
                      />
                    </div>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        )}

        {matches &&
          (overviewDashboardMode.showInvesting || overviewDashboardMode.showRentalArbitrage) && (
            <Grid item>
              {listings.loading || visibleListings.loading || multipleMarkersCallLoading ? (
                <LoadingCard height={150} />
              ) : (
                <RevenueSimulationCard
                  values={overviewDashboardMode.showInvesting ? revCalVals : profitCalVals}
                  setValues={overviewDashboardMode.showInvesting ? setRevCalVals : setProfitCalVals}
                  handleValueChange={
                    overviewDashboardMode.showInvesting
                      ? handleRevCalValueChange
                      : handleProfitCalValueChange
                  }
                  dynamicADR={dynamicADR}
                  dynamicOccupancyRate={dynamicOccupancyRate}
                  dynamicRev={dynamicRev}
                  dynamicCleaningFees={dynamicExtraFees.cleaningFee}
                  setDynamicVals={
                    overviewDashboardMode.showInvesting ? setRevCalVals : setProfitCalVals
                  }
                  overviewDashboardMode={overviewDashboardMode}
                  isDisabled={isDisabled}
                  dynamicTrigger={dynamicTrigger}
                />
              )}
            </Grid>
          )}

        {matches && (
          <Grid item xs={12}>
            {listings.loading || visibleListings.loading ? (
              <LoadingCard height={150} />
            ) : (
              <HorizontalBarCard
                title="Extra Pricing"
                data={dynamicExtraFees}
                color={COLOR_ACCENT_2}
                unit="$"
                isDisabled={false}
                search={search}
                totalSupply={listings.data.length}
                dynamicTrigger={dynamicTrigger}
              />
            )}
          </Grid>
        )}
      </Grid>

      {/* Laptop & Tablet view */}

      {!matches && (
        <Grid container direction="row" justifyContent="space-between" item>
          <Grid container direction="column" spacing={2} item xs={12} md={6} lg={4}>
            {(overviewDashboardMode.showInvesting || overviewDashboardMode.showRentalArbitrage) && (
              <Grid item>
                {listings.loading || visibleListings.loading || multipleMarkersCallLoading ? (
                  <LoadingCard height={150} />
                ) : (
                  <RevenueSimulationCard
                    values={overviewDashboardMode.showInvesting ? revCalVals : profitCalVals}
                    setValues={
                      overviewDashboardMode.showInvesting ? setRevCalVals : setProfitCalVals
                    }
                    handleValueChange={
                      overviewDashboardMode.showInvesting
                        ? handleRevCalValueChange
                        : handleProfitCalValueChange
                    }
                    dynamicADR={dynamicADR}
                    dynamicOccupancyRate={dynamicOccupancyRate}
                    dynamicRev={dynamicRev}
                    dynamicCleaningFees={dynamicExtraFees.cleaningFee}
                    setDynamicVals={
                      overviewDashboardMode.showInvesting ? setRevCalVals : setProfitCalVals
                    }
                    overviewDashboardMode={overviewDashboardMode}
                    isDisabled={isDisabled}
                    dynamicTrigger={dynamicTrigger}
                  />
                )}
              </Grid>
            )}

            <Grid item>
              {listings.loading || visibleListings.loading ? (
                <LoadingCard height={150} />
              ) : (
                <HorizontalBarCard
                  title="Extra Pricing"
                  data={dynamicExtraFees}
                  color={COLOR_ACCENT_2}
                  unit="$"
                  isDisabled={false}
                  search={search}
                  totalSupply={listings.data.length}
                  dynamicTrigger={dynamicTrigger}
                />
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardContent>
                <div className={classes.mapCardContainer}>
                  {multipleMarkersCallLoading ? (
                    <CircularProgress style={{ marginBottom: 10, marginTop: -5 }} />
                  ) : (
                    <InfoTooltip
                      title={
                        <TooltipCard content="Download a CSV file that has the historical performance of individual listings in this market. If you are not subscribed to the market, you will get the sample CSV." />
                      }
                    >
                      <Button
                        className={classes.exportButton}
                        style={{ marginBottom: 10, marginTop: -5 }}
                        onClick={isDisabled || isAdmin ? exportSampleData : exportData}
                      >
                        <DownloadIcon style={{ paddingRight: 5 }} /> Export
                      </Button>
                    </InfoTooltip>
                  )}

                  <div className={classes.mapTopRightToolbarContainer}>
                    <InfoTooltip
                      title={
                        <Card>
                          <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
                            <Grid container direction="column" alignItems="flex-start">
                              <Typography variant="body2" style={{ fontWeight: 500 }}>
                                &#8226; The map only shows 500 listings at a time. If you don't see
                                your listing, try zoning in.
                                <br />
                                <br />
                                &#8226; The green, yellow and red marker colors represent the type
                                of listings. Green - Entire place, Orange - Private Room, Red -
                                Hotel or Shared rooms.
                              </Typography>
                            </Grid>
                          </CardContent>
                        </Card>
                      }
                    >
                      <Typography className={classes.invisbleMarkerDataText}>
                        <IconButton className={classes.iconButton}>
                          <InfoOutlinedIcon style={infoIconStyle} />
                        </IconButton>
                      </Typography>
                    </InfoTooltip>

                    <CustomSwitch active={active} setActive={setActive} />
                  </div>
                </div>

                <Paper id="map" className={classes.mapContainer}>
                  {!search.loading && active.list && (
                    <div style={{ height: '100%' }}>
                      <DataGrid
                        className={classes.tableRoot}
                        rows={listViewData}
                        columns={listViewCols}
                        disableColumnFilter={true}
                        disableColumnMenu={true}
                      />
                    </div>
                  )}
                  {/**if active.map is equal with true , display the map */}
                  {!search.loading && active.map && (
                    <div style={{ height: '100%', position: 'relative' }}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47935.68508846973!2d19.782803841625714!3d41.33104134446396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350310470fac5db%3A0x40092af10653720!2sTirana%2C%20Albania!5e0!3m2!1sen!2s!4v1645613558635!5m2!1sen!2s"
                        title="Tirana, Albania"
                        className={classes.mapIframe}
                      ></iframe>
                    </div>
                  )}
                  {console.log("search.loading", search.loading)}
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default OverviewDashboard;
