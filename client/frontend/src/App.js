import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import HistoryChart from "./components/HistoryChart.js";
import SummaryChart from "./components/SummaryChart.js";

const style = {
  container: {},
  header: {
    color: "white",
    backgroundColor: "#00364d",
    padding: "10px",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.sources = {};
    this.state = {
      status: {
        running: false,
      },
    };
  }
  componentDidMount() {
    this.updateState();
  }
  updateState() {
    fetch("/api/v1/")
      .then((response) => response.json())
      .then((response) => {
        this.setState(response);
        if (response.status.running === true &&  this.autoUpdateTimer === null) {
          this.startAutoUpdate();
        }
      });
  }
  startTesting() {
    fetch("/api/v1/actions/start")
      .then((response) => response.json())
      .then((response) => {
        this.setState({ status: response });
      });
    this.startAutoUpdate();
  }
  startAutoUpdate() {
    this.autoUpdateTimer = setInterval(() => {
      this.updateState();
    }, 2000);
  }
  stopAutoUpdate() {
    if (this.autoUpdateTimer != null) {
      clearInterval(this.autoUpdateTimer);
      this.autoUpdateTimer = null;
    }
  }
  stopTesting() {
    fetch("/api/v1/actions/stop")
      .then((response) => response.json())
      .then((response) => {
        this.setState({ status: response });
      });
    this.stopAutoUpdate();
  }
  handleReset() {
    fetch("/api/v1/actions/reset")
      .then((response) => response.json())
      .then((response) => {
        this.setState(response);
      });
  }

  render() {
    const stopped = this.state.status.running !== true;
    const handleClick = stopped
      ? this.startTesting.bind(this)
      : this.stopTesting.bind(this);
    const summary = !this.state.sources ? (
      ""
    ) : (
      <SummaryChart
        title="Summary"
        data={this.state.sources}
        config={this.state.config}
      />
    );
    const history = !this.state.sources ? (
      ""
    ) : (
      <HistoryChart
        title="History"
        data={this.state.sources}
        config={this.state.config}
      />
    );
    return (
      <Container fluid="xs" style={style.container}>
        <Row style={style.header}>
          <Col sm={10}>NSX Demo</Col>

          <Col sm="auto">
            <Button
              size="sm"
              onClick={(event) => {
                this.handleReset();
              }}
              variant="secondary"
            >
              Reset
            </Button>
          </Col>
          <Col sm="auto">
            <Button
              size="sm"
              onClick={handleClick}
              variant={stopped ? "primary" : "danger"}
            >
              {stopped ? "Start" : "Stop"} Test
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={2}>{summary}</Col>
          <Col xs={10}>{history}</Col>
        </Row>
        <Row></Row>
      </Container>
    );
  }
}
