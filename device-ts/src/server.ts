import express from "express";
import path from "path";
import RealmApp from "./realm/app";
import bodyParser from 'body-parser'

/**
 * Instantiate Realm application
 */
const realmApp = new RealmApp();
realmApp.login()


/**
 * Instantiate express server
 */
const webserver = express();
const port = 3000;

webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(express.static(__dirname + '/img/'));

// Load index.html on root path
webserver.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Browser update notifications
 */
let client: any;

// Hook to subscribe to browser notifications
webserver.get('/subscribe', (req, res) => {
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
  // Add change listener to send object changes to browser
  realmApp.realm?.objects("Device").addListener(refreshDevice);
});

// Get device state and send event to refresh device on UI
function refreshDevice() {
  sendRefreshEvent(realmApp.getDeviceAsJSON());
}

// Send refresh event to browser window
function sendRefreshEvent(device: string) {
    client.write('event: refresh\n');
    client.write(`data: ${device}\n\n`);
}

/**
 * Provide add component endpoint
 */
webserver.post('/add_component', (req, res) => {
  const result = realmApp.addComponent(req.body.name);
  console.log(result);
  res.send(result);
})

/**
 * Provide a pause synced Realm instance endpoint
 */
webserver.get('/pause_realm', (req, res) => {
  const result = realmApp.pauseRealm();
  console.log(result);
  res.send(result);
})

/**
 * Provide a resume endpoint for a previously paused synced Realm instance
 */
webserver.get('/resume_realm', (req, res) => {
  const result = realmApp.resumeRealm();
  console.log(result);
  res.send(result);
})

/**
 * Provide add sensor measurement endpoint
 */
webserver.post('/add_sensor', (req, res) => {
  const result = realmApp.addSensor(req.body);
  console.log(result);
  res.send(result);
})

/**
 * Run the express server on the provided port
 */
webserver.listen(port, () => {
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