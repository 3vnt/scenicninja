import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class: 'saved-map'
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleFetchCoordinate() {
    // console.log('Map props: ', this.props);
    this.props.dispatch(this.props.actions.fetchCoordinate());

    this.clickedCoord = this.props.coordinate[0];
    // console.log('Clicked coordinate: ', this.clickedCoord);
  }

  handleScroll(event) {
    let scrollTop = window.document.body.scrollTop;
    // console.log('current position', scrollTop);
    if (scrollTop > 280) {
      // console.log('switch to fixed');
      this.setState({class: 'saved-map-fixed'});
    } else {
      // console.log('switch back');
      this.setState({class: 'saved-map'});
    }
  }

  render() {
    { this.handleFetchCoordinate(); }
    return (
      <div>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: '400px'
              }}
              className={'col-4-12 ' + this.state.class}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map)}
            defaultZoom={10}
            defaultCenter={ { lat: 37.80898699999999, lng: -122.41026} }
            onClick={this.handleMapClick}
          >
            {this.props.markers.map((marker, index) => {
              //{console.log('Marker: ', marker)}
              //{console.log('Index: ', index)}
              return (
                <Marker
                    position={this.clickedCoord}
                    key={marker.name}
                    defaultAnimation={2}
                    actions={this.props.actions}
                    dispatch={this.props.dispatch}
                />
              );
            })}
          </GoogleMap>
        }
      />
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    coordinate: state.coordinate,
    markers: state.places
  };
};

MapContainer.propTypes = {
  coordinate: PropTypes.array,
  markers: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps
)(MapContainer);
