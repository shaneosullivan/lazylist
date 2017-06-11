import React, { Component } from 'react';
import cancelEvt from './cancelEvt';

export default class GridColumnHeader extends Component {
  render() {
    let artist = this.props.artist;
    return (
      <div className="grid-col">
        <a href="#" onClick={this._toggleArtist} className="grid-artist-name">
          <span>{artist.name}</span>
        </a>
      </div>
    );
  }

  _toggleArtist = evt => {
    cancelEvt(evt);
    this.props.onArtistToggle(this.props.artist);
  };
}
