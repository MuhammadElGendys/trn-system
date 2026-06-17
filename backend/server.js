// Import axios for making HTTP requests to Node-RED
// Used to forward control commands from frontend to Node-RED PLC control
const axios = require("axios");

// Import Express web framework for creating REST API endpoints
const express = require("express");
// Import CORS (Cross-Origin Resource Sharing) middleware to allow frontend requests
const cors = require("cors");
// Import SQLite database connection from local database module
const db = require("./database/db");

// Create Express application instance
const app = express();
// Define server port where the backend will listen for requests
const PORT = 3000;

// Enable CORS for all routes (allows requests from any origin)
// This is required so the frontend (port 8000+) can communicate with backend (port 3000)
app.use(cors());
// Middleware to automatically parse incoming JSON request bodies
app.use(express.json());

// Store the latest received data point in memory for quick access
// This is served via /api/latest endpoint without database query
let latestData = null;

// GET endpoint: Health check / root endpoint
// Returns simple message to verify backend is running
app.get("/", (req, res) => {
    res.send("PLC Backend Server Running");
});

// GET endpoint: Test endpoint for debugging
// Returns JSON object to verify API is functional
app.get("/api/test", (req, res) => {
    res.json({
        status: "ok",
        message: "API working"
    });
});

// GET endpoint: Retrieve latest data point
// Returns the most recently received PLC data (stored in memory)
app.get("/api/latest", (req, res) => {
    // Return the latestData object, or empty object if no data received yet
    res.json(latestData || {});
});

// POST endpoint: Receive PLC data from Node-RED and store in database
// This endpoint acts as a bridge between Node-RED and the database
app.post("/api/data", (req, res) => {
    // Store the incoming data in memory for quick access via /api/latest
    latestData = req.body;

    // Extract individual fields from the request body using destructuring
    // This creates local variables for each data field
    const {
        ts,           // Timestamp when data was captured
        pressure,     // Renamed to voltage in Node-RED, but kept for backward compatibility
        motorRun,     // Robot status (boolean: true=running, false=stopped)
        temperature,  // Temperature value from PLC
        speedRPM,     // Speed/velocity in RPM
        alarmActive   // Alarm status (boolean: true=active, false=inactive)
    } = latestData;

    // Insert data into SQLite database for historical tracking and analysis
    // The question marks (?) are placeholders to prevent SQL injection attacks
    db.run(
        `
        INSERT INTO plc_history
        (ts, pressure, motorRun, temperature, speedRPM, alarmActive)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            // Use provided timestamp or generate current time if not provided
            ts || new Date().toISOString(),
            // Store pressure/voltage as-is (null if not provided)
            pressure ?? null,
            // Convert boolean motorRun to integer (1=true, 0=false) for SQLite storage
            motorRun ? 1 : 0,
            // Store temperature value or null if not provided
            temperature ?? null,
            // Store speed value or null if not provided
            speedRPM ?? null,
            // Convert boolean alarmActive to integer (1=true, 0=false) for SQLite storage
            alarmActive ? 1 : 0
        ],
        function (err) {
            if (err) {
                // Log error and return error response if insertion fails
                console.error("Insert error:", err.message);
                return res.status(500).json({
                    status: "error",
                    message: "Database insert failed"
                });
            }

            // Return success response with the database row ID (this.lastID from SQLite)
            res.json({
                status: "ok",
                message: "Data received and stored",
                id: this.lastID  // Database-generated ID of the inserted record
            });
        }
    );
});

app.get("/api/latest", (req, res) => {
    res.json(latestData || {});
});

// GET endpoint: Retrieve historical data from database
// Optional query parameter: ?limit=50 (default: 20 records)
app.get("/api/history", (req, res) => {
    // Parse limit from query parameters, default to 20 if not provided or invalid
    // parseInt converts string to number, || provides fallback value
    const limit = parseInt(req.query.limit) || 20;

    // Query database for historical data
    db.all(
        `
        SELECT * FROM plc_history
        ORDER BY id DESC
        LIMIT ?
        `,
        [limit],
        (err, rows) => {
            if (err) {
                // Log error and return error response if query fails
                console.error("Read error:", err.message);
                return res.status(500).json({
                    status: "error",
                    message: "Database read failed"
                });
            }

            // Return array of database records as JSON
            res.json(rows);
        }
    );
});

// Control endpoint to send commands to Node-RED
// Receives control commands from frontend with format: { variable: "motorRun", value: true }
// Forwards to Node-RED for S7 PLC communication
const NODE_RED_URL = "http://localhost:1880/api/control";
// IMPORTANT: Update NODE_RED_URL above to match your Node-RED server address and port
// See CONFIG_INSTRUCTIONS.md for details on finding your IP address
app.post("/api/control", async (req, res) => {
    try {
        // Send control command to Node-RED (configure NODE_RED_URL above)
        const response = await axios.post(
            NODE_RED_URL,
            req.body
        );

        res.json(response.data);

    } catch (err) {
        console.error("Control error:", err.message);

        res.status(500).json({
            status: "error",
            message: "Control request failed"
        });
    }
});

// Start the Express server and listen for incoming connections
app.listen(PORT, () => {
    // Log message when server successfully starts listening
    console.log(`Server running on port ${PORT}`);
});