import React, { Component } from 'react';

class MenuButton extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this._keyListener, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this._keyListener, false);
  }

  render() {
    return (
      <div className="menu-button">
        {this.state.isOpen
          ? <div className="full-screen-menu" onClick={this._close}>
              <div className="description">
                We found your favorite artists and selected your top tracks. Export it to Spotify or click on tracks and artists to add to your playlist.
              </div>
            </div>
          : null}
        <a href="#" className="button menu-button-link" onClick={this._open} />
      </div>
    );
  }

  _keyListener = evt => {
    if (evt.keyCode === 27) {
      // Esc
      this._close();
    }
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

  _createPlaylist = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.onCreate(this.refs.input.value);
  };
}

export default MenuButton;
