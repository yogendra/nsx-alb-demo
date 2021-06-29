/*global demoConfig*/
import React from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

class HistoryChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartContainer = React.createRef();
  }
  componentDidMount() {
    var options = {
      type: "line",

      data : {
        labels: this.labels(),
        datasets: this.datasets(),
      },
      options: {
        scales: {
            y: {
                stacked: true
            }
        }
    }
    };
    this.chart = new Chart(this.chartContainer.current, options);
  }
  componentDidUpdate() {
    const nds = this.datasets();
    const eds = this.chart.data.datasets;

    nds.forEach((dataset, index) =>{
      if (typeof eds[index] == "undefined"){
        eds[index] = dataset;
      }else{
        eds[index].data.push(dataset.data[0]);
        if(eds[index].data.length >= demoConfig.graph.max){
          eds[index].data.shift();
        }
      }
    });
    this.chart.update('none');
  }
  labels(){
    var len = demoConfig.graph.max;
    return Array.from({length: len}, (_, i) => i + 1)
  }
  datasets(){
    return Object.entries(this.props.data)
      .map( (entry, index) => {
        const [key,value] = entry;
        return {
          label: key,
          data: [value],
          fill: true,
          backgroundColor: key
        };
      });
  }

  render() {
    return (
      <div>
        <div>History</div>
        <canvas ref={this.chartContainer} />
      </div>
    );
  }
}
export default HistoryChart;
