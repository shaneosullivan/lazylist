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

        <a href="#" className="button menu-button-link" onClick={this._open} />
        {this.state.isOpen
          ? <Modal className="full-screen-menu" onClose={this._close}>
              <div className="description">
                We found your favorite artists and selected your top tracks.
              </div>
              <div className="description">
                Export it to Spotify or click on tracks and artists to add to your playlist.
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
