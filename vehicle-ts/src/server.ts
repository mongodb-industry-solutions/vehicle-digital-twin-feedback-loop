import express from "express";
import DittoApp from "./ditto/DittoApp";
import path from "path";
import bodyParser from "body-parser";

// Instantiate Express server
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/img/"));
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const dittoApp = new DittoApp();

app.get("/subscribe", (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  console.log("Client connection opened");
  res.writeHead(200, headers);
  res.write("data: Event listener subscribed!\n\n");
  dittoApp.addClient(res);

  req.on("close", () => {
    console.log("Client closed connection");
    res.end();
  });
});

app.post("/add_sensor", async (req, res) => {
  try {
    const result = await dittoApp.addSensor(req.body);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error("Error adding sensor data:", error);
    res.status(500).send("Failed to add sensor data.");
  }
});

app.post("/add_component", async (req, res) => {
  try {
    const result = await dittoApp.addComponent(req.body);
    res.send(result);
  } catch (error) {
    console.error("Error adding component data:", error);
    res.status(500).send("Failed to add component data.");
  }
});

app.post("/clear_components", async (req, res) => {
  try {
    const result = await dittoApp.clearComponent();
    res.send(result);
  } catch (error) {
    console.error("Error clearing components:", error);
    res.status(500).send("Failed to clear components.");
  }
});

app.get("/reset", async (req, res) => {
  try {
    const result = await dittoApp.resetBattery();
    res.send(result);
    //console.log(JSON.parse(vehicleData));
  } catch (error) {
    console.error("Error reseting battery data:", error);
    res.status(500).send("Failed to reset battery data.");
  }
});

app.get("/vehicle", async (req, res) => {
  try {
    const vehicleData = await dittoApp.getVehicleAsJSON();
    res.json(JSON.parse(vehicleData));
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    res.status(500).send("Failed to fetch vehicle data.");
  }
});

app.post("/start_sync", async (req, res) => {
  try {
    const result = await dittoApp.startSync();
    res.send(result);
  } catch (error) {
    console.error("Error starting ditto sync:", error);
    res.status(500).send("Failed to start sync.");
  }
});

app.post("/stop_sync", async (req, res) => {
  try {
    const result = await dittoApp.stopSync();
    res.send(result);
  } catch (error) {
    console.error("Error stopping ditto sync:", error);
    res.status(500).send("Failed to stop sync.");
  }
});

app.post("/stop_engine", async (req, res) => {
  try {
    const result = await dittoApp.stopEngine();
    res.send(result);
  } catch (error) {
    console.error("Error stopping vehicle engine:", error);
    res.status(500).send("Failed to stop engine.");
  }
});

app.post("/process_commands", async (req, res) => {
  try {
    console.log('process_commands', req.body.commands)
    const result = await dittoApp.processCommands(req.body.commands);
    res.send(result);
  } catch (error) {
    console.error("Error processing :", error);
    res.status(500).send("Failed to stop sync.");
  }
});

app.post("/clear_commands", async (req, res) => {
  try {
    const result = await dittoApp.clearCommands();
    res.send(result);
  } catch (error) {
    console.error("Error clearing commands:", error);
    res.status(500).send("Failed to clear commands.");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on("SIGINT", function () {
  console.log("Shutdown initiated!");
  process.exit();
});
