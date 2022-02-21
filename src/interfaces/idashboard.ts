// global interfaces for dashboard

// Dashboard State

export interface DashboardState {
  showOverviewDashboard: boolean;
  showGuestsDashboard: boolean;
  showRevenueDashboard: boolean;
  showPricingDashboard: boolean;
  showEstimatorDashboard: boolean;
  showSettingsDashboard: boolean;
  showInsightsDashboard: boolean;
}
// Marker Listing

export interface Revenue {
  date: string;
  revenue: number;
}

export interface Listing {
  adr: ADR[];
  accommodates: number;
  bathrooms: number;
  bedrooms: string;
  latitude: number;
  listingID: number;
  listing_url: string;
  longitude: number;
  name: string;
  occupancy_rate: OccupancyRate[];
  review_scores_rating: number;
  revenue: Revenue[];
  room_type: string;
  property_type: string;
  thumbnail_url: string;
  host_name: string;
  minimum_nights: number;
  hostListingCount: number;
  cleaningFee: number;
  extraGuestFee: number;
  pool: string;
  hot_tub: string;
  cancellation_policy: string;
  pet_friendly: string;
  activeDaysCount: number;
  isListingAddedInLast12Months: string;
}

export interface ListViewData {
  adr: ADR[];
  accommodates: number;
  bathrooms: number;
  bedrooms: string;
  latitude: number;
  listingID: number;
  listing_url: string;
  longitude: number;
  name: string;
  occupancy_rate: OccupancyRate[];
  review_scores_rating: number;
  revenue: Revenue[];
  room_type: string;
  property_type: string;
  thumbnail_url: string;
  host_name: string;
  minimum_nights: number;
  hostListingCount: number;
  cleaningFee: number;
  extraGuestFee: number;
  pool: string;
  hot_tub: string;
  cancellation_policy: string;
  pet_friendly: string;
  activeDaysCount: number;
  id: number;
  avgNightlyRate: number;
  avgOccupancyRate: number;
  avgRevenue: number;
}

export interface VRBOListing {
  listingID: string;
  latitude: number;
  longitude: number;
}

// Tailored Region Markers
export interface TailoredRegionMarkers {
  latitude: number;
  listingID: number;
  longitude: number;
  room_type: string;
}

// Search

export interface Search {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  polygon: string;
  multiPolygon: string;
  countryCode: string;
  bounds: number[];
}

// Bounds

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface Bounds {
  nw: Coordinates;
  se: Coordinates;
  sw: Coordinates;
  ne: Coordinates;
}

// ADR
export interface ADR {
  date: string;
  adr: number;
}

// Amenities

export interface AmenitiesAndResearchData {
  count: number;
  revPar: number;
}

export interface AmenitiesAndResearch {
  pool: AmenitiesAndResearchData;
  hotTub: AmenitiesAndResearchData;
  petFriendly: AmenitiesAndResearchData;
  flexibleCancellationPolicy: AmenitiesAndResearchData;
  moderateCancellationPolicy: AmenitiesAndResearchData;
  strictCancellationPolicy: AmenitiesAndResearchData;
}

export interface Guest {
  Languages: string;
  cities: string;
  countries: string;
  history: string;
  reviewcloud: any; // need fix
}

export interface Market {
  count: number;
}

export interface MarketOverviewAPIResponse {
  airbnb: Market;
  fiveBedroom: Market;
  fivePlusBedroom: Market;
  fourBedroom: Market;
  hotelRoom: Market;
  oneBedroom: Market;
  privateRoom: Market;
  sharedRoom: Market;
  studio: Market;
  threeBedroom: Market;
  twoBedroom: Market;
  vrbo: number;
}

export interface OccupancyRate {
  date: string;
  occupancy_rate: number;
}

export interface PacingData {
  'Available Daily Rate': number;
  'Booked Daily Rate': number;
  date: string;
}

export interface PacingPerPriceData {
  'Available Nights': number;
  'Booked Nights': number;
  date: string;
}

export interface MetaPerPrice {
  listingIDs: number[];
  occupancyRate: number;
  pacing: PacingPerPriceData[];
  priceRange: {
    high: number | null;
    low: number | null;
  };
  supply: number;
}

