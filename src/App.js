import React from 'react';
import Home from './pages/Home';
import {Team} from './pages/Team';
import {useRoutes} from 'hookrouter';

const routes = {
  '/': () => <Team />,
  '/statjunkie': () => <Team />,
  '/team': () => <Team />,
  '/team/:id': ({id}) => <Team currentTeam={id}/>,
};

const App = () => {
  return useRoutes(routes);
}

export default App;
