import {
  LOGIN_SUCCESS,
  LOGIN_START,
  LOGIN_ERROR,
  REGISTER_ERROR,
  REGISTER_START,
  REGISTER_SUCCESS,
} from './types';
import { AppDispatch } from '../../core/StoreProvier/StoreProvider';
import { AuthErrorState } from './types';

export const loginStart = (payload: AuthErrorState) => ({
  type: LOGIN_START,
  payload,
});

export const loginSuccess = (payload: AuthErrorState) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginError = (payload: AuthErrorState) => ({
  type: LOGIN_ERROR,
  payload,
});

export const registerStart = (payload: AuthErrorState) => ({
  type: REGISTER_START,
  payload,
});

export const registerSuccess = (payload: AuthErrorState) => ({
  type: REGISTER_SUCCESS,
  payload,
});

export const registerError = (payload: AuthErrorState) => ({
  type: REGISTER_ERROR,
  payload,
});

export const getTokenThunk = () => () => localStorage.getItem('auth-token');

export const loginThunk = ({ email, password }) => async (dispatch: AppDispatch, _, api) => {
  dispatch(loginStart({ error: false }));

  const response = await api('https://qlekbww2f4.execute-api.us-east-2.amazonaws.com/login', {
    body: [{ email, password }],
    method: 'post',
  });
  if (
    response &&
    typeof response.message === 'string' &&
    response.message !== 'Internal Server Error'
  ) {
    localStorage.setItem('auth-token', response.message);
    dispatch(loginSuccess({ error: false }));
  } else {
    dispatch(loginError({ error: true })); //TODO: Show a message
  }
};

export const registerThunk = ({
  email,
  password,
  name,
  userDescription,
  lang,
  page,
  type,
  region,
  landing,
  device,
}) => async (dispatch: AppDispatch, _, api) => {
  dispatch(registerStart({ error: false }));
  const response = await api(
    'https://2mamz4uq7g.execute-api.us-east-2.amazonaws.com/default/register',
    {
      body: [
        {
          email,
          password,
          name,
          userDescription,
          lang,
          page,
          type,
          region,
          landing,
          device,
        },
      ],
      method: 'post',
    }
  );
  if (response && response.jwt) {
    localStorage.setItem('auth-token', response.jwt.slice(2, -1));
    dispatch(registerSuccess({ error: false }));

    return true;
  } else {
    dispatch(registerError({ error: true })); // TODO: Send a message

    return false;
  }
};

export const logoutThunk = () => () => localStorage.removeItem('auth-token');
