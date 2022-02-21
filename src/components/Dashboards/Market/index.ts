import { connect } from 'react-redux';
import { default as MarketDashboardRoot } from './MarketDashboard';
import {
  setVisibleListings,
  getMarkers,
  getSearch,
  searchChange,
  resetFilter,
  getUserInfo,
  getVRBOMarkers,
  setVisibleVRBOListings,
  getMarkersLoadEnd,
} from 'src/store/Dashboard/actions';
import { registerThunk, getTokenThunk } from 'src/store/Auth/actions';

const mapStateToProps = ({ dashboard }) => ({
  listings: dashboard.listings,
  vrboListings: dashboard.vrboListings,
  visibleListings: dashboard.visibleListings,
  visibleVRBOListings: dashboard.visibleVRBOListings,
  multipleMarkersCallLoading: dashboard.multipleMarkersCallLoading,
  search: dashboard.search,
  user: dashboard.user,
  isUserAllowed: dashboard.isUserAllowed,
});

export const MarketDashboard = connect(mapStateToProps, {
  setVisibleListings,
  getMarkersLoadEnd,
  getMarkers,
  getSearch,
  registerThunk,
  getTokenThunk,
  searchChange,
  resetFilter,
  getUserInfo,
  getVRBOMarkers,
  setVisibleVRBOListings,
})(MarketDashboardRoot);
