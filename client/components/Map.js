import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import actions from '../actions/index.js';

import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';

class Map extends Component {

  handleMapClick (e) {
    e.preventDefault();
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={
          <div
            {...this.props}
            style={{
              height: '400px',
            }}
            className='col-4-12 saved-places'

          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={10}
            defaultCenter={ { lat: 37.80898699999999, lng: -122.41026} }
            onClick={this.handleMapClick}
            style={{
              height: '400px',
              width: '400px',
              position: 'absolute',
              top: '0',
              left: '0'
            }}
          >
            {this.props.markers.map((marker, index) => {
              return (
                <Marker
                    position= {{
                      lat: marker.latitude,
                      lng: marker.longitude
                    }}
                    key={marker.name}
                    defaultAnimation={2}
                />
              );
            })}
          </GoogleMap>
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    markers: state.places
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //method: () => {},
    //mapRightClick: () => {},
    //mapLeftClick: () => {}
  };
};

Map.propTypes = {
  markers: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
