import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import actions from '../actions/index.js';

import Header from './Header';
import Map from './Map';
import PlaceContainer from './PlaceContainer';
import SavedPlaceContainer from './SavedPlaceContainer';
import searchGooglePlaces from '../utils/searchGooglePlaces.js';
import $ from 'jquery';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className='grid'>
          <PlaceContainer/>
          <Map />
          <SavedPlaceContainer actions={actions} dispatch={this.props.dispatch}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
