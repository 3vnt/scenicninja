import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SavedPlaceEntry from './SavedPlaceEntry.js';

class SavedPlaceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class: 'saved-places'
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    let scrollTop = window.document.body.scrollTop;
    // console.log('current position', scrollTop);
    if (scrollTop > 280) {
      // console.log('switch to fixed');
      this.setState({class: 'saved-places-fixed'});
    } else {
      // console.log('switch back');
      this.setState({class: 'saved-places'});
    }
  }

  render() {
    if (this.props.savedPlaces.length === 0) {

      // there are no saved places, so show an empty state
      return (
        <div className={'col-4-12 '+ this.state.class}>
          <h3>Your Saved Places</h3>
          <div className='no-saved-places'>
            <p>
              If you like a place, click the &hearts; to save it for later.
            </p>
          </div>
        </div>
      );
    } else {

      // there are saved places, so display them
      return (
        <div className={'col-4-12 ' + this.state.class}>
          <h3>Your Saved Places</h3>
          { this.props.savedPlaces.map((savedPlace, i) => (
            <div>
              <SavedPlaceEntry savedPlace={savedPlace} key={i} actions={this.props.actions} dispatch={this.props.dispatch}/>
            </div>
          ))}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    savedPlaces: state.savedPlaces
  };
};

SavedPlaceContainer.propTypes = {
  savedPlaces: PropTypes.array,
};

export default connect(
  mapStateToProps
)(SavedPlaceContainer);
