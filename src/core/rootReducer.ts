import { combineReducers } from 'redux';

import { dashboardReducer } from 'src/store/Dashboard/reducer';
import { AuthReducer } from 'src/store/Auth/reducer';

export const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  auth: AuthReducer,
});
