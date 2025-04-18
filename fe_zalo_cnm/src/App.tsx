import React from 'react';
import './App.scss';
import { useEffect } from 'react';

import { Switch, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassPage from './pages/ForgotPassPage';
import NewPassPage from './pages/NewPassPage';
import HomePage from './pages/HomePage';
import { useSelector } from 'react-redux';
import { RootState } from './redux/reducers';
import Container from './components/Container/Container';

function App() {

  return (
    <Switch>
      <Route path='/' exact>
        <Container></Container>
      </Route>

      <Route path='/login'>
        <LoginPage></LoginPage>
      </Route>

      <Route path='/register'>
        <RegisterPage></RegisterPage>
      </Route>

      <Route path='/forgotpass'>
        <ForgotPassPage></ForgotPassPage>
      </Route>

      <Route path='/newpass'>
        <NewPassPage></NewPassPage>
      </Route>

    </Switch>
  );
}

export default App;
