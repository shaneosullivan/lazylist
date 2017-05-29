import React, { Component } from 'react';
import Modal from './Modal';

class IntroButton extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: true
    };
  }

  render() {
    return (
      <div className="menu-button">
        {this.state.isOpen
          ? <Modal className="full-screen-menu" onClose={this._close}>
              <div className="description">
                We found your favorite music and similar tracks you might like. Click on the circles to make a Spotify playlist.
              </div>
              <div className="button intro-button" onClick={this._close}>
                GOTCHA
              </div>
            </Modal>
          : null}
      </div>
    );
  }

  _close = () => {
    this.setState({
      isOpen: false
    });
  };
}

export default IntroButton;
