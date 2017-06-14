import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <div className="login">
        <div className="background">
          <div className="image i1"></div>
          <div className="image i2"></div>
          <div className="image i3"></div>
          <div className="image i4"></div>
          <div className="image i5"></div>
          <div className="image i6"></div>
        </div>
        <div className="content">
          <div className="login-header">
            Spotlist
          </div>
          <div className="description">
            Makes it easy to create Spotify playlists by matching your top songs to trending tracks of your favorite artists
          </div>
          <a href={this._generateSpotifyLink()}>
            <div className="button">
              Login to Spotify
            </div>
          </a>
        </div>
      </div>
    );
  }

  _generateSpotifyLink() {
    const baseUrl = 'https://accounts.spotify.com/authorize?';
    const baseRedirectUrl = window.location.origin + window.location.pathname;
    const redirectUri = baseRedirectUrl +
      (baseRedirectUrl.substring(baseRedirectUrl.length - 1) === '/' ||
        baseRedirectUrl.indexOf('html') > -1
        ? ''
        : '/') +
      (window.location.pathname.indexOf('.html') < 0 ? 'index.html' : '');
    // const redirectUri = 'http://chofter.com/spotlist/auth.php';
    const params = {
      client_id: '71ad6f6d14ef4f82b967b193dc8a3019',
      response_type: 'token',
      redirect_uri: redirectUri,
      state: Date.now(),
      show_dialog: false,
      scope: [
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-top-read'
      ].join(' ')
    };
    var urlParams = [];
    for (let key in params) {
      const value = params[key];
      urlParams.push(key + '=' + encodeURIComponent(value));
    }

    const url = baseUrl + urlParams.join('&');
    return url;
  }
}

export default Login;
