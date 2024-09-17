import express from "express";
import DittoApp from "./realm/DittoApp";
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
    //console.log(JSON.parse(vehicleData));
    res.json(JSON.parse(vehicleData));
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    res.status(500).send("Failed to fetch vehicle data.");
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
