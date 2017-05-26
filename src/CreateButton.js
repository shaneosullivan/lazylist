import React, { Component } from 'react';

class CreateButton extends Component {
  render() {
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
        {this.props.isEditing
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
