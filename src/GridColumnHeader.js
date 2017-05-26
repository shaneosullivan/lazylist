import React, { Component } from 'react';

export default class GridColumnHeader extends Component {
  render() {
    let artist = this.props.artist;
    return (
      <div className="grid-col">
        <a href="#" onClick={this._toggleArtist} className="grid-artist-name">
          {artist.name}
        </a>

      </div>
    );
  }

  _toggleArtist = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.onArtistToggle(this.props.artist);
  };
}
