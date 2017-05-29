import React, { Component } from 'react';
import Modal from './Modal';
import states from './states';

export default class ExportPlaylist extends Component {
  constructor() {
    super();
    this.state = {
      playlistName: ''
    };
  }

  render() {
    let content;
    switch (this.props.state) {
      case states.EDITING_PLAYLIST_NAME:
        content = (
          <div>
            <div>Enter a name</div>
            <div>
              <input
                ref={this._focusInput}
                placeholder="E.g. My Top 100 Songs"
                type="text"
                value={this.state.playlistName}
                onChange={this._handleNameChange}
              />
            </div>
            <div>
              <a
                href="#"
                className={'button' + (!this._isValidName() ? ' button-disabled' : '')}
                onClick={this._handleExport}
              >
                Export to Spotify
              </a>
            </div>
          </div>
        );
        break;
      case states.CREATING_PLAYLIST:
        content = <div>Creating Playlist "{this.state.playlistName}" ...</div>;
        break;
      case states.PLAYLIST_CREATED:
        content = <div>Playlist "{this.state.playlistName}" created!!</div>;
        break;
      default:
        content = null;
    }

    return (
      <Modal className="export-playlist" onClose={this.props.onClose}>
        {content}
      </Modal>
    );
  }

  _isValidName() {
    return this.state.playlistName.trim().length > 0;
  }

  _handleNameChange = evt => {
    this.setState({ playlistName: evt.target.value });
  };

  _handleExport = () => {
    if (this._isValidName()) {
      this.props.onExport(this.state.playlistName.trim());
    }
  };

  _focusInput(ref) {
    ref && ref.focus();
  }
}
