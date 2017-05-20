import React, { Component } from 'react';

class IntroButton extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: true
    };
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this._keyListener, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this._keyListener, false);
  }

  render() {
    return (
      <div className="menu-button">
        {this.state.isOpen
          ? <div className="full-screen-menu" onClick={this._close}>
              <div className="description">
                We found your favorite artists and selected your top tracks.
                Click on the circles and start making playlists!
              </div>
              <div className="button intro-button" onClick={this._close}>
                OK
              </div>              
            </div>
          : null}
      </div>
    );
  }

  _keyListener = evt => {
    if (evt.keyCode === 27) {
      // Esc
      this._close();
    }
  };

  _open = () => {
    this.setState({
      isOpen: true
    });
  };

  _close = () => {
    this.setState({
      isOpen: false
    });
  };

  _createPlaylist = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.onCreate(this.refs.input.value);
  };
}

export default IntroButton;
