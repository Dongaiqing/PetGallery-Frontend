import React, { Component } from 'react';
import { Route, Switch,HashRouter} from 'react-router-dom'
import './App.scss';

import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import NavBar from './components/NavBar/NavBar';
import MainView from './components/MainView/MainView';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import PetDetail from './components/PetDetail/PetDetail';


class App extends Component {
  render() {
    return(
        <HashRouter basename={"/"}>
          <Switch>
              <Route exact path="/" component={MainView}/>
              <Route exact path="/profile" component={Profile}/>
              <Route exact path="/pet/:id" component={PetDetail}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
          </Switch>
        </HashRouter>
    )
  }
}

const fonts = [ faPencilAlt ];
library.add(fonts);

export default App;
