'use strict';

import axios from "axios";
import express from "express";
import { Resolver } from "dns";


import cors from "cors";
import { readFileSync, existsSync} from 'fs';
const configFile = process.env.CONFIG_FILE || "config.json";
const config = existsSync(configFile)? JSON.parse(readFileSync(configFile)): JSON.parse(process.env.CONFIG_JSON);

if(config === undefined){
  console.error("Config not set");
  process.exit(1);
}else{
  console.dir(config);
}

const app = express();
app.use(cors());
const port = process.env.PORT || config.port || 3000;
var probeSchedule = null;
var sampleSchedule = null;

const data = {
  blue: {
    total: 0,
    history: [],
  },
  green: {
    total: 0,
    history: [],
  },
};

const dnsResolver = config.endpoint.type === "dns" ? new Resolver() : null;
if (dnsResolver != null) {
  dnsResolver.setServers(config.endpoint.nameservers);
}

// app.route('/api/v1')
app.get("/", (req,res)=>{
  res.redirect("/api/v1/")
})
app.get("/api/v1", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/v1/stats", (req, res) => {
  res.json(data);
});
app.get("/api/v1/start", (req, res) => {
  setupSchedule();
  res.json({
    status: "started",
  });
});
app.get("/api/v1/stop", (req, res) => {
  clearSchedule();
  res.json({
    status: "stopped",
  });
});
app.get("/api/v1/probe", (req, res) => {
  probe();  
  res.json(data);
});
app.get("/api/v1/sample", (req, res) => {  
  sample()
  res.json(data);
});
function setupSchedule() {
  clearSchedule();
  probeSchedule = setInterval(probe, config.probe.interval);
  sampleSchedule = setInterval(sample, config.sample.interval);
  console.log("Setup Schedule");
}

function clearSchedule() {
  if (probeSchedule != null) {
    clearInterval(probeSchedule);
  }
  if (sampleSchedule != null) {
    clearInterval(sampleSchedule);
  }
  console.log("Cleared Schedule");
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
      ++data[version].total;
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
    ++data[version].total;
  });
}

function sample() {
  Object.keys(data).forEach((versionName) => {
    const version = data[versionName];
    version.history = version.history.splice(1 - config.sample.max);
    version.history.push(version.total);
  });
}

app.listen(port, () => {
  console.log(`Client Backend app listening at http://localhost:${port}`);
});
