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
    this.updateState();
  }

 
  updateState() {
    fetch("/api/v1/")
      .then((response) => response.json())
      .then((response) => {
        this.setState({ status: response.status, sources: response.data });
      });    
  }
  startTesting() {
    
    fetch("/api/v1/start")
      .then(response => response.json())
      .then(response =>{
        this.setState({status: response.status});
      });
    this.updateSateTimer = setInterval(() => {
      this.updateState();
    }, 1000);
  
  }
  stopTesting() {
    fetch("/api/v1/stop")
      .then(response => response.json())
      .then(response =>{
        this.setState({status: response.status});
      });
    clearInterval(this.updateSateTimer);
  }

  render() {
    const stopped = this.state.status !== "running";
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
