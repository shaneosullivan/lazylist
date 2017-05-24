/**
 * @flow
 */

import React, { Component } from 'react';

class PlayButton extends Component {
  render() {
    return (
      <span className={'play-button ' + (this.props.isLoaded ? '' : 'invisible')}>
        <iframe
          src={'https://open.spotify.com/embed?uri=spotify:track:' + this.props.trackID}
          frameBorder="0"
          allowTransparency="true"
          width="250"
          height="80"
          onLoad={this._handleLoad}
        />
      </span>
    );
  }

  _handleLoad = () => {
    this.props.onLoad(this.props.trackID);
  };
}

export default class PlayButtonControl extends Component {
  constructor() {
    super();
    this.state = {
      trackIDs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    // Add it to the list of tracks
    this.setState({
      trackIDs: nextProps.trackID ? this.state.trackIDs.concat([nextProps.trackID]) : []
    });
  }

  render() {
    if (this.props.trackID) {
      return (
        <div className="play-button-control-wrapper">
          {this.state.trackIDs.map(this._renderButton)}
        </div>
      );
    } else {
      return null;
    }
  }

  _renderButton = (trackID, idx) => {
    return (
      <div key={trackID} className="play-button-control-inner">
        <PlayButton trackID={trackID} isLoaded={idx === 0} onLoad={this._handleLoad} />
      </div>
    );
  };

  _handleLoad = trackID => {
    let trackIDs = this.state.trackIDs;
    if (trackIDs.length > 1 && trackIDs[trackIDs.length - 1] === trackID) {
      this.setState({ trackIDs: [trackID] });
    }
  };
}
