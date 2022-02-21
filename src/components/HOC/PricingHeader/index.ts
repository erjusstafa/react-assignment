import { connect } from 'react-redux';
import { logoutThunk } from 'src/store/Auth/actions';
import { default as PricingHeaderRoot } from './PricingHeader';

const mapStateToProps = ({ dashboard }) => ({
  user: dashboard.user,
});

export const PricingHeader = connect(mapStateToProps, {
  logoutThunk,
})(PricingHeaderRoot);
