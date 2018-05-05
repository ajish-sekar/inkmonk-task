import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Inventory from './inventory';
import Login from './login';
import Register from './register';
import NotFound from './notfound';

ReactDOM.render((
	<BrowserRouter>
		<Switch>
      		<Route exact path = "/dashboard" component={Inventory}/>
      		<Route exact path = "/" component={Login}/>
      		<Route exact path = "/registration" component={Register}/>
      		<Route path="*" component={NotFound}/>
      	</Switch>
	</BrowserRouter>
	), document.getElementById("content"));