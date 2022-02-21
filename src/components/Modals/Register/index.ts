import { connect } from 'react-redux';
import { registerThunk, getTokenThunk } from 'src/store/Auth/actions';
import { default as RegisterRoot } from './Register';

const mapStateToProps = ({ auth }) => ({
  loading: auth.loading,
  error: auth.error,
});

const mapDispathToProps = {
  registerThunk,
  getTokenThunk,
};

export const Register = connect(mapStateToProps, mapDispathToProps)(RegisterRoot);
