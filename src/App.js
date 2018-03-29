import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DynamicTable from './components/DynamicTable';
import DynamicGraph from './components/DynamicGraph';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedStocks: false,
      stockData: []
    };
  }

  setData = (index, stock, value) => {
    //console.log(index, name, value);
    console.log(this.state.stockData);
    const updatedData = Object.assign([], this.state.stockData);

    for (let i = 0; i < updatedData.length ; i++) {
      // that way we stop as soon as we found the matching value
      if (updatedData[i].index == index) {
        // basic checks that the value exists before updating it
        if (updatedData[i].stocks[stock]) {
          updatedData[i].stocks[stock] = value;
        }
        return;
      }
    }
  }

  componentDidMount() {
    fetch('http://localhost:8000/?count=20')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          loadedStocks: true,
          stockData: data
        });
      }).catch(() => {
        this.setState({
          loadedStocks: false
        });
      });

    setInterval(this.fetchNewData.bind(this), 1000);
  }

  fetchNewData() {
    fetch('http://localhost:8000/?count=1')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // no need to update anything if there is no value in the new data
        if (data.length < 1) return;

        const updatedData = Object.assign([], this.state.stockData);

        // check if the data is already in stocksData
        if (!updatedData.filter(elem => (elem.index === data[0].index)).length) {
          updatedData.push(data[0]);
        }

        // that way we don't have more than 20 items at the same time
        while (updatedData.length > 20) {
          updatedData.shift();
        }

        this.setState({
          loadedStocks: true,
          stockData: updatedData
        });
      }).catch(() => {
        // ... todo
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Exercise</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.state.loadedStocks ? <DynamicGraph
          data={this.state.stockData}
        /> : 'Loading graph...'}

        <br />
        {this.state.loadedStocks ? <DynamicTable
          data={this.state.stockData}
          setData={this.setData}
        /> : 'Loading table...'}
      </div>
    );
  }
}

export default App;