export interface PacingPerPrices {
  meta: {
    keys: string[];
  };
  priceA: MetaPerPrice;
  priceB: MetaPerPrice;
  priceC: MetaPerPrice;
  priceD: MetaPerPrice;
  priceE: MetaPerPrice;
}

export interface ResearchToolDiff {
  name: string;
  value: number;
}

export interface Revenues {
  r10: number;
  r25: number;
  r50: number;
  r75: number;
}

export interface Graph {
  area_info: {
    name: string;
    size: string;
    updatedDate: string;
  };
  email: string;
  guest: any;
  isPremium: boolean;
  isUserAllowed: boolean;
  marketOverview: MarketOverviewAPIResponse;
  regions: string[]; // need fix
  userName: string;
  nograph?: boolean;
  notImported?: boolean;
  credits: Number;
}

// Stats Per ADR

export interface MultipleCounter {
  bathrooms: UtilityData;
  cancellation_policy: UtilityData;
  ptype: UtilityData;
}

export interface StatsPerADR {
  counter: {
    distribution: UtilityData;
    total: number;
  };
  multipleChoiceCounter: MultipleCounter;
  requestInfo: {
    city: string;
    countryCode: string;
    name: string;
    priceHighBound: string; // need fix
    priceLowBound: string; // need fix
  };
}

// Review Stream

export interface FrequentWord {
  frequency: number;
  id: number;
  word: string;
}

export interface RecentReview {
  city: string;
  comments: string;
  country: string;
  created_at: string;
  id: number;
  rating: number;
}

export interface ReviewStream {
  frequentWords: {
    frequentWordList: FrequentWord[];
    maxFrequency: number;
  };
  recentReviews: RecentReview[];
}

// Filters

export interface Filters {
  propertyType: string;
  hostType: string;
  amenities: string;
  performance: string;
}

// Meta Description Set

export interface MetaDescriptionSet {
  copy: string;
  suffix: string;
}

// Market Overview Pie

export interface MarketOverViewPie {
  name: string;
  value: number;
}

// Search Object

export interface SearchObject {
  searchName: string;
  name: string;
  lat?: number;
  lng?: number;
  polygon?: string | null;
  multiPolygon?: string | null;
  city?: string;
  country?: string;
  countryCode?: string;
  bounds?: number[];
  isDefaultOption?: boolean;
}

// Guest Languages, Amentities, Cleaning Fee, Extra Guest Fee, Cancellation Policy

export interface UtilityData {
  [index: string]: number;
}

// Booking Changes

export interface RateAndAvailChanges {
  [index: string]: string | number;
}

export interface BookingLeads {
  '10': number;
  '20': number;
  '30': number;
  '40': number;
  '50': number;
  '60': number;
  '70': number;
  '80': number;
  '90': number;
}

export interface AverageStayLengths {
  '25': number;
  '50': number;
  '75': number;
}

export interface BookingRates {
  '7': number;
  '14': number;
  '21': number;
  '35': number;
}

export interface BookingChanges {
  date_list: string[];
  last_snapshot: string;
  current_snapshot: string;
  next_update: string;
  rate_and_avail_changes: RateAndAvailChanges[];
}

export interface Compset {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  updatedOn: string;
  listingIDs: number[];
}

export interface revCalReturnObj {
  cac: number;
  firstYearRev: number;
  firstYearProfitAfterTax: number;
  firstYearTax: number;
  firstYearExpense: number;
  netRentalYield: number;
  revenueObjs: {
    year: number;
    revenue: number;
    expenseAndTax: any;
    profitAccum: number;
    propertyEvaluation: any;
    profitAfterTax: number;
  }[];
}

export interface profitCalReturnObj {
  monthlyProfit: number;
  graphVal: {
    nMonths: number;
    nMonthsTotalExpense: number;
    nMonthsTotalRev: number;
  }[];
}

export interface CalculatorInputField {
  key: string;
  label: string;
  tooltip: string;
  input: boolean;
  subfields?: { key: string; label: string; unit: string }[];
}

export interface MarketHistory {
  [index: string]: number;
}

export interface AddressObj {
  address: string;
  isDefaultOption?: boolean;
}
