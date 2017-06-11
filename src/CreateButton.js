import React, { Component } from 'react';

class CreateButton extends Component {
  render() {
    return (
      <span
        className={'create-playlist' + (this.props.selectionCount > 0 ? ' visible' : ' invisible')}
        onClick={this._setEditing}
      >
        <a
          href="#"
          onClick={evt => {
            evt.preventDefault();
          }}
        >
          Save to Spotify
        </a>
      </span>
    );
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
}

export default CreateButton;
