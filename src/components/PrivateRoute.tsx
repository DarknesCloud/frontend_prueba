import React from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends Omit<RouteProps, 'element'> {
  element: React.ReactElement;
  authenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  authenticated,
  ...rest
}) => {
  return (
    <Route {...rest} element={authenticated ? element : <Navigate to="/" />} />
  );
};

export default PrivateRoute;
