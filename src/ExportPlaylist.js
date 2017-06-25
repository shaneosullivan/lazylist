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
          <div className="content">
            <div className="description">Give it a name</div>
            <input
              ref={this._focusInput}
              placeholder="E.g. My Top 100 Songs"
              type="text"
              value={this.state.playlistName}
              onChange={this._handleNameChange}
            />
            <div className="button">
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
        content = (
          <div className="content">
            <div className="description">Exporting a Playlist</div>
            <div className="description-big">"{this.state.playlistName}"</div>
          </div>
        );
        break;
      case states.PLAYLIST_CREATED:
        content = (
          <div className="content">
            <div className="description">Your playlist</div>
            <div className="description-big">"{this.state.playlistName}"</div>
            <div className="description">exported to Spotify!</div>
          </div>
          );
        break;
      default:
        content = null;
    }

    return (
      <Modal className="export-playlist">
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
