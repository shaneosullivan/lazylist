/**
 * @flow
 */

import React, { Component } from 'react';

class PlayButton extends Component {
  render() {
    return (
      <span className={'play-button'}>
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
      isLoaded: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // Add it to the list of tracks
    if (this.state.isLoaded && !nextProps.trackID) {
      this.setState({
        isLoaded: false
      });
    }
  }

  render() {
    if (this.props.trackID) {
      return (
        <div className={'play-button-control-wrapper' + (this.state.isLoaded ? ' loaded' : '')}>
          {this._renderButton(this.props.trackID)}
        </div>
      );
    } else {
      return null;
    }
  }

  _renderButton = trackID => {
    return (
      <div key={trackID} className="play-button-control-inner">
        <PlayButton trackID={trackID} isLoaded={this.state.isLoaded} onLoad={this._handleLoad} />
      </div>
    );
  };

  _handleLoad = trackID => {
    this.setState({ isLoaded: true });
  };
}
