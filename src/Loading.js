import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <div className="loading-header">Loading your music</div>
        <div className="percent">{this.props.percentComplete}</div>
        <div className="loading-header">%</div>
      </div>
    );
  }
}

export default Loading;
