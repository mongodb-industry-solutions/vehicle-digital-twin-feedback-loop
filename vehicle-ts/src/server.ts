import express from "express";
import path from "path";
import RealmApp from "./realm/app";
import bodyParser from 'body-parser'

/**
 * Instantiate Realm application
 */
const realmApp = new RealmApp();
realmApp.login().catch(err => {
  console.error(err);
})

/**
 * Instantiate express server
 */
const webserver = express();
const port = 3000;

webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(express.static(__dirname + '/img/'));
webserver.use(express.static(__dirname + '/public/'));

webserver.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

/**
 * Create server-sent event endpoint
 */
let client: any;

webserver.get('/subscribe', (req, res) => {
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
  // Add vehicle change listener to send changes to browser
  realmApp.realm?.objects("Vehicle").addListener(refreshVehicle);
});

// Callback for vehicle changes
function refreshVehicle(realm: any, string: any) {
  if (string.deletions.length > 0) {
    // Vehicle deleted
  } else {
    sendRefreshEvent(realmApp.getVehicleAsJSON());
  }
}

// Publish vehicle refresh event to browser window
function sendRefreshEvent(vehicle: string) {
  client.write('event: refresh\n');
  client.write(`data: ${vehicle}\n\n`);
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
 * Provide a pause synced Realm endpoint
 */
webserver.get('/pause_realm', (req, res) => {
  const result = realmApp.pauseRealm();
  console.log(result);
  res.send(result);
})

/**
 * Provide a resume endpoint for a previously paused synced Realm
 */
webserver.get('/resume_realm', (req, res) => {
  const result = realmApp.resumeRealm();
  console.log(result);
  res.send(result);
})

/**
 * Provide add battery measurement endpoint
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
  realmApp.cleanupRealm().then(() => {
    process.exit();
  });
});
