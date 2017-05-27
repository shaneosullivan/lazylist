import React, { Component } from 'react';
import states from './states';

class CreateButton extends Component {
  render() {
    let content;
    switch (this.props.state) {
      case states.CREATING_PLAYLIST:
        content = <span>Creating playlist ...</span>;
        break;
      case states.PLAYLIST_CREATED:
        content = <span>Playlist Created!</span>;
        break;
      default:
        if (this.props.isEditing) {
          content = [
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
          ];
        } else {
          content = (
            <a
              href="#"
              onClick={evt => {
                evt.preventDefault();
              }}
            >
              Export to Spotify
              <span className="create-playlist-count"> ({this.props.selectionCount})</span>
            </a>
          );
        }
    }

    return (
      <span
        className={
          'create-playlist button' +
            (this.props.selectionCount > 0 ? ' visible' : ' invisible') +
            (this.props.isEditing ? ' editing' : '')
        }
        onClick={this.props.isEditing ? null : this._setEditing}
        onKeyUp={this._handleKeyUp}
      >
        {content}
      </span>
    );
  }

  componentDidUpdate(prevProps: Object): void {
    if (!prevProps.isEditing && this.props.isEditing) {
      // Focus the input
      const input = this.refs.input;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  }

  _setEditing = () => {
    this.props.onEdit();
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
