import {
  Listing,
  Search,
  Coordinates,
  Bounds,
  TailoredRegionMarkers,
  VRBOListing,
  ADR,
  OccupancyRate,
  Revenue,
  UtilityData,
  ListViewData,
} from './interfaces/idashboard';
import { FilterVal } from './interfaces/iproptypes';
const classifyPoint = require('robust-point-in-polygon');
const { WebClient } = require('@slack/web-api');

export function setMarkerParams(markerParam, bounds) {
  markerParam['nwLat'] = bounds['nw']['lat'];
  markerParam['nwLng'] = bounds['nw']['lng'];
  markerParam['seLat'] = bounds['se']['lat'];
  markerParam['seLng'] = bounds['se']['lng'];
}

const processMultiPolygon = (multiPolygonRaw: string) => {
  multiPolygonRaw = multiPolygonRaw.replace('MULTIPOLYGON', '');
  multiPolygonRaw = multiPolygonRaw.replace('((', '');
  multiPolygonRaw = multiPolygonRaw.replace('))', '');
  const processedMultiPolygonRaw = multiPolygonRaw.split('),');

  let polygons = [] as Coordinates[][];
  processedMultiPolygonRaw.forEach((polygon, index) => {
    polygon = polygon.replace('(', '');
    polygon = polygon.replace(')', '');
    const processedPolygon = polygon.split(',');

    let coordinates: Coordinates[] = [];

    processedPolygon.forEach((item, index) => {
      let x = item.split(' ');
      coordinates.push({ lng: parseFloat(x[0]), lat: parseFloat(x[1]) });
    });

    polygons.push(coordinates);
  });
  return polygons;
};

export const processPolygon = (polygonRaw: string, multiPolygonRaw: string) => {
  if (!polygonRaw) {
    return processMultiPolygon(multiPolygonRaw);
  }

  polygonRaw = polygonRaw.replace('POLYGON', '');
  polygonRaw = polygonRaw.replace('((', '');
  polygonRaw = polygonRaw.replace('))', '');
  const processedPolygonRaw = polygonRaw.split(',');
  let polygons = [] as Coordinates[][];
  let coordinates: Coordinates[] = [];

  processedPolygonRaw.forEach((item, index) => {
    let x = item.split(' ');
    coordinates.push({ lng: parseFloat(x[0]), lat: parseFloat(x[1]) });
  });
  polygons.push(coordinates);

  return polygons;
};

export const processListing = (listings, dates: string[]) => {
  let retVals: Listing[] = [];
  if (!listings) {
    return retVals;
  }
  for (const listing of listings) {
    try {
      let retListing = {} as Listing;
      retListing.listingID = listing[0];
      retListing.name = listing[1];
      retListing.thumbnail_url = `https://a0.muscache.com/im/pictures/${listing[2]}?aki_policy=small`;
      retListing.latitude = listing[3];
      retListing.longitude = listing[4];
      retListing.room_type = listing[5];
      retListing.property_type = listing[6];
      retListing.bedrooms = listing[7];
      retListing.bathrooms = listing[8];
      retListing.accommodates = listing[9];
      retListing.host_name = listing[10];
      retListing.minimum_nights = listing[11];
      retListing.hostListingCount = listing[12];
      retListing.cleaningFee = listing[13];
      retListing.extraGuestFee = listing[14];
      retListing.review_scores_rating = listing[15];
      retListing.pool = listing[16];
      retListing.hot_tub = listing[17];
      retListing.cancellation_policy = listing[18];
      retListing.pet_friendly = listing[19];
      retListing.adr = [
        { date: dates[0], adr: listing[20] },
        { date: dates[1], adr: listing[21] },
        { date: dates[2], adr: listing[22] },
        { date: dates[3], adr: listing[23] },
        { date: dates[4], adr: listing[24] },
        { date: dates[5], adr: listing[25] },
        { date: dates[6], adr: listing[26] },
        { date: dates[7], adr: listing[27] },
        { date: dates[8], adr: listing[28] },
        { date: dates[9], adr: listing[29] },
        { date: dates[10], adr: listing[30] },
        { date: dates[11], adr: listing[31] },
      ];
      retListing.listing_url = `airbnb.com/rooms/${retListing.listingID}`;
      if (listing.length > 32) {
        retListing.occupancy_rate = [
          { date: dates[0], occupancy_rate: listing[32] },
          { date: dates[1], occupancy_rate: listing[33] },
          { date: dates[2], occupancy_rate: listing[34] },
          { date: dates[3], occupancy_rate: listing[35] },
          { date: dates[4], occupancy_rate: listing[36] },
          { date: dates[5], occupancy_rate: listing[37] },
          { date: dates[6], occupancy_rate: listing[38] },
          { date: dates[7], occupancy_rate: listing[39] },
          { date: dates[8], occupancy_rate: listing[40] },
          { date: dates[9], occupancy_rate: listing[41] },
          { date: dates[10], occupancy_rate: listing[42] },
          { date: dates[11], occupancy_rate: listing[43] },
        ];
        retListing.revenue = [
          { date: dates[0], revenue: listing[44] },
          { date: dates[1], revenue: listing[45] },
          { date: dates[2], revenue: listing[46] },
          { date: dates[3], revenue: listing[47] },
          { date: dates[4], revenue: listing[48] },
          { date: dates[5], revenue: listing[49] },
          { date: dates[6], revenue: listing[50] },
          { date: dates[7], revenue: listing[51] },
          { date: dates[8], revenue: listing[52] },
          { date: dates[9], revenue: listing[53] },
          { date: dates[10], revenue: listing[54] },
          { date: dates[11], revenue: listing[55] },
        ];
        retListing.activeDaysCount = listing[56];
        retListing.isListingAddedInLast12Months = listing[57];
      }
      retVals.push(retListing);
    } catch (error) {
      console.log('error while loading marker');
    }
  }

  return retVals;
};

