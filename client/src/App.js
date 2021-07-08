/*global demoConfig*/
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import HistoryChart from "./components/HistoryChart.js";
import SummaryChart from "./components/SummaryChart.js";

const style = {
  container :{
    
  },
  header : {
    color: 'white',
    backgroundColor: "#00364d",
    padding: "10px",
    fontSize: "32px",
    fontWeight: "bold",
    "margin-bottom": "10px"

  }
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.sources = {};
    demoConfig.server.versions.forEach((version) => {
      this.sources[version] = {
        total: 0,
        history: [],
      };
    });
    this.state = {
      stopped: true,
      sources: { ...this.sources },
      colors: demoConfig.graph.colors,
    };
  }

  sendRequest() {
    fetch(demoConfig.server.url)
      .then((response) => response.json())
      .then((json) => {
        this.processReponse(json);
      });
  }
  processReponse(response) {
    const sources = this.sources;
    var version = response.environment.CLUSTER;

    if (!this.sources[version]) {
      return;
    }
    const source = sources[version];
    ++source.total;
  }
  updateState() {
    const sources = {};
    Object.keys(this.state.sources).forEach((version) => {
      const newTotal = this.sources[version].total;
      const history = this.state.sources[version].history;
      history.push(newTotal);

      sources[version] = {
        total: newTotal,
        history: history,
      };
    });
    this.setState({ sources: sources });
  }
  startTesting() {
    this.sendRequestTimer = setInterval(() => {
      this.sendRequest();
    }, demoConfig.request.interval);
    this.updateSateTimer = setInterval(() => {
      this.updateState();
    }, demoConfig.sample.interval);
    this.setState({ stopped: false });
  }
  stopTesting() {
    clearInterval(this.sendRequestTimer);
    this.sendRequestTimer = null;
    clearInterval(this.updateSateTimer);
    this.updateSateTimer = null;
    this.setState({ stopped: true });
  }

  render() {
    const stopped = this.state.stopped;
    const handleClick = stopped
      ? this.startTesting.bind(this)
      : this.stopTesting.bind(this);

    return (
      <Container fluid="xs" style={style.container} > 
        <Row style={style.header}>
          <Col>NSX Demo</Col>
          <Col xs={1}>
            <Button
              size="lg"
              onClick={handleClick}
              variant={stopped ? "primary" : "danger"}
            >
              {stopped ? "Start" : "Stop"} Test
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <SummaryChart
              title="Summary"
              data={this.state.sources}
              colors={this.state.colors}
            />
          </Col>
          <Col xs={10}>
            <HistoryChart
              title="History"
              data={this.state.sources}
              colors={this.state.colors}
            />
          </Col>
        </Row>
        <Row></Row>
      </Container>
    );
  }
}
