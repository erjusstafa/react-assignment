import {
  Graph,
  StatsPerADR,
  ReviewStream,
  Search,
  Listing,
  FrequentWord,
  RecentReview,
  OccupancyRate,
  ADR,
  UtilityData,
  MarketOverViewPie,
  PacingData,
  ResearchToolDiff,
  Revenues,
  BookingChanges,
  BookingLeads,
  BookingRates,
  Revenue,
  RateAndAvailChanges,
  AverageStayLengths,
  TailoredRegionMarkers,
  AmenitiesAndResearch,
  VRBOListing,
  DashboardState,
  Compset,
  MarketHistory,
} from './idashboard';
import { User } from './iuser';
import { GridColDef } from '@mui/x-data-grid';

// Dashboard Prop Types

export interface GraphProp {
  loading: boolean;
  data: Graph;
}

export interface ListingsProp {
  loading: boolean;
  data: Listing[];
}

export interface VRBOListingsProp {
  loading: boolean;
  data: VRBOListing[];
}

export interface StatsPerADRProp {
  loading: boolean;
  data: StatsPerADR;
}

export interface ReviewStreamProp {
  loading: boolean;
  data: ReviewStream;
}

export interface SearchProp {
  loading: boolean;
  data: Search;
}

export interface BookingChangesProp {
  loading: boolean;
  data: BookingChanges;
}

export interface FilteredBookingsProp {
  loading: boolean;
  data: RateAndAvailChanges[];
}

export interface CompsetsProp {
  loading: boolean;
  data: Compset[];
}

export interface CompsetProp {
  loading: boolean;
  data: Compset;
}

export interface CompsetListingIDsProp {
  loading: boolean;
  data: number[];
}

export interface DashboardPropTypes {
  setVisibleListings; // need fix
  getMarkersLoadEnd; // need fix
  getMarkers; // need fix
  getGraphData; // need fix
  getReviewStream; // need fix
  listings: ListingsProp;
  vrboListings: VRBOListingsProp;
  visibleListings: ListingsProp;
  visibleVRBOListings: VRBOListingsProp;
  multipleMarkersCallLoading: Boolean;
  tailoredRegionMarkers: TailoredRegionMarkers[];
  graph: GraphProp;
  reviewStream: ReviewStreamProp;
  bookingChanges: BookingChangesProp;
  filteredBookings: FilteredBookingsProp;
  search: SearchProp;
  compsets: CompsetsProp;
  compset: CompsetProp;
  compsetListingIDs: CompsetListingIDsProp;
  user: User;
  getSearch; // need fix
  searchChange; // need fix
  resetFilter; // need fix
  getTokenThunk; // need fix
  getUserInfo; // need fix
  getBookingChanges;
  getTailoredRegionMarkers;
  getVRBOMarkers;
  setVisibleVRBOListings;
  compsetCRUD;
  getCompsetListingIdsLoadStart;
  setCompsetListingIds;
  isUserAllowed;
  marketHistory: MarketHistoryProp;
  getMarketHistory;
}

// Guest Dashboard Props

