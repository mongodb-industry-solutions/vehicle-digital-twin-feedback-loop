import express from "express";
import path from "path";
import { createDevice, addComponent, addSensor , pauseRealm, resumeRealm} from "./realm/app"

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// REST API create device endpoint
app.get('/create_device', (req, res) => {
  const result = createDevice("MyDevice");
  res.send(result);
})

// REST API add component endpoint
app.get('/add_component', (req, res) => {
  const result = addComponent("MyComponent");
  res.send(result);
})

// REST API push asymetric sensor object endpoint
app.get('/add_sensor', (req, res) => {
  const result = addSensor(0);
  res.send(result);
})

// REST API pause Realm endpoint
app.get('/pause_realm', (req, res) => {
  const result = pauseRealm();
  res.send(result);
})

// REST API resume Realm endpoint
app.get('/resume_realm', (req, res) => {
  const result = resumeRealm();
  res.send(result);
})

app.listen(port, () => {
  console.log(`Digital-Twin app listening on port ${port}`);
});


