import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { RoutesMap } from 'src/const';
import { MarketDashboard } from '../Dashboards/Market';
import { Login } from '../Modals/Login';
import { Register } from '../Modals/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { EmailVerify } from '../Utils';
import { ErrorPage } from '../ErrorPage';

const Routes = () => (
  <Switch>
    {/* page routes */}
    <ProtectedRoute exact path={RoutesMap.Home} component={MarketDashboard} />
    <Route path={RoutesMap.Login} component={Login} />
    <Route path={RoutesMap.Register} component={Register} />
    <Route path={RoutesMap.Data + '/:country/:city/:district'} component={MarketDashboard} />
    <Route path={'/:country/:city/:district/:source'} component={MarketDashboard} />
    <Route path={RoutesMap.SampleDashboard + '/:isSample'} component={MarketDashboard} />
    <Route path={RoutesMap.CompSet + '/:id'} component={MarketDashboard} />
    <Route path={RoutesMap.User + '/:settings'} component={MarketDashboard} />
    <Route path={RoutesMap.Calculator} component={MarketDashboard} />

    {/* modal routes */}
    <Route path={RoutesMap.TailoredRegion + '/:isTailored'} component={MarketDashboard} />

    {/* utility routes */}
    <Route path={RoutesMap.VerifyEmail + '/:hashCode'} component={EmailVerify} />

    {/* fallback routes */}
    <Route path={RoutesMap.Error} component={ErrorPage} />
    <Redirect to={RoutesMap.Home} />
  </Switch>
);

export default Routes;
