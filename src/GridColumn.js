import React, { Component } from 'react';

class GridColumn extends Component {
  render() {
    let artist = this.props.artist;
    return (
      <div className="grid-col">
        <a href="#" onClick={this._toggleArtist} className="grid-artist-name">
          {artist.name}
        </a>
        <div className="grid-tracks">
          {artist.topTracks.map(this._renderTrack)}
        </div>
      </div>
    );
  }

  _renderTrack = (track, idx) => {
    var imageUrl;
    if (track.album && track.album.images) {
      if (track.album.images.length > 1) {
        imageUrl = track.album.images[1].url;
      } else {
        imageUrl = track.album.images[0].url;
      }
    }
    const tickStyle = this._isTrackSelected(track) ? ' visible' : ' invisible';
    const cellStyle = this._isTrackSelected(track) ? ' selected' : ' unselected';
    const labelStyle = this._isTrackSelected(track) ? ' selectedLabel' : ' unselectedLabel';

    return (
      <div key={idx}>
        <a
          href="#"
          key={track.id}
          className={'grid-cell' + cellStyle}
          style={{ backgroundImage: imageUrl ? 'url(' + imageUrl + ')' : 'none' }}
          onClick={evt => {
            evt.preventDefault();
            evt.stopPropagation();
            this._toggleTrack(track);
          }}
        />
        <div className={'grid-cell-tick' + tickStyle} />
        <div className={'grid-cell-label' + labelStyle}>{track.name}</div>
      </div>
    );
  };

  _isTrackSelected(track) {
    return !!this.props.selection[track.id];
  }

  _toggleTrack(track) {
    this.props.onTrackToggle(track);
  }

  _toggleArtist = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.onArtistToggle(this.props.artist);
  };
}

export default GridColumn;
