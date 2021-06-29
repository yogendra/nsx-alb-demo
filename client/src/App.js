/*global demoConfig*/
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HistoryChart from './components/HistoryChart.js';
import SummaryChart from './components/SummaryChart.js';

const sources = {};

export default class App extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = {
      sources: {},
      colors: ["blue","green","yellow","cyan","brown"]
    };
  }
 
  componentDidMount() {
    this.sendRequestTimer = setInterval(() => {this.sendRequest();}, demoConfig.request.interval);    
    this.updateSateTimer = setInterval(()=>{this.updateState();}, 1000);
    console.log("Timers ready");
  }
  sendRequest(){
    fetch(demoConfig.server.url)
      .then(response => response.json())
      .then(json => {this.processReponse(json)})
  }
  processReponse(response) {
    
    var source = response.environment.CLUSTER;
    
    if(!sources[source]){
      sources[source] = 0;
    }
    ++sources[source];
  };
  updateState(){
    var state =  {
      ...this.state,
      sources : sources
    };
    this.setState(state)
  };
  render() {
    return (
      <Container fluid="xs">
        <Row>
          <Col>NSX Demo</Col>
        </Row>
        <Row>
          <Col xs={2}>
              <SummaryChart title="Summary" data={this.state.sources} colors={this.state.colors}  />
          </Col>
          <Col xs={10}>
            <HistoryChart title="History" data={this.state.sources} colors={this.state.colors}/>
          </Col>
        </Row>
      </Container>
    );
  }
}