export const processVRBOListing = listings => {
  let retVals: VRBOListing[] = [];
  if (!listings) {
    return retVals;
  }
  for (const listing of listings) {
    let retListing = {} as VRBOListing;
    retListing.listingID = listing[0];
    retListing.latitude = listing[1];
    retListing.longitude = listing[2];
    retVals.push(retListing);
  }

  return retVals;
};

export const processTailoredRegionMarkers = listings => {
  let retVals: TailoredRegionMarkers[] = [];
  if (!listings) {
    return retVals;
  }
  for (const listing of listings) {
    let retListing = {} as TailoredRegionMarkers;
    retListing.listingID = listing[0];
    retListing.latitude = listing[1];
    retListing.longitude = listing[2];
    retListing.room_type = listing[3];
    retVals.push(retListing);
  }

  return retVals;
};

export const getBoundedListings = (listings: Listing[], bounds: Bounds) => {
  const nw = bounds.nw;
  const ne = bounds.ne;
  const se = bounds.se;
  const sw = bounds.sw;

  const polygon = [
    [nw.lat, nw.lng],
    [ne.lat, ne.lng],
    [se.lat, se.lng],
    [sw.lat, sw.lng],
  ];

  let boundedListings: Listing[] = [];

  listings.map(listing => {
    let point = [listing.latitude, listing.longitude];
    if (classifyPoint(polygon, point) === -1 || classifyPoint(polygon, point) === 0) {
      boundedListings.push(listing);
    }
  });

  return boundedListings;
};

export const getBoundedVRBOListings = (listings: VRBOListing[], bounds: Bounds) => {
  const nw = bounds.nw;
  const ne = bounds.ne;
  const se = bounds.se;
  const sw = bounds.sw;

  const polygon = [
    [nw.lat, nw.lng],
    [ne.lat, ne.lng],
    [se.lat, se.lng],
    [sw.lat, sw.lng],
  ];

  let boundedListings: VRBOListing[] = [];

  listings.map(listing => {
    let point = [listing.latitude, listing.longitude];
    if (classifyPoint(polygon, point) === -1 || classifyPoint(polygon, point) === 0) {
      boundedListings.push(listing);
    }
  });

  return boundedListings;
};

