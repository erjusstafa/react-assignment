import { connect } from 'react-redux';
import { default as EmailVerifyRoot } from './EmailVerify';
import { getSearch } from 'src/store/Dashboard/actions';

const mapStateToProps = ({ dashboard, id }) => ({
  graph: dashboard.graph,
  id: id,
});

export const EmailVerify = connect(mapStateToProps, {
  getSearch,
})(EmailVerifyRoot);
