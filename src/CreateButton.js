import React, { Component } from 'react';

class CreateButton extends Component {
  constructor() {
    super();
    this.state = {
      isEditing: false
    };
  }

  render() {
    return (
      <span
        className={
          'create-playlist button' +
            (this.props.selectionCount > 0 ? ' visible' : ' invisible') +
            (this.state.isEditing ? ' editing' : '')
        }
        onClick={this.state.isEditing ? null : this._setEditing}
        onKeyUp={this._handleKeyUp}
      >
        {this.state.isEditing
          ? [
              <input
                type="text"
                className="create-playlist-input"
                defaultValue={'Playlist name...'}
                placeholder="Enter playlist name..."
                ref="input"
                key="input"
              />,
              <a href="#" key="btn" onClick={this._createPlaylist} className="create-playlist-go">
                Go
              </a>
            ]
          : <a
              href="#"
              onClick={evt => {
                evt.preventDefault();
              }}
            >
              Export to Spotify
              <span className="create-playlist-count"> ({this.props.selectionCount})</span>
            </a>}
      </span>
    );
  }

  _setEditing = () => {
    this.setState(
      {
        isEditing: true
      },
      () => {
        // Focus the input
        const input = this.refs.input;
        input.focus();
        input.setSelectionRange(0, input.value.length);
      }
    );
  };

  _createPlaylist = evt => {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
    this.props.onCreate(this.refs.input.value);
  };

  _handleKeyUp = evt => {
    if (evt.keyCode === 27) {
      // Escape
      this.setState({ isEditing: false });
    } else if (evt.keyCode === 13 && this.state.isEditing) {
      this._createPlaylist();
      this.setState({ isEditing: false });
    }
  };
}

export default CreateButton;
