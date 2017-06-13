import React, { Component } from 'react';
import Modal from './Modal';
import cancelEvt from './cancelEvt';

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
        <a href="#" className="menu-button-link select-button-link" onClick={this._open}>
          Select
        </a>
        {this.state.isOpen
          ? <Modal className="full-screen-menu">
              <div className="content" onClick={this._close}>
                <div className="description">
                  Select
                </div>
                <div className="menu-options">
                  <div className="spacer"></div>
                  <a href="#" onClick={this._selectReverse}>Your Top · 100</a>
                  <a href="#" onClick={this._selectReverse}>Recommended · 100</a>
                  <a href="#" onClick={this._selectRandom}>Random · 100</a>
                  <div className="spacer"></div>
                  <a href="#" onClick={this._selectAll}>All · {this.props.trackCount}</a>
                  <a href="#" onClick={this._selectNone}>None</a>
                </div>
              </div>
            </Modal>
          : null}
      </div>
    );
  }

  _selectAll = evt => {
    cancelEvt(evt);

    this._close();
    this.props.onSelectAll();
  };

  _selectNone = evt => {
    cancelEvt(evt);

    this._close();
    this.props.onSelectNone();
  };

  _selectRandom = evt => {
    cancelEvt(evt);

    this._close();
    this.props.onSelectRandom();
  };

  _selectReverse = evt => {
    cancelEvt(evt);

    this._close();
    this.props.onSelectReverse();
  };

  _open = evt => {
    evt.stopPropagation();
    evt.preventDefault();
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
