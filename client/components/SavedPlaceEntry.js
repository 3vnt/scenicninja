import React from 'react';

var SavedPlaceEntry = (props) => (
  <div className='saved-place-entry animated fadeIn'>
    <img className='saved-place-image' src={props.savedPlace.url} height ="50" width="50"/>
    <p className='saved-place-name'>{ props.savedPlace.name }</p>
    <p className='saved-place-address'>{ props.savedPlace.address }</p>
    <div>
      <a className='saved-place-entry-link' href={'//www.images.google.com/search?q=' + props.savedPlace.name + ' ' + props.savedPlace.address + '&tbm=isch'}
      target='_blank'>More Vies</a>
      <span className='place-entry-link-divider'>&middot;</span>
      <a className='saved-place-entry-link' href={'//www.google.com/search?q=' + props.savedPlace.name + ' ' + props.savedPlace.address}
      target='_blank'>Find on Google</a>
    </div>
  </div>
);

export default SavedPlaceEntry;
