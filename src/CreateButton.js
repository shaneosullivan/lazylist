import React, { Component } from 'react';
import cancelEvt from './cancelEvt';

class CreateButton extends Component {
  render() {
    return (
      <span
        className={'create-playlist' + (this.props.selectionCount > 0 ? ' visible' : ' invisible')}
        onClick={this._setEditing}
      >
        <a href="#" onClick={evt => {evt.preventDefault();  }}>
          <div className="button">
            Save
          </div>
        </a>
      </span>
    );
  }

  _setEditing = () => {
    this.props.onEdit();
  };

  _createPlaylist = evt => {
    if (evt) {
      cancelEvt(evt);
    }
    this.props.onCreate(this.refs.input.value);
  };
}

export default CreateButton;
