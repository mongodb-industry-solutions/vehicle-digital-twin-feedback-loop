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

  //Add device change listener
  realmApp.device.addListener(refreshDevice);

});

// Get device state and send event to refresh device component on UI
function refreshDevice() {
  const device = realmApp.getDeviceAsJSON();
  sendRefreshEvent(device);
}

// Send refresh event to browser window
function sendRefreshEvent(device: string) {
  client.write('event: refresh\n');
  client.write(`data: ${device}\n\n`);
}

/**
 * Provide add component endpoint
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
 * Provide add sensor measurement endpoint
 */
app.post('/add_sensor', (req, res) => {
  console.log(JSON.stringify(req.body));
  const result = realmApp.addSensor(req.body);
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