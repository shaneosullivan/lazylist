import React, { Component } from 'react';
import PlayButtonControl from './PlayButtonControl';

class GridColumn extends Component {
  constructor() {
    super();
    this.state = {
      selectionCount: -1
    };
  }
  shouldComponentUpdate(nextProps) {
    // Since drawing hundreds of images is performance critical, do a bit of extra work here to
    // check whether the column of tracks actually needs to redraw
    const shouldUpdate = this.props !== nextProps &&
      (this.props.forceRerender ||
        this.props.imagesVisible !== nextProps.imagesVisible ||
        this.props.artist !== nextProps.artist ||
        (this.props.mostRecentSelection &&
          nextProps.artist.topTracks.some(track => track.id === this.props.mostRecentSelection)) ||
        this.state.selectionCount !==
          this._countSelection(nextProps.artist.topTracks, nextProps.selection));

    return shouldUpdate;
  }

  componentDidUpdate() {
    this.setState({
      selectionCount: this._countSelection(this.props.artist.topTracks, this.props.selection)
    });
  }

  render() {
    let artist = this.props.artist;
    return (
      <div className="grid-col">
        <div className="grid-tracks">
          {artist.topTracks.map(this._renderTrack)}
        </div>
      </div>
    );
  }

  _renderTrack = (track, idx) => {
    var imageUrl;
    if (this.props.imagesVisible && track.album && track.album.images) {
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
      <div key={idx} className="grid-cell-wrapper">
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
        <PlayButtonControl
          trackID={track.id === this.props.mostRecentSelection ? track.id : null}
        />
        <div className={'grid-cell-label' + labelStyle}>
          <span className="label">{track.name}</span>
          <span className="number">TOP 1</span>
        </div>
        <div className={'grid-cell-tick' + tickStyle} />
      </div>
    );
  };

  _countSelection(tracks, selection) {
    let count = 0;
    tracks.forEach(track => {
      if (selection[track.id]) {
        count++;
      }
    });
    return count;
  }

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