export const getFilteredListings = (listings: Listing[], filters: FilterVal) => {
  let filteredListings: Listing[] = [];
  let filteredListingsList: Listing[][] = [];

  Object.keys(filters).forEach(filter => {
    const value: string | Number | Number[] | { [index: string]: boolean } = filters[filter];
    let tempFilteredListings: Listing[] = [];

    if (filter === 'roomType') {
      if ((value as string) === 'all') {
        tempFilteredListings = listings;
      } else if ((value as string) === 'entire_home') {
        listings.forEach(listing => {
          if (
            listing.room_type &&
            listing.room_type === (value as string) &&
            listing.property_type &&
            listing.property_type !== 'condo'
          ) {
            tempFilteredListings.push(listing);
          }
        });
      } else if ((value as string) === 'condo') {
        listings.forEach(listing => {
          if (listing.property_type && listing.property_type === 'condo') {
            tempFilteredListings.push(listing);
          }
        });
      } else {
        listings.forEach(listing => {
          if (listing.room_type && listing.room_type === (value as string)) {
            tempFilteredListings.push(listing);
          }
        });
      }
    }

    if (filter === 'bedrooms') {
      const lowerVal = value[0] as Number;
      const upperVal = value[1] as Number;

      if (lowerVal === 0 && upperVal === 6) {
        tempFilteredListings = listings;
      } else if (lowerVal !== 0 && upperVal === 6) {
        listings.forEach(listing => {
          const bedrooms: number = listing.bedrooms === 'Studio' ? 0 : Number(listing.bedrooms);
          if (listing.bedrooms && bedrooms >= lowerVal) {
            tempFilteredListings.push(listing);
          }
        });
      } else {
        listings.forEach(listing => {
          const bedrooms: number = listing.bedrooms === 'Studio' ? 0 : Number(listing.bedrooms);
          if (listing.bedrooms && bedrooms >= lowerVal && bedrooms <= upperVal) {
            tempFilteredListings.push(listing);
          }
        });
      }
    }

    if (filter === 'bathrooms') {
      const lowerVal = value[0] as Number;
      const upperVal = value[1] as Number;

      if (lowerVal === 0 && upperVal === 6) {
        tempFilteredListings = listings;
      } else if (lowerVal !== 0 && upperVal === 6) {
        listings.forEach(listing => {
          if (listing[filter] && listing[filter] >= lowerVal) {
            tempFilteredListings.push(listing);
          }
        });
      } else {
        listings.forEach(listing => {
          if (listing[filter] && listing[filter] >= lowerVal && listing[filter] <= upperVal) {
            tempFilteredListings.push(listing);
          }
        });
      }
    }

    if (filter === 'accommodates') {
      const lowerVal = value[0] as Number;
      const upperVal = value[1] as Number;

      if (lowerVal === 0 && upperVal === 16) {
        tempFilteredListings = listings;
      } else {
        listings.forEach(listing => {
          if (listing[filter] && listing[filter] >= lowerVal && listing[filter] <= upperVal) {
            tempFilteredListings.push(listing);
          }
        });
      }
    }

    if (filter === 'minimum_nights') {
      const lowerVal = value[0] as Number;
      const upperVal = value[1] as Number;

      if (lowerVal === 0 && upperVal === 30) {
        tempFilteredListings = listings;
      } else if (lowerVal !== 0 && upperVal === 30) {
        listings.forEach(listing => {
          if (listing[filter] && listing[filter] >= lowerVal) {
            tempFilteredListings.push(listing);
          }
        });
      } else {
        listings.forEach(listing => {
          if (listing[filter] && listing[filter] >= lowerVal && listing[filter] <= upperVal) {
            tempFilteredListings.push(listing);
          }
        });
      }
    }

    // hostType and amenities logic code needs refactoring. It's not scalable to 2+ filter criterias right now.
    if (filter === 'hostType') {
      if (value['independent'] && !value['professional']) {
        listings.forEach(listing => {
          if (
            listing.hostListingCount &&
            listing.hostListingCount >= 1 &&
            listing.hostListingCount <= 4
          ) {
            tempFilteredListings.push(listing);
          }
        });
      } else if (!value['independent'] && value['professional']) {
        listings.forEach(listing => {
          if (listing.hostListingCount && listing.hostListingCount >= 5) {
            tempFilteredListings.push(listing);
          }
        });
      } else if (value['independent'] && value['professional']) tempFilteredListings = listings;
      else tempFilteredListings = [];
    }

    if (filter === 'amenities') {
      if (value['pool']) {
        listings.forEach(listing => {
          if (listing.pool && listing.pool === 't') {
            tempFilteredListings.push(listing);
          }
        });
      }
      if (value['hot_tub']) {
        listings.forEach(listing => {
          if (listing.hot_tub && listing.hot_tub === 't') {
            tempFilteredListings.push(listing);
          }
        });
      }
      if (value['all']) {
        tempFilteredListings = listings;
      }
    }

    filteredListingsList.push(tempFilteredListings);
  });

  // Applying AND to the filtered results
  filteredListings = filteredListingsList.reduce((a, b) => a.filter(c => b.includes(c)));
  return filteredListings;
};

