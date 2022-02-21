import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { RoutesMap } from 'src/const';
import Copyright from './Copyright';
import { Alert } from '@material-ui/lab';
import { grey } from '@material-ui/core/colors';
import { LoginPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://airbtics-resource.s3.us-east-2.amazonaws.com/Creativity.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progressBar: {
    width: '100%',
  },
}));

const Login = ({
  loginThunk,
  getTokenThunk,
  loading,
  error,
  redirectToSignupPage,
}: LoginPropTypes) => {
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  const classes = useStyles();
  const handleEmailChange = useCallback(event => {
    changeEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback(event => {
    changePassword(event.target.value);
  }, []);

  const handleLogin = useCallback(
    event => {
      event.preventDefault();

      loginThunk({ email, password });
    },
    [loginThunk, email, password]
  );
  const isLoggedIn = Boolean(getTokenThunk());

  if (isLoggedIn) {
    window.location.reload();
    return <Redirect to={RoutesMap.Home} />;
  }

  return (
    <>
      {loading && <LinearProgress className={classes.progressBar} />}

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error">Password incorrect or no email is found!</Alert>}

        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            onChange={handleEmailChange}
            value={email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onChange={handlePasswordChange}
            value={password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" onClick={redirectToSignupPage} variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </form>
      </div>
    </>
  );
};
/*
const Login = ({ loginThunk, getTokenThunk, loading, error }) => {
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  const classes = useStyles();
  console.log("login mount")
  const handleEmailChange = useCallback(event => {
    changeEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback(event => {
    changePassword(event.target.value);
  }, []);

  const handleLogin = useCallback(
    event => {
      event.preventDefault();

      loginThunk({ email, password });
    },
    [loginThunk, email, password]
  );
  const isLoggedIn = Boolean(getTokenThunk());

  if (isLoggedIn) {
    return <Redirect to={RoutesMap.Home} />;
  }


  return (
    <>
      {loading && <LinearProgress className={classes.progressBar} />}

      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {error && <Alert severity="error">Password incorrect or no email is found!</Alert>}

            <form className={classes.form} noValidate onSubmit={handleLogin}>
              <TextField
                onChange={handleEmailChange}
                value={email}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                onChange={handlePasswordChange}
                value={password}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href={RoutesMap.Register} variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
*/
export default Login;
