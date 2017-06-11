import React, { Component } from 'react';
import Modal from './Modal';

export default class SelectButton extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  render() {
    return (
      <div className="menu-button">
        <a href="#" className="button menu-button-link select-button-link" onClick={this._open}>
          Select
        </a>
        {this.state.isOpen
          ? <Modal className="full-screen-menu" onClose={this._close}>
              <div className="description menu-header">
                Select Songs
              </div>
              <div className="description">
                <a href="#" onClick={this._selectAll}>All {this.props.trackCount} Songs</a>
              </div>
              <div className="description">
                <a href="#" onClick={this._selectNone}>No Songs</a>
              </div>
              <div className="description">
                <a href="#" onClick={this._selectReverse}>Reverse Selection</a>
              </div>
              <div className="description">
                <a href="#" onClick={this._selectRandom}>Random</a>
              </div>
              <div className="description menu-cancel">
                <a href="#" onClick={this._close}>Cancel</a>
              </div>
            </Modal>
          : null}
      </div>
    );
  }

  _selectAll = () => {
    this._close();
    this.props.onSelectAll();
  };

  _selectNone = () => {
    this._close();
    this.props.onSelectNone();
  };

  _selectRandom = () => {
    this._close();
    this.props.onSelectRandom();
  };

  _selectReverse = () => {
    this._close();
    this.props.onSelectReverse();
  };

  _open = () => {
    this.setState({
      isOpen: true
    });
  };

  _close = () => {
    this.setState({
      isOpen: false
    });
  };
}