export interface GuestDashboardPropTypes {
  graph: GraphProp;
  visibleListings: ListingsProp;
  isUserAllowed: boolean;
  search: SearchProp;
  reviewStream: ReviewStreamProp;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Main Dashboard Props

export interface OverviewDashboardPropTypes {
  search: SearchProp;
  isUserAllowed: boolean;
  isAdmin: boolean;
  listings: ListingsProp;
  vrboListings: VRBOListingsProp;
  multipleMarkersCallLoading: Boolean;
  titleCase: (str: string) => string;
  visibleListings: ListingsProp;
  sample: boolean;
  dashboardState: DashboardState;
  openAlert: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setBoundedListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  setFilteredListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  setVisibleListings;
  visibleVRBOListings: VRBOListingsProp;
  setVisibleVRBOListings;
  matches: boolean;
  filterApplied: boolean;
  getMarkersLoadEnd;
  dynamicTrigger: boolean;
  setDynamicTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overviewDashboardMode: {
    showInvesting: boolean;
    showRentalArbitrage: boolean;
  };
  toggleOverviewDashboardMode: (event: string) => void;
}

// Pricing Dashboard Props

export interface PricingDashboardPropTypes {
  totalNumberOfListings: number;
  search: SearchProp;
  bookingChanges: BookingChangesProp;
  filteredBookings: FilteredBookingsProp;
  getBookingChanges;
  compsetFilterVal: CompsetFilterVal[];
  setCompsetFilterVal: React.Dispatch<React.SetStateAction<CompsetFilterVal[]>>;
  page: Number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filterTriggered: Boolean;
  compsets: CompsetsProp;
  compset: CompsetProp;
  compsetListingIDs: CompsetListingIDsProp;
  getCompsetListingIdsLoadStart;
  setCompsetListingIds;
  compsetCRUD;
  compsetID: string;
  idle: boolean;
  setIdle: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deletedRows?: number[];
  setDeletedRows?: React.Dispatch<React.SetStateAction<number[]>>;
  currentCompsetID: string;
  setCurrentCompsetID: React.Dispatch<React.SetStateAction<string>>;
  currentCompsetName: string;
  setCurrentCompsetName: React.Dispatch<React.SetStateAction<string>>;
  matches: boolean;
}

// Research Dashboard Props

export interface ResearchDashboardPropTypes {
  graph: GraphProp;
  totalNumberOfListings: number;
  isUserAllowed: boolean;
  search: SearchProp;
  classes: any;
}

// Seasonality Dashboard Props

export interface SeasonalityDashboardPropTypes {
  graph: GraphProp;
  totalNumberOfListings: number;
  isUserAllowed: boolean;
  search: SearchProp;
  classes: any;
}

// Sidebar Props

export interface SidebarProps {
  parent: string;
  handleMarketSidebarClick?: (event: string) => void;
  handlePricingSidebarClick?: (event: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matches: boolean;
  selectedSidebarIndex: number;
  handleSidebarListItemClick: (index: number) => void;
}

// Register/Login Props

export interface RegisterPropTypes {
  registerThunk;
  getTokenThunk;
  loading: boolean;
  error: boolean;
  redirectToLoginPage: () => void;
  setShowVideo?: React.Dispatch<React.SetStateAction<boolean>>;
  getUserInfo?;
  lang?: string;
  page?: string;
  type?: string;
  region?: string;
  landing?: string;
  device?: string;
}

export interface LoginPropTypes {
  loginThunk;
  getTokenThunk;
  loading: boolean;
  error: boolean;
  redirectToSignupPage: () => void;
}

// OnboardingModal Props

export interface OnboardingModalPropTypes {
  getTokenThunk;
  setIsTailoredRegionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tailoredRegionMarkers: TailoredRegionMarkers[];
  getTailoredRegionMarkers;
}

// Header Props

export interface FilterVal {
  roomType: string;
  bedrooms: number[];
  bathrooms: number[];
  accommodates: number[];
  minimum_nights: number[];
  hostType: {
    independent: boolean;
    professional: boolean;
  };
  amenities: {
    pool: boolean;
    hot_tub: boolean;
    all: boolean;
  };
}

export interface CompsetFilterVal {
  id: number;
  column: string;
  operator: string;
  value: string | number;
}

export interface FiltersRibbonPropTypes {
  sidebarOpen?: boolean;
  resetFilter;
  getSearch;
  search: SearchProp;
  searchChange;
  logoutThunk?;
  user?: User;
  isLoggedIn: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterChange: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  setdashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
  matches: boolean;
}

export interface HeaderPropTypes {
  resetFilter;
  getSearch;
  search: SearchProp;
  searchChange;
  logoutThunk?;
  graph: GraphProp;
  user?: User;
  isLoggedIn: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterChange: React.Dispatch<React.SetStateAction<boolean>>;
  filterOpen: boolean;
  toggleDrawer: () => void;
  setFilteredListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  dashboardState: DashboardState;
  setdashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
  openAlert: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  matches: boolean;
  filterApplied: boolean;
  handleMarketSidebarClick: (event: string) => void;
  sample: boolean;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PricingHeaderPropTypes {
  sidebarOpen: boolean;
  logoutThunk;
  user: User;
}

// SearchBar Props

export interface SearchBarPropTypes {
  getSearch;
  search: SearchProp;
  searchChange;
  showAlert: () => void;
  notShowAlert: () => void;
  resetFilter;
  isLoggedIn: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterChange: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  setdashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
  matches: boolean;
}

// Top Ribbon Props

export interface TopRibbonPropTypes {
  logoutThunk;
  graph: GraphProp;
  user: User;
  filterOpen: boolean;
  toggleDrawer: () => void;
  dashboardState: DashboardState;
  openAlert: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterApplied: boolean;
  handleMarketSidebarClick: (event: string) => void;
  sample: boolean;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// AreaChartRatioCard Props

export interface AreaChartRatioCardPropTypes {
  title: string;
  data: string;
  date: string;
  isDisabled: boolean;
  search: SearchProp;
  totalSupply: number;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// DataGridCard Props

export interface DataGridCardPropTypes {
  cardTitle: string;
  rowData: FrequentWord[] | RecentReview[] | any; // create interface for IBAS rows
  colData: GridColDef[];
  height: number;
  lastSnapshot?: string;
  currentSnapshot?: string;
  nextUpdate?: string;
  customClasses?: any;
  tooltip?: boolean;
  deletedRows?: number[];
  setDeletedRows?: React.Dispatch<React.SetStateAction<number[]>>;
}

// DigestCardProps

export interface DigestCardPropTypes {
  title: string;
  data: ADR[] | OccupancyRate[] | Revenue[];
  color: string;
  isDisabled: boolean;
  multipleMarkersCallLoading: Boolean;
  dynamicTrigger: boolean;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// HorizontalBarCard Props

export interface HorizontalBarProps {
  title: string;
  data: UtilityData;
  color: string;
  unit: string;
  totalSupply: number;
  isDisabled: boolean;
  search: SearchProp;
  dynamicTrigger: boolean;
  setSubscriptionModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HorizontalDoubleBarPropTypes {
  title: string;
  data: AmenitiesAndResearch;
  color: string;
  totalSupply: number;
  isDisabled: boolean;
  search: SearchProp;
  unit: string;
  dynamicTrigger: boolean;
}

// PieCard Props

export interface PieCardPropTypes {
  overviewData: number;
  innerPieData: MarketOverViewPie[];
  outerPieData: MarketOverViewPie[];
  dynamicTrigger: boolean;
}

// PricingHorizontalBarChart Props

export interface PricingHorizontalBarChartPropTypes {
  cardTitle: string;
  data: UtilityData;
  maxData: number;
  colors: string[];
}

// PricingPieChart Props

export interface PricingPieChartPropTypes {
  cardTitle: string;
  data: UtilityData;
  colors: string[];
}

// RateAnalysisChart Props

export interface RateAnalysisPropTypes {
  cardTitle: string;
  data: PacingData[];
  colors: {
    color1: string;
    color2: string;
  };
  titles: {
    title1: string;
    title2: string;
  };
  isUserAllowed: boolean;
  search?: SearchProp;
  totalSupply?: number;
  updatedDate?: string;
  isRange: boolean;
  referenceAvailData?: number;
}

// ResearchBarChart Props

export interface ResearchBarChartPropTypes {
  isUserAllowed: boolean;
  totalSupply: number;
  updatedDate: string;
  cardTitle: string;
  search: SearchProp;
  data: ResearchToolDiff[];
  unit: string;
}

// Rev Simulation Props

export interface RevSimulationPropTypes {
  data: {
    year: number;
    revenue: number;
    expenseAndTax: any;
    profitAccum: number;
    propertyEvaluation: any;
    profitAfterTax: number;
  }[];
  currency: string;
}

// RevText Prop Types

export interface RevTextPropTypes {
  cac: number;
  netRentalYield: number;
  firstYearProfitAfterTax: number;
  firstYearRev: number;
  firstYearTax: number;
  firstYearExpense: number;
  currency: string;
  data: {
    year: number;
    revenue: number;
    expenseAndTax: any;
    profitAccum: number;
    propertyEvaluation: any;
    profitAfterTax: number;
  }[];
}

// VerticalBar Props

export interface VerticalBardCardPropTypes {
  title: string;
  data: MarketHistory | BookingLeads | BookingRates | AverageStayLengths;
  isDisabled: boolean;
  state?: {
    showHistoricalADR: boolean;
    showHistoricalOR: boolean;
    showHistoricalRev: boolean;
  };
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  search?: SearchProp;
  totalSupply?: number;
  height: number;
  setSubscriptionModalOpen?;
}

// GridCellExpand Props

export interface GridCellExpandProps {
  value: string;
  width: number;
}

// TabPanel Props

export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

// Pricing MarketView Props
export interface PricingMarketViewPropTypes {
  graph: GraphProp;
  statsPerADR: StatsPerADRProp;
  totalNumberOfListings: number;
  isUserAllowed: boolean;
  search: SearchProp;
  pricingState: string;
  handlePricingClick: (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    newPricingState: string,
    low: number | null,
    high: number | null
  ) => void;
}

// Pricing ListingView Props

export interface PricingListingViewPropTypes {
  bookingChanges: BookingChangesProp;
  search: SearchProp;
  totalNumberOfListings: number;
  filteredBookings: FilteredBookingsProp;
  getBookingChanges;
  compsetFilterVal: CompsetFilterVal[];
  setCompsetFilterVal: React.Dispatch<React.SetStateAction<CompsetFilterVal[]>>;
  page: Number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filterTriggered: Boolean;
  compsets: CompsetsProp;
  compset: CompsetProp;
  compsetListingIDs: CompsetListingIDsProp;
  getCompsetListingIdsLoadStart;
  setCompsetListingIds;
  compsetCRUD;
  compsetID: string;
  idle: boolean;
  setIdle: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deletedRows?: number[];
  setDeletedRows?: React.Dispatch<React.SetStateAction<number[]>>;
  currentCompsetID: string;
  setCurrentCompsetID: React.Dispatch<React.SetStateAction<string>>;
  currentCompsetName: string;
  setCurrentCompsetName: React.Dispatch<React.SetStateAction<string>>;
}

export interface TooltipCardPropTypes {
  title?: string;
  content: string;
  link?: string;
  contentAdditional?: string;
}

export interface SubscriptionModalPropTypes {
  countryCode: string;
  countryName: string;
  city: string;
  district: string;
  totalSupply: number;
  getTokenThunk;
  subscriptionModalOpen: boolean;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PaymentPropTypes {
  countryCode: string;
  countryName: string;
  city: string;
  district: string;
  priceSlab: string;
  duration: string;
  promoCode: string;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SettingsDashboardPropTypes {
  user: User;
  getUserInfo;
}

export interface EstimatorDashboardPropTypes {
  user: User;
  isAdmin: boolean;
  setSubscriptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getUserInfo;
  matches: boolean;
}

export interface LoadingCardPropTypes {
  color?: string;
  height: number;
}

export interface ListingsDashboardPropTypes {
  airbnbLoggedIn: boolean;
  setAirbnbLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userAirbnbListings;
  getUserAirbnbListings;
  setCalendarListingID: React.Dispatch<React.SetStateAction<string>>;
  handlePricingSidebarClick: (event: string) => void;
  getListingPricingRecommendation;
  setCompsetID: React.Dispatch<React.SetStateAction<number>>;
  fetchCompset;
}

export interface AirbnbAuthModalPropTypes {
  airbnbAuthModalOpen: boolean;
  setAirbnbAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  airbnbLoggedIn: boolean;
  setAirbnbLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: string;
  captcha_url: string;
  airlock_id: string;
  user_id: string;
  error: string;
  authenticateAirbnb;
}

export interface CustomSwitchPropTypes {
  active: {
    map: boolean;
    list: boolean;
  };
  setActive: React.Dispatch<React.SetStateAction<{ map: boolean; list: boolean }>>;
}

export interface PointerTooltipPropTypes {
  data: Listing;
  component: JSX.Element;
  canDelete?: boolean;
  listings?: Listing[];
  visibleListings?: Listing[];
  getMarkersLoadEnd?;
  setVisibleListings?;
  isDisabled?: boolean;
}

export interface MarketHistoryProp {
  loading: boolean;
  data: MarketHistory;
}
