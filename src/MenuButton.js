import React, { Component } from 'react';
import Modal from './Modal';
import cancelEvt from './cancelEvt';

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
        <a href="#" className="menu-button-link" onClick={this._open}>?</a>
        {this.state.isOpen
          ? <Modal className="full-screen-menu" onClick={this._close}>
              <div className="content" onClick={this._close}>
                <div className="description-big">
                  Lazylist is the quickest way to create Spotify playlists from your favorite tracks.
                </div>
                <div className="description-small">
                  Made by <a href="http://twitter.com/chofter" target="_blank">Shane Sullivan</a> & <a href="http://twitter.com/karoliskosas" target="_blank">Karolis Kosas</a>.<br/>
                  Not affiliated with Spotify.
                </div>
              </div>
            </Modal>
          : null}
      </div>
    );
  }

  _open = evt => {
    cancelEvt(evt);
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
    cancelEvt(evt);
    this.props.onCreate(this.refs.input.value);
  };
}

export default MenuButton;
