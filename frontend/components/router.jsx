import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { requestRestaurants } from '../actions/restaurant_actions';

import App from './app';
import SessionFormContainer from './session_form/session_form_container';
import RestaurantIndexContainer from './restaurants_index/restaurant_index_container';
import RestaurantContainer from './restaurant/restaurant_container';
import UserContainer from './user/user_container';

class AppRouter extends React.Component {
  constructor(props){
    super(props);
    this._ensureLoggedIn = this._ensureLoggedIn.bind(this);
    this._redirectIfLoggedIn = this._redirectIfLoggedIn.bind(this);
    this.reloadRestaurants = this.reloadRestaurants.bind(this);
  }

  _ensureLoggedIn(nextState, replace){
    const currentUser = this.props.currentUser;
    if (!currentUser){
      replace('login');
    }
  }

  reloadRestaurants(){
    this.props.requestRestaurants();
  }

  _redirectIfLoggedIn(nextState, replace){
    const currentUser = this.props.currentUser;
    if(currentUser){
      replace('/');
    }
  }

  render(){
    return(
      <Router history={ hashHistory }>
        <Route path='/' component={ App }>
          <IndexRoute component={ RestaurantIndexContainer } onEnter={this.reloadRestaurants} />
          <Route path='/restaurants/:id' component={ RestaurantContainer } />
          <Route path='/users/:id' component={ UserContainer } />
          <Route path='/login' component={ SessionFormContainer } />
          <Route path='/signup' component={ SessionFormContainer } />
        </Route>
      </Router>
    );
  }
}

export default AppRouter;
