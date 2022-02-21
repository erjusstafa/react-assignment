import { createMuiTheme } from '@material-ui/core/styles';
import { COLOR_PRIMARY } from 'src/const';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: COLOR_PRIMARY,
    },
  },
});
