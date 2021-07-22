'use strict';

import axios from "axios";
import express from "express";
import { Resolver } from "dns";


import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';


if(! "CONFIG_JSON" in process.env){
  console.error("CONFIG_JSON not set");
  process.exit(1);
}
const config = JSON.parse(process.env.CONFIG_JSON)

if(config === undefined){
  console.error("Config not set");
  process.exit(1);
}
console.dir(config);

function buildSources(){
  const sources = {};
  const emptyStats = {total: 0, history: []};
  if(config.endpoint.type  === "web"){
    config.endpoint.versions.forEach(version => {
      sources[version] = {...emptyStats};
    });
  }else if(config.endpoint.type === "dns"){
    Object.entries(config.endpoint.versionMap).forEach(([key,version])=>{
      if(!sources[version]){
        sources[version] = {...emptyStats};
      }
    });
  }else{
    console.error("Unknown source type");
  }
  return sources;
}
const app = express();
app.use(cors());
const port = process.env.PORT || config.port || 3001;
var probeSchedule = null;
var sampleSchedule = null;

const data = {
  status: {
    running: false
  },
  sources: {},
  config : {
    sample: config.sample,
    graph: config.graph
  }
};

data.sources = buildSources();

const dnsResolver = config.endpoint.type === "dns" ? new Resolver() : null;
if (dnsResolver != null) {
  dnsResolver.setServers(config.endpoint.nameservers);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, '../frontend/build')));


// app.route('/api/v1')
app.get("/", (req,res)=>{
  res.redirect("/index.html")
})
app.get("/api/v1", (req, res) => {
  res.json(data);
});
app.get("/api/v1/status", (req, res) => {
  res.json(data.status);
});
app.get("/api/v1/config", (req, res) => {
  res.json(data.config);
});
app.get("/api/v1/sources", (req, res) => {
  res.json(data.sources);
});
app.get("/api/v1/actions/start", (req, res) => {
  setupSchedule();
  res.json(data.status);
});
app.get("/api/v1/actions/stop", (req, res) => {
  clearSchedule();
  res.json(data.status);
});
app.get("/api/v1/actions/probe", (req, res) => {
  probe();  
  res.json(data.sources);
});
app.get("/api/v1/actions/sample", (req, res) => {  
  sample();
  res.json(data.sources);
});
app.get("/api/v1/actions/reset", (req,res) => {
  console.dir({src: data.sources});
  data.sources = buildSources();
  console.dir({src: data.sources});
  res.json(data);
});
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});
function setupSchedule() {
  clearSchedule();
  probeSchedule = setInterval(probe, config.probe.interval);
  sampleSchedule = setInterval(sample, config.sample.interval);
  console.log("Setup Schedule");
  data.status.running = true;
}

function clearSchedule() {
  if (probeSchedule != null) {
    clearInterval(probeSchedule);
  }
  if (sampleSchedule != null) {
    clearInterval(sampleSchedule);
  }
  console.log("Cleared Schedule");
  data.status.running = false;
}
process.on("beforeExit", clearSchedule);

function probe() {
  if (config.endpoint.type === "web") {
    probeWeb();
  } else if (config.endpoint.type === "dns") {
    probeDns();
  } else {
    console.log("Unknown endpoint type: " + endpointType);
  }
}
function probeWebVersionExtractor(webData) {
  return webData.environment.CLUSTER;
}
function probeWeb() {
  console.info("In probeWeb");
  axios
    .get(config.endpoint.address)
    .then((res) => {
      const version = probeWebVersionExtractor(res.data);
      ++data.sources[version].total;
    })
    .catch((err) => {
      console.error("[WebProbeError]" + err);
    });
}
function probeDns() {
  dnsResolver.resolve4(config.endpoint.address, { ttl: true }, (err, rec) => {
    const address = rec[0].address;
    const version = config.endpoint.versionMap[address];
    console.log({ a: address, v: version });
    ++data.sources[version].total;
  });
}

function sample() {
  Object.keys(data.sources).forEach((versionName) => {
    const version = data.sources[versionName];
    version.history = version.history.splice(1 - config.sample.max);
    version.history.push(version.total);
  });
}

app.listen(port, () => {
  console.log(`Client Backend app listening at http://localhost:${port}`);
});
