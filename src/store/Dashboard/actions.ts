// @ts-nocheck

import { processListing, processVRBOListing } from 'src/utils';
import {
  GET_SEARCH_LOAD_END,
  GET_SEARCH_LOAD_START,
  GET_MARKERS_LOAD_START,
  GET_MARKERS_LOAD_END,
  GET_VRBO_MARKERS_LOAD_START,
  GET_VRBO_MARKERS_LOAD_END,
  GET_VISIBLE_LISTINGS_LOAD_START,
  GET_VISIBLE_LISTINGS_LOAD_END,
  GET_VISIBLE_VRBO_LISTINGS_LOAD_START,
  GET_VISIBLE_VRBO_LISTINGS_LOAD_END,
  GET_MULTIPLE_MARKERS_CALL_LOAD_START,
  GET_MULTIPLE_MARKERS_CALL_LOAD_END,
  SEARCH_CHANGE,
  SET_USER_INFO,
  SET_IS_USER_ALLOWED,
} from 'src/store/Dashboard/types';
import { Listing, Search, VRBOListing } from '../../interfaces/idashboard';
import { User } from '../../interfaces/iuser';
import { AppDispatch } from '../../core/StoreProvier/StoreProvider';

const getMarkersLoadStart = () => ({
  type: GET_MARKERS_LOAD_START,
});

export const getMarkersLoadEnd = (payload: Listing[]) => ({
  type: GET_MARKERS_LOAD_END,
  payload,
});

const getVRBOMarkersLoadStart = () => ({
  type: GET_VRBO_MARKERS_LOAD_START,
});

const getVRBOMarkersLoadEnd = (payload: VRBOListing[]) => ({
  type: GET_VRBO_MARKERS_LOAD_END,
  payload,
});

const getVisibleListingsLoadStart = () => ({
  type: GET_VISIBLE_LISTINGS_LOAD_START,
});

export const setVisibleListings = (payload: Listing[]) => ({
  type: GET_VISIBLE_LISTINGS_LOAD_END,
  payload,
});

const getVisibleVRBOListingsLoadStart = () => ({
  type: GET_VISIBLE_VRBO_LISTINGS_LOAD_START,
});

export const setVisibleVRBOListings = (payload: VRBOListing[]) => ({
  type: GET_VISIBLE_VRBO_LISTINGS_LOAD_END,
  payload,
});

const getMultipleMarkersCallLoadStart = () => ({
  type: GET_MULTIPLE_MARKERS_CALL_LOAD_START,
});

const getMultipleMarkersCallLoadEnd = () => ({
  type: GET_MULTIPLE_MARKERS_CALL_LOAD_END,
});

const getSearchLoadStart = () => ({
  type: GET_SEARCH_LOAD_START,
});

const getSearchLoadEnd = () => ({
  type: GET_SEARCH_LOAD_END,
});

const setUserInfo = (payload: User) => ({
  type: SET_USER_INFO,
  payload,
});

export const setIsUserAllowed = payload => ({
  type: SET_IS_USER_ALLOWED,
  payload,
});

export const resetFilter = () => (dispatch: AppDispatch, getState) => {
  dispatch(getMarkers());
  dispatch(getVRBOMarkers());
};

export const getMarkers = (unlockRegion = false) => async (
  dispatch: AppDispatch,
  getState,
  api
) => {
  dispatch(getMarkersLoadStart());
  dispatch(getVisibleListingsLoadStart());
  dispatch(getMultipleMarkersCallLoadStart());

  const {
    dashboard: { search },
  } = getState();
  const url = 'https://8a8j1g1opk.execute-api.us-east-2.amazonaws.com/default/getMarkers';
  let markerParam = { ...search.data };
  delete markerParam.polygon;
  delete markerParam.multiPolygon;
  delete markerParam.lat;
  delete markerParam.lng;
  delete markerParam.bounds;
  delete markerParam.country;

  if (unlockRegion) {
    markerParam = { ...markerParam, unlockRegion: true };
  }

  let page = 1;

  let listings = [];

  for (let i = 0; i < 15; i++) {
    try {
      markerParam['page'] = page;
      let response = await api(url, { queryParams: markerParam }, true, true);
      let listingsFromBE = processListing(response.message, response.dates);
      let isUserAllowed = response.isUserAllowed;
      dispatch(setIsUserAllowed(isUserAllowed));
      console.log('IS USER ALLOWED [ACTION] ', isUserAllowed);

      listings = listings.concat(listingsFromBE);
      dispatch(getMarkersLoadEnd(listings));
      dispatch(setVisibleListings(listings));
      dispatch(getUserInfo());
      page = page + 1;

      if (response.callAgain == false) {
        // dispatch(getMultipleMarkersCallLoadEnd());
        break;
      }
    } catch (e) {
      console.log('error. Ignore and run again ', e);
    }
  }
  dispatch(getMultipleMarkersCallLoadEnd());
};

export const getVRBOMarkers = () => async (dispatch: AppDispatch, getState, api) => {
  dispatch(getVRBOMarkersLoadStart());
  dispatch(getVisibleVRBOListingsLoadStart());
  const {
    dashboard: { search },
  } = getState();
  const url = 'https://48y4vm0k5j.execute-api.us-east-2.amazonaws.com/default/getMarkersVRBO';
  let markerParam = { ...search.data };
  delete markerParam.polygon;
  delete markerParam.multiPolygon;
  delete markerParam.lat;
  delete markerParam.lng;
  delete markerParam.bounds;
  delete markerParam.country;

  const response = await api(url, { queryParams: markerParam }, false);
  const vrboListings = processVRBOListing(response.message);
  dispatch(getVRBOMarkersLoadEnd(vrboListings));
  dispatch(setVisibleVRBOListings(vrboListings));
};

export const getUserInfo = () => async (dispatch: AppDispatch, __, api, _) => {
  const url = 'https://w1ec9zcvbk.execute-api.us-east-2.amazonaws.com/default/getUserInfo';
  const response = await api(url, {}, true);

  if (response && response.message) {
    let user: User = response.message;
    dispatch(setUserInfo(user));
    console.log('user', user);
  }
};

export const searchChange = (payload: Search) => ({
  type: SEARCH_CHANGE,
  payload,
});

// TODO: Change this to fetch coordinates of city
export const getSearch = () => async (dispatch: AppDispatch) => {
  dispatch(getSearchLoadStart());

  dispatch(getSearchLoadEnd());
};