export const safeMarkersLoad = (listings: Listing[], isUserAllowed: boolean) => {
  let listingsToLoad: Listing[] = [];
  let listingsNotLoaded: Listing[] = [];

  // Priority marker load
  if (isUserAllowed) {
    for (const listing of listings) {
      try {
        if (
          listing.adr[11].adr != -1 &&
          listing.occupancy_rate[11].occupancy_rate != -1 &&
          listing.revenue[11].revenue != -1
        ) {
          listingsToLoad.push(listing);
        }
      } catch (error) {
        console.log('Ignored Error while loading safe marker ', error);
      }

      if (listingsToLoad.length > 500) {
        break;
      }
    }
  }

  if (listingsToLoad.length < 500) {
    listingsNotLoaded = listings.filter(listing => !listingsToLoad.includes(listing));
    if (listingsNotLoaded.length === 0) return listingsToLoad;
    for (const listing of listingsNotLoaded) {
      listingsToLoad.push(listing);
      if (listingsToLoad.length > 500) {
        break;
      }
    }
  }
  return listingsToLoad;
};

export const jsonArrayToCSV = (
  data: {
    [key: string]: number | string;
  }[]
) => {
  let csv = data.map(row => Object.values(row));
  csv.unshift(Object.keys(data[0]));
  return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
};

export const calculateRev = values => {
  let valuesLen = Object.keys(values).length;
  if (valuesLen < 13) {
    return false;
  }

  for (let key in values) {
    values[key] = Number(values[key]);
  }

  let adr = values.adr;
  let availableDay = 365 * values.availability * 0.01;
  let numberOfBookings = values.bookingsPerMonth;
  let cleaningFees = values.cleaningFees;

  let occupancy = values.occupancy * 0.01;

  let purchasedPrice = values.purchasePrice;

  let annualRevenueCalcualtedFromInput =
    adr * availableDay * occupancy + numberOfBookings * 12 * cleaningFees;

  let firstYearRev = values.annualRevenue ? values.annualRevenue : annualRevenueCalcualtedFromInput;
  let firstYearExpense = values.annualExpenses;
  let totalOneOffCost = values.startupCosts + purchasedPrice;

  let firstYearProfit = firstYearRev - firstYearExpense;

  let cac = (firstYearProfit / totalOneOffCost) * 100;
  let netRentalYield = (firstYearProfit / purchasedPrice) * 100;

  let totalRevenues = [firstYearRev];
  let totalExpenses = [firstYearExpense];
  let totalProfits = [firstYearProfit];

  let currentPropertyPrice = values.purchasePrice;

  let profitAccum = totalProfits.reduce((a, b) => a + b, 0);
  let revenueObjs = [
    {
      year: 1 + 2020,
      revenue: firstYearRev,
      expenseAndTax: firstYearExpense,
      profitAccum: profitAccum,
      propertyEvaluation: currentPropertyPrice,
      profitAfterTax: Math.round(firstYearProfit),
    },
  ];
  for (let i = 2; i < 31; i++) {
    firstYearRev = firstYearRev + firstYearRev * 0.01 * values.annualADRIncrease;

    firstYearExpense = firstYearExpense + firstYearExpense * 0.01 * values.expenseIncrease;

    let profit = firstYearRev - firstYearExpense;

    currentPropertyPrice =
      currentPropertyPrice + currentPropertyPrice * 0.01 * values.annualAppreciation;

    totalProfits.push(profit);
    totalRevenues.push(firstYearRev);
    totalExpenses.push(firstYearExpense);
    profitAccum = totalProfits.reduce((a, b) => a + b, 0);

    revenueObjs.push({
      year: i + 2020,
      revenue: Math.round(firstYearRev),
      expenseAndTax: Math.round(firstYearExpense),
      profitAccum: Math.round(profitAccum),
      propertyEvaluation: Math.round(currentPropertyPrice),
      profitAfterTax: Math.round(firstYearProfit),
    });
  }

  let returnObj = {
    cac: Math.round(cac),
    firstYearRev: Math.round(firstYearRev),
    firstYearProfitAfterTax: Math.round(firstYearExpense),
    firstYearTax: Math.round(0),
    firstYearExpense: Math.round(firstYearExpense),
    netRentalYield: Math.round(netRentalYield),
    netOperatingIncome: Math.round(firstYearRev - firstYearExpense),
    revenueObjs: revenueObjs,
  };
  return returnObj;
};

export const titleCase = (str: string) => {
  try {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  } catch (e) {
    console.log('Error in titleCase function', e);
    return str;
  }
};

