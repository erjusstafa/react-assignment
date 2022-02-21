import React, { useCallback, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { RoutesMap } from 'src/const';
import { callApi } from 'src/core/callApi';
import Copyright from './Copyright';
import { RegisterPropTypes } from 'src/interfaces/iproptypes';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://airbtics-resource.s3.us-east-2.amazonaws.com/quote.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
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
  formControl: {
    marginTop: 15,
  },
}));

const userDescriptionMap = ['property_investor', 'property_manager', 'tourism', 'unclassified'];
const setMarketingTrackingURL =
  'https://4b5jgzfm05.execute-api.us-east-2.amazonaws.com/default/setMarketingTracking';

const Login = ({
  registerThunk,
  getTokenThunk,
  loading,
  error,
  redirectToLoginPage,
  setShowVideo,
  getUserInfo,
  lang,
  page,
  type,
  region,
  landing,
  device,
}: RegisterPropTypes) => {
  const classes = useStyles();
  const history = useHistory();
  const isLoggedIn = Boolean(getTokenThunk());

  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  const [name, changeName] = useState('');
  const [userDescription, changeUserDescription] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleEmailChange = useCallback(event => {
    changeEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback(event => {
    changePassword(event.target.value);
  }, []);

  const handleNameChange = useCallback(event => {
    changeName(event.target.value);
  }, []);

  const handleUserDescriptionChange = useCallback(event => {
    changeUserDescription(event.target.value);
  }, []);

  console.log('Device: ', device);

  const handleRegister = useCallback(
    async event => {
      event.preventDefault();

      const successfullRegistration = await registerThunk({
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
      });
      if (successfullRegistration) {
        callApi(
          setMarketingTrackingURL,
          {
            queryParams: {
              user_signed_up: true,
            },
          },
          false
        );
        history.push(RoutesMap.Home);
        getUserInfo();
      }
    },
    [registerThunk, email, password, name, userDescription]
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  if (isLoggedIn) {
    if (setShowVideo) setShowVideo(true);
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
          Sign up
        </Typography>

        {error && (
          <Alert severity="error">
            Sign up failed. Please try logging in if you already have an account
          </Alert>
        )}

        <form className={classes.form} noValidate onSubmit={handleRegister}>
          <TextField
            onChange={handleNameChange}
            value={name}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Name"
            name="name"
            autoComplete="name"
          />
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
          <FormControl variant="outlined" fullWidth required={true} className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              How would you best describe yourself?
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              variant="outlined"
              required
              fullWidth
              label="How would you best describe yourself?"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={userDescription}
              onChange={handleUserDescriptionChange}
            >
              <MenuItem value={userDescriptionMap[0]}>
                I want to know how much a short-term rental can earn
              </MenuItem>
              <MenuItem value={userDescriptionMap[1]}>
                I want to earn more by pricing better (Dynamic Pricing, CompSet)
              </MenuItem>
              <MenuItem value={userDescriptionMap[2]}>
                I want to understand guest demographics
              </MenuItem>
              <MenuItem value={userDescriptionMap[3]}>Just checking out :)</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption">
            {' '}
            By clicking Sign Up, you agree to our{' '}
            <Link href="https://airbtics.com/privacy-policy/terms-of-service/" target="_blank">
              Terms
            </Link>{' '}
            and that you have read our{' '}
            <Link href="https://airbtics.com/privacy-policy/privacy-policy/" target="_blank">
              Privacy Policy
            </Link>
            .{' '}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link onClick={redirectToLoginPage} variant="body2">
                Already have account? Sign In
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

export default Login;
