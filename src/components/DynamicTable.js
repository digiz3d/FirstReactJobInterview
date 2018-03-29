import React, { Component } from 'react';

class DynamicTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
    };
    this.defineRowsFromProp(props);
  }

  componentWillReceiveProps(newProps) {
    this.defineRowsFromProp(newProps);
    this.setState({ updated: true });
  }

  defineRowsFromProp(props) {
    this.rows = [];

    for (let i = 0; i < props.data.length; i++) {
      for (let stock in props.data[i].stocks) {
        if (!(stock in this.rows)) {
          this.rows[stock] = [];
        }
        this.rows[stock].push(Object.assign({}, { index: props.data[i].index, value: props.data[i].stocks[stock] }));
      }
    }
  }

  handleChange = (e) => {
    // we replace the comma to a dot, because we know french people type `,` instead of `.`
    this.props.setData(e.target.dataset.index, e.target.dataset.stock, parseFloat(e.target.value.replace(/,/,".")));
  }

  renderRows() {
    const rowsElements = [];
    for (let stock in this.rows) {
      let cellsElements = [];
      cellsElements[stock] = [];
      cellsElements[stock].push(<th style={tableCellStyle} key={"th-" + stock}>{stock}</th>);
      for (let i in this.rows[stock]) {
        cellsElements[stock].push(
          <td
          style={tableCellStyle}
          key={"td-" + stock + "-" + this.rows[stock][i].index}>
            <input
            data-index={this.rows[stock][i].index}
            data-stock={stock}
            onChange={this.handleChange}
            style={inputStyle}
            defaultValue={this.rows[stock][i].value.toFixed(2)} />
          </td>
          );
        //console.log(this.rows[stock][i]);
      }
      rowsElements.push(<tr key={"tr-" + stock}>{cellsElements[stock]}</tr>);
    }
    return rowsElements;
  }

  render() {
    return (
      <table style={tableStyle}>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

const tableCellStyle = {
  margin: '40px',
  border: '1px solid #000000',
};
const tableStyle = {
  width: "100%",
  borderCollapse: 'collapse',
};
const inputStyle = {
  padding: "0",
  margin: "0",
  outline: "0",
  //border: "0",
  maxWidth: "100%",
  width: "100%",
  display: "inline-block",
  textAlign: "left",
}
export default DynamicTable;