export const processAirbnbAuthResponse = response => {
  let error = '';
  if (
    response.action === 'wrong_credentials' ||
    response.action === 'wrong_code' ||
    response.action === 'support' ||
    response.action === 'failed'
  ) {
    error = response.action;
  }
  return {
    action: response.action,
    captcha_url: response.hasOwnProperty('airlock_url') ? response.airlock_url : '',
    airlock_id: response.hasOwnProperty('airlock_id') ? response.airlock_id : '',
    user_id: response.hasOwnProperty('userID') ? response.userID : '',
    error: error,
  };
};

export const getDynamicADR = (listings: Listing[]) => {
  let dynamicADR: ADR[] = [];
  let adrCount: number[] = [];

  if (listings.length > 0) {
    listings[0].adr.map((adrObj, index) => {
      dynamicADR[index] = {
        date: adrObj.date,
        adr: 0,
      };
      adrCount[index] = 0;
    });

    listings.map((listing: Listing) => {
      for (let index = 0; index < 12; index++) {
        dynamicADR[index].date = listing.adr[index].date;

        if (listing.adr[index].adr != -1) {
          dynamicADR[index].adr += listing.adr[index].adr;
          adrCount[index] += 1;
        }
      }
    });

    dynamicADR.map((adrObj, index) => {
      if (adrCount[index] != 0) {
        adrObj.adr = Math.round(adrObj.adr / adrCount[index]);
      }
    });
  }

  return dynamicADR;
};

export const getDynamicOccupancyRate = (listings: Listing[]) => {
  let dynamicOccupancyRate: OccupancyRate[] = [];
  let occupancyRateCount: number[] = [];

  if (listings.length > 0) {
    listings[0].occupancy_rate.map((adrObj, index) => {
      dynamicOccupancyRate[index] = {
        date: adrObj.date,
        occupancy_rate: 0,
      };
      occupancyRateCount[index] = 0;
    });

    listings.map((listing: Listing) => {
      for (let index = 0; index < 12; index++) {
        dynamicOccupancyRate[index].date = listing.adr[index].date;

        if (listing.occupancy_rate[index].occupancy_rate != -1) {
          dynamicOccupancyRate[index].occupancy_rate +=
            listing.occupancy_rate[index].occupancy_rate;
          occupancyRateCount[index] += 1;
        }
      }
    });

    dynamicOccupancyRate.map((ocupancyRateObj, index) => {
      if (occupancyRateCount[index] != 0) {
        ocupancyRateObj.occupancy_rate = Math.round(
          ocupancyRateObj.occupancy_rate / occupancyRateCount[index]
        );
      }
    });
  }

  return dynamicOccupancyRate;
};

export const getDynamicRev = (listings: Listing[]) => {
  let dynamicRev: Revenue[] = [];
  // implement this
  //to write those lines of codes I relied on how the other two cards were constructed
  let revenyRateCount: number[] = [];
  if (listings.length > 0) {
    listings[0].revenue.map((adrObj, index) => {
      dynamicRev[index] = {
        date: adrObj.date,
        revenue: 0,
      };
      revenyRateCount[index] = 0;
    });

    listings.map((listing: Listing) => {
      for (let index = 0; index < 12; index++) {
        dynamicRev[index].date = listing.adr[index].date;
        if (listing.revenue[index].revenue != -1) {
          dynamicRev[index].revenue += listing.revenue[index].revenue;
          revenyRateCount[index] += 1;
        }
      }
    });

    dynamicRev.map((revenyRateObj, index) => {
      //round the number by division (revObj.revenue / revCount[index])
      if (revenyRateCount[index] != 0) {
        revenyRateObj.revenue = Math.round(revenyRateObj.revenue / revenyRateCount[index]);
      }
    });
  }

  return dynamicRev;
};

export const getDynamicExtraFees = (listings: Listing[]) => {
  let dynamicExtraFees: UtilityData = {};
  let cleaningFee = 0;
  let cleaningFeeCount = 0;
  let additionalPersonFee = 0;
  let additionalPersonFeeCount = 0;

  if (listings.length > 0) {
    listings.map((listing: Listing) => {
      if (listing.cleaningFee) {
        cleaningFee += listing.cleaningFee;
        cleaningFeeCount += 1;
      }
      if (listing.extraGuestFee) {
        additionalPersonFee += listing.extraGuestFee;
        additionalPersonFeeCount += 1;
      }
    });

    if (cleaningFeeCount != 0) {
      dynamicExtraFees.cleaningFee = Math.round(cleaningFee / cleaningFeeCount);
    }
    if (additionalPersonFeeCount != 0) {
      dynamicExtraFees.additionalPersonFee = Math.round(
        additionalPersonFee / additionalPersonFeeCount
      );
    }
  }

  return dynamicExtraFees;
};

