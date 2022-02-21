import {
  LOGIN_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  REGISTER_ERROR,
  REGISTER_START,
  REGISTER_SUCCESS,
} from './types';

const initialState = {
  loading: false,
  error: false,
};

export const AuthReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
    case LOGIN_START:
      return { ...state, loading: true, error: payload.error };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, error: payload.error };
    case LOGIN_ERROR:
      return { ...state, loading: false, error: payload.error };
    case REGISTER_START:
      return { ...state, loading: true, error: payload.error };
    case REGISTER_SUCCESS:
      return { ...state, loading: false, error: payload.error };
    case REGISTER_ERROR:
      return { ...state, loading: false, error: payload.error };
  }
};
