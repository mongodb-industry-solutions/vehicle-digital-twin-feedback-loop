import express from "express";
import path from "path";
import { createDevice, addComponent, addSensor , pauseRealm, resumeRealm, addObjectChangeListener, removeObjectChangeListener} from "./realm/app"
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
 * Provide create device endpoint
 */
app.post('/create_device', (req, res) => {
  const result = createDevice(req.body.name);
  res.send(result);
})

/**
 * Provide create component endpoint
 */
app.post('/add_component', (req, res) => {
  const result = addComponent(req.body.name);
  res.send(result);
})

/**
 * Provide a pause synced Realm instance endpoint
 */
app.get('/pause_realm', (req, res) => {
  const result = pauseRealm();
  res.send(result);
})

/**
 * Provide a resume endpoint for a previously paused synced Realm instance
 */
app.get('/resume_realm', (req, res) => {
  const result = resumeRealm();
  res.send(result);
})

/**
 * Provide an add object change listener endpoint
 */
app.get('/add_listener', (req, res) => {
  const result = addObjectChangeListener();
  res.send(result);
})

/**
 * Provide a remove a previously added object change listener endpoint
 */
app.get('/remove_listener', (req, res) => {
  const result = removeObjectChangeListener();
  res.send(result);
})

/**
 * Provide add sensor measurement endpoint
 */
 app.post('/add_sensor', (req, res) => {
  const result = addSensor(req.body.value);
  res.send(result);
})

/**
 * Run the express server on the provided port
 */
app.listen(port, () => {
  console.log(`Digital-Twin app listening on port ${port}`);
});


