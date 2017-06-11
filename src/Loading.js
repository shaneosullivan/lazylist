import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <div className="background"></div>
        <div className="content">
          <div className="description">Loading your music</div>
          <div className="percent">{this.props.percentComplete}%</div>
        </div>
      </div>
    );
  }
}

export default Loading;
