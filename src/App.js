import React, { Component } from 'react';
import Login from './Login';
import Main from './Main';
import parseQuery from './parseQuery';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      spotifyToken: null,
      noCache: window.location.search.indexOf('nocache=1') > -1
    };
  }

  componentWillMount() {
    this._checkLoginParams();
  }

  render() {
    const component = this._isLoggedIn() ? this._renderMain() : this._renderLogin();
    return <div className="App">{component}</div>;
  }

  _renderLogin() {
    return <Login />;
  }

  _renderMain() {
    return <Main accessToken={this.state.spotifyToken} noCache={this.state.noCache} />;
  }

  _checkLoginParams() {
    var query = parseQuery(window.location.hash.substring(1));
    if (query.access_token && query.expires_in && query.state) {
      const timestamp = parseInt(query.state, 10);
      if (!isNaN(timestamp) && Date.now() - timestamp < 60 * 5 * 1000) {
        // Should have taken less than 5 minutes to register
        const expiresIn = parseInt(query.expires_in, 10);
        if (!isNaN(expiresIn)) {
          document.cookie = 'access_token=' + query.access_token;
          document.cookie = 'token_expires=' + (Date.now() + expiresIn * 1000);
        }
      }
    }
    const spotifyToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    let spotifyTokenExpires = document.cookie.replace(
      /(?:(?:^|.*;\s*)token_expires\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    if (spotifyToken && spotifyTokenExpires) {
      spotifyTokenExpires = parseInt(spotifyTokenExpires, 10);
      if (!isNaN(spotifyTokenExpires) && Date.now() < spotifyTokenExpires) {
        this.setState({ spotifyToken });
      }
    }
    location.hash = '';
  }

  _isLoggedIn() {
    return !!this.state.spotifyToken;
  }
}

export default App;
