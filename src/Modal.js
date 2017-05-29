import React, { Component } from 'react';

export default class Modal extends Component {
  componentDidMount() {
    document.body.addEventListener('keydown', this._keyListener, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this._keyListener, false);
  }

  render() {
    return (
      <div
        className={'modal ' + (this.props.className || '')}
        ref="wrapper"
        onClick={this._handleClick}
      >
        {this.props.children}
      </div>
    );
  }

  _close() {
    this.props.onClose && this.props.onClose();
  }

  _keyListener = evt => {
    if (evt.keyCode === 27) {
      // Esc
      this._close();
    }
  };

  _handleClick = evt => {
    if (evt.target === this.refs.wrapper) {
      this._close();
    }
  };
}
