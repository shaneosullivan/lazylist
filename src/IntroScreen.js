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
              <div className="content">
                <div className="description-big">
                  We selected your top 100 tracks and matched them to global favorites
                </div>
                <div className="description">
                  Click on the tracks or artists to add to a playlist and save it to Spotify.
                </div>
                <div className="button" onClick={this._close}>
                  Let's Go!
                </div>
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
