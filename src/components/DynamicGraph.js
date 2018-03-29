import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import randomColor from 'randomcolor';

class DynamicGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false
    };
    
    this.lines = [];

    this.defineLinesFromProps(props);
  }

  componentWillReceiveProps(newProps) {
    this.defineLinesFromProps(newProps);
    this.setState({ updated: true });
  }

  defineLinesFromProps(props) {
    this.datasets = [];

    for (let i = 0; i < props.data.length; i++) {
      this.datasets.push(Object.assign({}, { index: props.data[i].index }, props.data[i].stocks));
    }

    for (let i = 0; i < props.data.length; i++) {
      for (let stock in props.data[i].stocks) {
        if (!this.lines[stock]) {
          this.lines[stock] = { color: randomColor({ luminosity: 'dark' }) }
        }
      }
    }
  }

  renderLines () {
    const lineElements = [];
    for(let stock in this.lines) {
      lineElements.push(
        <Line isAnimationActive={false} key={stock} type="monotone" dataKey={stock} stroke={this.lines[stock].color} />
      );
    }

    return lineElements;
  }

  render() {
    return (
      <div style={graphContainerStyle}>
        <LineChart
          width={1000}
          height={300}
          data={this.datasets}
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
          <XAxis dataKey="index" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {this.renderLines()}
        </LineChart>
      </div>
    );
  }
}

const graphContainerStyle = {
  margin: '0 auto',
  width: '1000px'
};

export default DynamicGraph;