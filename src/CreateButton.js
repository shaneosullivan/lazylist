import React, { Component } from 'react';
import states from './states';
import tick from './images/tick.png';

class CreateButton extends Component {
  render() {
    return (
      <span
        className={
          'create-playlist button' + (this.props.selectionCount > 0 ? ' visible' : ' invisible')
        }
        onClick={this._setEditing}
      >
        <a
          href="#"
          onClick={evt => {
            evt.preventDefault();
          }}
        >
          Export to Spotify
          <span className="create-playlist-count"> ({this.props.selectionCount})</span>
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
