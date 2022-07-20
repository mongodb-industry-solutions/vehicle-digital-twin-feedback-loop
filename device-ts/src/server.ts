import express from "express";
import path from "path";
import * as realmApp from "./realm/app";
import bodyParser from 'body-parser'



/**
 * Instantiate express server
 */
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Load index.html on root path
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Notify browser window
 */
let client: any = null;

app.get('/subscribe', (req, res) => {
  // send headers to keep connection alive
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  // send client a simple response
  res.write('data: Eventlistener subscribed!\n\n');
  // store `res` of client to let us send events at will
  client = res;
  // listen for client 'close' requests
  req.on('close', () => { client = null; });

  //Add devices collection change listener
  realmApp.addDevicesChangeListener(sendDevicesEvent);

});

// send refresh event to browser
function sendRefreshEvent(data:any) {
  client.write('event: refresh\n');
  client.write(`data: ${data.name}\n\n`);
}

// send list of devices to browser
function sendDevicesEvent() {
  console.log("Device Change Detected!");
  let event = "";
  const devices = realmApp.getDevices();
  console.log(JSON.stringify(devices));

  client.write('event: devices\n');
  client.write(`data: ${JSON.stringify(devices)}\n\n`);
}

/**
 * Provide get device names endpoint
 */
app.get('/get_device_names', (req, res) => {
  const devices: string[] = realmApp.getDevices();
  res.send({ devices });
})

/**
 * Provide create device endpoint
 */
app.post('/create_device', (req, res) => {
  const result = realmApp.createDevice(req.body.name);
  res.send(result);
  //console.log('Device created: ' + JSON.stringify(result));
  sendRefreshEvent(result.result);
})

/**
 * Provide create component endpoint
 */
app.post('/add_component', (req, res) => {
  const result = realmApp.addComponent(req.body.name);
  res.send(result);
})

/**
 * Provide a pause synced Realm instance endpoint
 */
app.get('/pause_realm', (req, res) => {
  const result = realmApp.pauseRealm();
  res.send(result);
})

/**
 * Provide a resume endpoint for a previously paused synced Realm instance
 */
app.get('/resume_realm', (req, res) => {
  const result = realmApp.resumeRealm();
  res.send(result);
})

/**
 * Provide an add object change listener endpoint
 */
app.get('/add_listener', (req, res) => {
  const result = realmApp.addObjectChangeListener();
  res.send(result);
})

/**
 * Provide a remove a previously added object change listener endpoint
 */
app.get('/remove_listener', (req, res) => {
  const result = realmApp.removeObjectChangeListener();
  res.send(result);
})

/**
 * Provide add sensor measurement endpoint
 */
app.post('/add_sensor', (req, res) => {
  const result = realmApp.addSensor(req.body.value);
  res.send(result);
})

/**
 * Run the express server on the provided port
 */
app.listen(port, () => {
  console.log(`Digital-Twin app listening on port ${port}`);
});

/**
 * On process shutdown clean Realm and exit program
 */
process.on("SIGINT", function () {
  console.log("Shutdown initiated!");
  realmApp.cleanupRealm();
  process.exit();
});