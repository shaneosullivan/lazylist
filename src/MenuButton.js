import React, { Component } from 'react';
import Modal from './Modal';

class MenuButton extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  render() {
    return (
      <div className="menu-button">
        <a href="#" className="menu-button-link" onClick={this._open} >?</a>
        {this.state.isOpen
          ? <Modal className="full-screen-menu" onClose={this._close}>
              <div className="content">
                <div className="description-big">
                  Spotlist makes it easy to discover and save music on Spotify by matching your top tracks to global favorites.
                </div>
                <div className="description">
                  Click on the tracks or artists to add to a playlist and save it to Spotify.
                </div>
                <div className="description-small">
                  Made by <a href="http://twitter.com/shane" target="_blank">Shane O'Sullivan</a> & <a href="http://twitter.com/karoliskosas" target="_blank">Karolis Kosas</a>
                  <br />
                  Not affiliated with Spotify.
                </div>
              </div>
            </Modal>
          : null}
      </div>
    );
  }

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

export default MenuButton;
