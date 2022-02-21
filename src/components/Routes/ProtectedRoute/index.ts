import { connect } from 'react-redux';
import { getTokenThunk } from 'src/store/Auth/actions';
import { default as ProtectedRouteRoot } from './ProtectedRoute';

export const ProtectedRoute = connect(null, { getTokenThunk })(ProtectedRouteRoot);