export const returnLoadingText = (emptySearchBar: boolean) => {
  if (emptySearchBar) {
    return '';
  } else {
    return 'loading...';
  }
};

export const getHeatmapTitle = (heatmapMode: {
  showRevenue: boolean;
  showOccupancyRate: boolean;
  showNightlyRate: boolean;
}) => {
  if (heatmapMode.showOccupancyRate) {
    return 'Occupancy Rate';
  }
  if (heatmapMode.showNightlyRate) {
    return 'Nightly Rate';
  }
  return 'Annual Revenue';
};

export const getHeatmapWeigth = (
  listing: Listing,
  heatmapMode: {
    showRevenue: boolean;
    showOccupancyRate: boolean;
    showNightlyRate: boolean;
  }
) => {
  if (heatmapMode.showOccupancyRate) {
    let occupancyRateBucket = [] as number[];
    listing.occupancy_rate.forEach(occupancyRateObj => {
      if (occupancyRateObj.occupancy_rate != -1) {
        occupancyRateBucket.push(occupancyRateObj.occupancy_rate);
      }
    });
    const occupancyRateSum = occupancyRateBucket.reduce((a, b) => a + b, 0);
    const avgOccupancyRate =
      occupancyRateBucket.length > 0 ? occupancyRateSum / occupancyRateBucket.length : 0;
    return avgOccupancyRate;
  }

  if (heatmapMode.showNightlyRate) {
    let nightlyRateBucket = [] as number[];
    listing.adr.forEach(nightlyRateObj => {
      if (nightlyRateObj.adr != -1) {
        nightlyRateBucket.push(nightlyRateObj.adr);
      }
    });
    const nightlyRateSum = nightlyRateBucket.reduce((a, b) => a + b, 0);
    const avgNightlyRate =
      nightlyRateBucket.length > 0 ? nightlyRateSum / nightlyRateBucket.length : 0;
    return avgNightlyRate;
  }

  let revBucket = [] as number[];
  listing.revenue.forEach(revenueObj => {
    if (revenueObj.revenue != -1) {
      revBucket.push(revenueObj.revenue);
    }
  });
  const annualRevenue = revBucket.reduce((a, b) => a + b, 0);
  return annualRevenue;
};

export const getListViewData = (listings: Listing[], isDisabled: boolean) => {
  let listViewData: ListViewData[] = [];
  listViewData = listings.map((listing, index) => {
    let adrBucket = [] as number[];
    let occupancyRateBucket = [] as number[];
    let revenueBucket = [] as number[];
    let avgNightlyRate = -1;
    let avgOccupancyRate = -1;
    let avgRevenue = -1;

    listing.adr.forEach(item => {
      if (item.adr != -1) {
        adrBucket.push(item.adr);
      }
    });
    avgNightlyRate =
      adrBucket.length > 0
        ? Math.round(adrBucket.reduce((a, b) => a + b, 0) / adrBucket.length)
        : -1;

    if (!isDisabled) {
      listing.occupancy_rate.forEach(item => {
        if (item.occupancy_rate != -1) {
          occupancyRateBucket.push(item.occupancy_rate);
        }
      });
      listing.revenue.forEach(item => {
        if (item.revenue != -1) {
          revenueBucket.push(item.revenue);
        }
      });
      avgOccupancyRate =
        occupancyRateBucket.length > 0
          ? Math.round(occupancyRateBucket.reduce((a, b) => a + b, 0) / occupancyRateBucket.length)
          : -1;
      avgRevenue =
        revenueBucket.length > 0
          ? Math.round(revenueBucket.reduce((a, b) => a + b, 0) / revenueBucket.length)
          : -1;
    }
    return {
      ...listing,
      id: index + 1,
      avgNightlyRate: avgNightlyRate,
      avgOccupancyRate: avgOccupancyRate,
      avgRevenue: avgRevenue,
    };
  });

  const sortedListViewData = listViewData.sort((a, b) => {
    if (a.avgRevenue > b.avgRevenue) {
      return -1;
    }
    if (a.avgRevenue < b.avgRevenue) {
      return 1;
    }
    return 0;
  });

  return sortedListViewData;
};
