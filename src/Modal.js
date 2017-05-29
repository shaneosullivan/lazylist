import React, { Component } from 'react';

export default class Modal extends Component {
  render() {
    return (
      <div
        className={'modal ' + (this.props.className || '')}
        ref="wrapper"
        onClick={this._handleClick}
        onKeyUp={this._handleKeyUp}
      >
        {this.props.children}
      </div>
    );
  }

  _handleClick = evt => {
    if (evt.target === this.refs.wrapper) {
      this.props.onClose && this.props.onClose();
    }
  };

  _handleKeyUp = evt => {
    // Esc
    if (evt.keyCode === 27) {
      this.props.onClose && this.props.onClose();
    }
  };
}
