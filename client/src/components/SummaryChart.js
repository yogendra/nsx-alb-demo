import React from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

class SummaryChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartContainer = React.createRef();
  }
  componentDidMount() {
    var options = {
      type: "doughnut",
      data : {
        labels: this.labels(),
        datasets: [
          {
            label: this.props.title,
            data: this.dataPoints(),
            backgroundColor: ["blue", "green"],
          },
        ],
      }
    };
    this.chart = new Chart(this.chartContainer.current, options);
  }
  componentDidUpdate() {
    this.chart.data.labels = this.labels();
    this.chart.data.datasets[0].data = this.dataPoints();    
    this.chart.update();
  }
  labels(){
    return Object.entries(this.props.data)
      .sort((e1, e2)=>{return e1[0].localeCompare(e2[0])})
      .map( entry => entry[0]);
  }
  dataPoints(){
    return Object
      .entries(this.props.data)
      .sort((e1, e2)=>{return e1[0].localeCompare(e2[0])})
      .map( entry => entry[1]);
  }

  render() {
    return (
      <div>
        <div>Summary</div>
        <canvas ref={this.chartContainer} />
      </div>
    );
  }
}
export default SummaryChart;
