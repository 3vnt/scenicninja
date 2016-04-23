import React, {Component} from 'react';
import { connect } from 'react-redux';

class PlaceEntry extends Component {
  constructor(props) {
    super(props);
    this.handleClick.bind(this);
    this.state = {class: 'heart-path'};
  }

  handleClick(e) {
    e.preventDefault;
    this.props.onSaveClick(this.props.place, this.props.user);
    this.setState({class: 'permahover'});
  }

  render() {
    return (
      <div className='place-entry animated fadeInUp'>
        <img className='place-entry-image' src={this.props.place.url} alt="Smiley face" />
        <div className='place-info' >
            <h4>{ this.props.place.name }</h4>
            <p>{ this.props.place.address }</p>
            <div>
              <a className='place-entry-link' href={'//www.images.google.com/search?q=' + this.props.place.name + ' ' + this.props.place.address + '&tbm=isch'}
              target='_blank'>More Views</a>
              <span className='place-entry-link-divider'>&middot;</span>
              <a className='place-entry-link' href={'//www.google.com/search?q=' + this.props.place.name + ' ' + this.props.place.address}
              target='_blank'>Find on Google</a>
            </div>
        </div>
        <div className='place-entry-favorite'>
        <svg viewBox="0 0 32 32" onClick={this.handleClick.bind(this)} id="heart">
          <path id={this.state.class} d="M16,28.261c0,0-14-7.926-14-17.046c0-9.356,13.159-10.399,14-0.454c1.011-9.938,14-8.903,14,0.454
           C30,20.335,16,28.261,16,28.261z"/>
        </svg>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user};
};

export default connect(mapStateToProps)(PlaceEntry);
