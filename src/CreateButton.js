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
      >
        {this.state.isEditing
          ? [
              <input
                type="text"
                className="create-playlist-input"
                defaultValue={'Playlist name...'}
                placeholder="Enter playlist name..."
                ref="input"
              />,
              <a href="#" onClick={this._createPlaylist} className="create-playlist-go">Go</a>
            ]
          : <a
              href="#"
              onClick={evt => {
                evt.preventDefault();
              }}
            >
              Create Playlist
              <span className="create-playlist-count"> ({this.props.selectionCount})</span>
            </a>}
      </span>
    );
  }

  _setEditing = () => {
    this.setState({
      isEditing: true
    });
  };

  _createPlaylist = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.onCreate(this.refs.input.value);
  };
}

export default CreateButton;
