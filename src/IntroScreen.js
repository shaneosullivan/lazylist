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
          ? <Modal className="full-screen-menu">
              <div className="content">
                <div className="content-inner">
                  <div className="description-big">
                    Here's your top artists and tracks.
                  </div>
                  <div className="description">
                    Click on a track or an artist to add to your playlist
                  </div>
                  <div className="button" onClick={this._close}>
                    Let's Go!
                  </div>
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
