import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <div>Loading your music</div>
        <div className="loading-perc">{this.props.percentComplete}%</div>
      </div>
    );
  }
}

export default Loading;
