import React from 'react';
//import Home from './pages/Home';
import {Team} from './pages/Team';
import {useRoutes} from 'hookrouter';

const routes = {
  '/': () => <Team />,
  '/statjunkie': () => <Team />,
  '/team': () => <Team />,
  '/team/:id': ({id}) => <Team currentTeam={id}/>,
};

const App = () => {
  return useRoutes(routes) || <h1>Stuff be broken yo!</h1>;
}

export default App;
