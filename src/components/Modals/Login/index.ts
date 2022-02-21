import { connect } from 'react-redux';
import { loginThunk, getTokenThunk } from 'src/store/Auth/actions';
import { default as LoginRoot } from './Login';

const mapStateToProps = ({ auth }) => ({
  loading: auth.loading,
  error: auth.error,
});

const mapDispathToProps = {
  loginThunk,
  getTokenThunk,
};

export const Login = connect(mapStateToProps, mapDispathToProps)(LoginRoot);
