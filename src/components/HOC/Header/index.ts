import { connect } from 'react-redux';
import { resetFilter, getSearch, searchChange } from 'src/store/Dashboard/actions';
import { logoutThunk } from 'src/store/Auth/actions';
import { default as HeaderRoot } from './Header';

const mapStateToProps = ({ dashboard }) => ({
  search: dashboard.search,
  graph: dashboard.graph,
  user: dashboard.user,
});

export const Header = connect(mapStateToProps, {
  resetFilter,
  getSearch,
  searchChange,
  logoutThunk,
})(HeaderRoot);
