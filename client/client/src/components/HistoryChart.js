import React from "react";
import { Chart, registerables } from "chart.js";
import { Container, Row, Col } from "react-bootstrap";

Chart.register(...registerables);
const style = {
  container: {
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    textAlign: "center",
    height: "100%",
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
      data: this._chartData(),
      options: {
        elements: {
          point:{
            radius: 0
          }
        },
        scales: {
          y: {
            stacked: true,
            beginAtZero: true            
          }
        },
      },
    };
    this.chart = new Chart(this.chartContainer.current, options);
  }

  componentDidUpdate() {
    this.chart.data = this._chartData();
    this.chart.update("none");
  }
  _chartData() {
    const chartData = {
      datasets: Object.entries(this.props.data).map(([sourceName, source]) => {
        return {
          label: sourceName,
          data: source.history,
          fill: true,
          backgroundColor: this._colorMap(sourceName)
          
        };
      }),
    };
    const labelCount = chartData.datasets.map(x => x.data.length).reduce((a,c)=> Math.max(a,c));    
    chartData.labels = Array.from({length: labelCount}, (_, i) => i + 1);
    return chartData;
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
