/*global demoConfig*/
import React from "react";
import { Chart, registerables } from "chart.js";
import { Container, Row, Col} from "react-bootstrap";

Chart.register(...registerables);
const style = {
  container: {
    "box-shadow":
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    "text-align": "center",
    height: "100%"
  },
  header: {
    fontWeight: "bold",
    color: "#00364d",
  },
};
class HistoryChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartContainer = React.createRef();
  }
  componentDidMount() {
    var options = {
      type: "line",
      data : this._chartData(),
      options: {
        scales: {
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    }
    };
    this.chart = new Chart(this.chartContainer.current, options);
  }

  componentDidUpdate() {
    this.chart.data = this._chartData();
    this.chart.update('none');
  }
  _chartData(){
    return {
      labels: this._chartLabels(),
      datasets: this._chartDatasets()
    };
  }
  _chartLabels(){
    const count = Object.values(this.props.data).map( version => version.history.length).reduce((x,y)=> Math.max(x,y));
    var len = Math.min(demoConfig.graph.max, count) ;
    return Array.from({length: len}, (_, i) => i + 1);
  }
  _chartDatasets(){
    return Object.keys(this.props.data).map( (key) => {
      const value = this.props.data[key];
      const history = value.history.slice().splice(-demoConfig.graph.max)
      return {
          label: key,
          fill: true,
          backgroundColor: this._colorMap(key),
          data: history
      }
    });
  }
  _colorMap(key) {
    return key;
  }
  render() {
    return (
      <Container style={style.container} fluid>
        <Row style={style.header}>
          <Col>History</Col>
        </Row>
        <Row style={style.content}>
          <Col>
            <canvas ref={this.chartContainer} />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default HistoryChart;
