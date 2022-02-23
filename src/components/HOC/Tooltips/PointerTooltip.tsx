import React, { useState } from 'react';
import moment from 'moment';
import {
  Tooltip,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Grid,
  List,
  ListItem,
  Divider,
  Link,
  LinearProgress,
  IconButton,
} from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import HotelSharpIcon from '@material-ui/icons/HotelSharp';
import BathtubSharpIcon from '@material-ui/icons/BathtubSharp';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import StarRateSharpIcon from '@material-ui/icons/StarRateSharp';
import LockSharpIcon from '@material-ui/icons/LockSharp';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import DeleteIcon from '@mui/icons-material/Delete';

import { COLOR_TOOLTIP_BACKGROUND, COLOR_RED } from 'src/const';
import { InfoTooltip } from './index';
import { TooltipCard } from '../index';
import { PointerTooltipPropTypes } from 'src/interfaces/iproptypes';

const useStylesRoot = makeStyles({
  tooltip: {
    padding: 0,
    width: 400,
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  performance: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    maxHeight: 100,
    width: '100%',
    paddingRight: 10,
  },
}));

const contentIconStyle = {
  fontSize: 23,
  color: '#4aa59a',
  padding: 3,
};

const PointerTooltip = ({
  data,
  component,
  canDelete,
  listings,
  visibleListings,
  getMarkersLoadEnd,
  setVisibleListings,
  isDisabled,
}: PointerTooltipPropTypes) => {
  const rootClass = useStylesRoot();
  const classes = useStyles();

  const dateStringArray = data.adr[data.adr.length - 1].date.split('-');
  const yearString = dateStringArray[0];
  const monthString = dateStringArray[1];
  const monthName = moment.months(parseInt(monthString) - 1);

  const [historicalPerfTrigger, setHistoricalPerfTrigger] = useState(false);
  const triggerHistoricalPerf = () => {
    setHistoricalPerfTrigger(!historicalPerfTrigger);
  };

  const deleteListing = () => {
    if (listings && visibleListings && getMarkersLoadEnd && setVisibleListings) {
      const newListings = listings.filter(listing => listing.listingID !== data.listingID);
      getMarkersLoadEnd(newListings);
      const newVisibleListings = visibleListings.filter(
        listing => listing.listingID !== data.listingID
      );
      setVisibleListings(newVisibleListings);
    }
  };

  return (
    <Tooltip
      interactive
      classes={rootClass}
      style={{ zIndex: 999999 }}
      placement="right"
      title={
        <Card>
          <Link href={'https://www.' + data.listing_url} target="_blank" rel="nofollow">
            <CardMedia
              component="img"
              alt={data.name}
              height="140"
              image={data.thumbnail_url}
              title={data.name}
              style={{ zIndex: 999999 }}
            />
          </Link>

          <CardContent style={{ zIndex: 999999 }}>
            <Typography component={'div'} variant={'h6'}>
              {data.name}
            </Typography>
            <Typography component={'span'} color="textSecondary">
              <Grid container>
                <Grid item xs={3}>
                  <HotelSharpIcon style={contentIconStyle} /> {data.bedrooms}
                </Grid>

                <Grid item xs={3}>
                  <BathtubSharpIcon style={contentIconStyle} />
                  {data.bathrooms}
                </Grid>

                <Grid item xs={3}>
                  <PeopleSharpIcon style={contentIconStyle} /> {data.accommodates}
                </Grid>

                <Grid item xs={3}>
                  {data.review_scores_rating > 0 ? (
                    <StarRateSharpIcon style={contentIconStyle} />
                  ) : (
                    ''
                  )}
                  {data.review_scores_rating > 0 ? data.review_scores_rating : ''}
                </Grid>
              </Grid>
            </Typography>{' '}
            <br />
            <Grid container direction="column">
              <Typography color="textSecondary" variant="subtitle2">
                {' '}
                {yearString} {monthName} Performance{' '}
              </Typography>{' '}
              <br />
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid>
                  <Typography color="textPrimary" variant="h6" align="center">
                    {data.adr && data.occupancy_rate && data.revenue ? (
                      data.revenue[data.revenue.length - 1].revenue != -1 ? (
                        `$${data.revenue[data.revenue.length - 1].revenue}`
                      ) : (
                        '-'
                      )
                    ) : (
                      <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
                    )}
                    <br />
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2" align="center">
                    Revenue <br />
                  </Typography>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid>
                  <Typography color="textPrimary" variant="h6" align="center">
                    {data.adr[data.adr.length - 1].adr != -1
                      ? `$${data.adr[data.adr.length - 1].adr}`
                      : '-'}
                    <br />
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2" align="center">
                    ADR <br />
                  </Typography>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid>
                  <Typography color="textPrimary" variant="h6" align="center">
                    {data.adr && data.occupancy_rate && data.revenue ? (
                      data.occupancy_rate[data.occupancy_rate.length - 1].occupancy_rate != -1 ? (
                        `${data.occupancy_rate[data.occupancy_rate.length - 1].occupancy_rate}%`
                      ) : (
                        '-'
                      )
                    ) : (
                      <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
                    )}
                    <br />
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2" align="center">
                    Occupancy <br />
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Typography color="textPrimary" variant="subtitle2">
                Availability{' '}
                {'activeDaysCount' in data ? (
                  ''
                ) : (
                  <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
                )}
              </Typography>
              <br />
              <InfoTooltip
                title={
                  <Card>
                    <CardContent style={{ background: COLOR_TOOLTIP_BACKGROUND }}>
                      <Typography variant="body2" style={{ fontWeight: 500 }}>
                        The listing was available for{' '}
                        {'activeDaysCount' in data ? (
                          data.activeDaysCount
                        ) : (
                          <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
                        )}{' '}
                        days in the past 12 months
                      </Typography>
                    </CardContent>
                  </Card>
                }
              >
                <div style={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    color="primary"
                    value={'activeDaysCount' in data ? (data.activeDaysCount / 365) * 100 : 0}
                    style={{ height: 10 }}
                  />
                </div>
              </InfoTooltip>
              <br />
              {data.isListingAddedInLast12Months && data.isListingAddedInLast12Months === 't' && (
                <Typography color="textPrimary" variant="subtitle2">
                  This listing was added within the past 12 months.
                </Typography>
              )}
              <br />
              {/* Expanded Historical Performance View */}
              {historicalPerfTrigger && (
                <List className={classes.performance}>
                  {[...Array(11)].map((_, index) => {
                    return (
                      <ListItem
                        style={{
                          padding: 0,
                        }}
                        key={index}
                      >
                        <ListItemButton
                          component="div"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            padding: 0,
                          }}
                        >
                          <Typography color="textSecondary" variant="subtitle2">
                            {' '}
                            {data.adr[10 - index].date.split('-')[0]}{' '}
                            {moment.months(parseInt(data.adr[10 - index].date.split('-')[1]) - 1)}{' '}
                            Performance{' '}
                          </Typography>{' '}
                          <br />
                          {data.adr[10 - index].adr !== -1 &&
                          ((data.occupancy_rate &&
                            data.occupancy_rate[10 - index].occupancy_rate !== -1) ||
                            isDisabled) ? (
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Grid>
                                <Typography color="textPrimary" variant="h6" align="center">
                                  {data.adr && data.occupancy_rate && data.revenue ? (
                                    data.revenue[10 - index].revenue != -1 ? (
                                      `$${data.revenue[10 - index].revenue}`
                                    ) : (
                                      '-'
                                    )
                                  ) : (
                                    <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
                                  )}
                                  <br />
                                </Typography>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  align="center"
                                >
                                  Revenue <br />
                                </Typography>
                              </Grid>

                              <Divider orientation="vertical" flexItem />

                              <Grid>
                                <Typography color="textPrimary" variant="h6" align="center">
                                  {data.adr[10 - index].adr != -1
                                    ? `$${data.adr[10 - index].adr}`
                                    : '-'}
                                  <br />
                                </Typography>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  align="center"
                                >
                                  ADR <br />
                                </Typography>
                              </Grid>

                              <Divider orientation="vertical" flexItem />

                              <Grid>
                                <Typography color="textPrimary" variant="h6" align="center">
                                  {data.adr && data.occupancy_rate && data.revenue ? (
                                    data.occupancy_rate[10 - index].occupancy_rate != -1 ? (
                                      `${data.occupancy_rate[10 - index].occupancy_rate}%`
                                    ) : (
                                      '-'
                                    )
                                  ) : (
                                    <LockSharpIcon style={{ fontSize: 24, color: '#4aa59a' }} />
                                  )}
                                  <br />
                                </Typography>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  align="center"
                                >
                                  Occupancy <br />
                                </Typography>
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid container direction="row" justifyContent="center" alignItems="center">
                              <Typography color="textSecondary" variant="h6" align="center">
                                Inactive
                              </Typography>
                            </Grid>
                          )}
                          <br />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Grid>
          </CardContent>

          <CardActions>
            <Button size="small" color="primary" onClick={triggerHistoricalPerf}>
              {historicalPerfTrigger ? 'Hide' : 'Show'} Historical Performance{' '}
              {!historicalPerfTrigger && (
                <OpenInFullIcon style={{ fontSize: 16, marginLeft: 10 }} />
              )}
            </Button>

            {canDelete && (
              <InfoTooltip
                title={
                  <TooltipCard content="By removing this listing, it won't be included in the calculation for the profit simulation, and rest of the charts." />
                }
              >
                <IconButton onClick={deleteListing}>
                  <DeleteIcon style={{ color: COLOR_RED }} />
                </IconButton>
              </InfoTooltip>
            )}
          </CardActions>
        </Card>
      }
    >
      {component}
    </Tooltip>
  );
};

export default PointerTooltip;
