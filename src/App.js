import React from 'react';
import Home from './pages/Home';
import Team from './pages/Team';
import {useRoutes} from 'hookrouter';
import './App.css';

const routes = {
  '/': () => <Home />,
  '/team': () => <Team />,
};

const App = () => {
  return useRoutes(routes);
}

export default App;