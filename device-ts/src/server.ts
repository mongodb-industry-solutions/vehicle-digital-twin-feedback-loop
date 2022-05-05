import express from "express";
import path from "path";
import { createDevice, addComponent } from "./realm/app"

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// REST API create a device endpoint
app.get('/create_device', (req, res) => {
  const result = createDevice("MyDevice");
  res.send(result);
})

// REST API add a component endpoint
app.get('/add_component', (req, res) => {
  const result = addComponent("MyComponent");
  res.send(result);
})

app.listen(port, () => {
  console.log(`Digital-Twin app listening on port ${port}`);
});


