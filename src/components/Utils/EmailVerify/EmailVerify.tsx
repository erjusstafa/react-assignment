import React from 'react';

import { Box, Grid, Typography } from '@material-ui/core';
import { callApi } from 'src/core/callApi';
import { Link as RedirectLink, useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { RoutesMap } from 'src/const';

const EmailVerify = ({}) => {
  let { hashCode } = useParams<{ hashCode: string }>();
  const [isVerified, setVerifiedState] = React.useState(false);
  const [loadingState, setLoadingState] = React.useState(true);

  const callVerifyLambda = async () => {
    let url = 'https://b3vwezka6h.execute-api.us-east-2.amazonaws.com/default/emailVerify';
    let config = {
      queryParams: {
        hashCode: hashCode,
      },
    };
    let resp = await callApi(url, config, false);
    if (resp['message'] == 'hello world') {
      setVerifiedState(true);
      setLoadingState(false);
    } else {
      setVerifiedState(false);
      setLoadingState(false);
    }
  };

  callVerifyLambda();

  return (
    <Grid container component="main">
      <Box mt={5} ml={5}>
        {loadingState && <Typography> Verifying your account!</Typography>}

        {!loadingState && isVerified ? (
          <Redirect to={RoutesMap.Home} />
        ) : (
          <Typography>
            {' '}
            Failed to verify. If the issue consists, contact help@airbtics.com
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default EmailVerify;
