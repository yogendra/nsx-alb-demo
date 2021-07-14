import React from "react";
import { Chart, registerables } from "chart.js";
import { Container, Row, Col } from "react-bootstrap";
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
class SummaryChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartContainer = React.createRef();
  }
  componentDidMount() {
    var options = {
      type: "doughnut",
      options: {
        animation: {
          animateRotate: false,
        },
      },
      data: this._chartData()
    };
    this.chart = new Chart(this.chartContainer.current, options);
  }
  _chartData() {
    const labels = [];
    const data = [];
    for (const [key, value] of Object.entries(this.props.data)) {
      labels.push(key);
      data.push(value.total);
    }
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: this.props.config.graph.colors,
        },
      ],
    };
  }
  componentDidUpdate() {
    this.chart.data = this._chartData();
    this.chart.update();
  }
  render() {
    const table = !this.props.data ? [] : Object.keys(this.props.data).map((version) => {
      return (
        <Row>
          <Col>{version}</Col>
          <Col>{this.props.data[version].total}</Col>
        </Row>
      );
    });
    
    return (
      <Container style={style.container} fluid>
        <Row style={style.header}>
          <Col>Summary</Col>
        </Row>
        <Row style={style.content}>
          <Col>
            <canvas ref={this.chartContainer} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>Source</Col>
                <Col>Count</Col>
              </Row>
              {table}
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default SummaryChart;
