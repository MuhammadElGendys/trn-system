// Import path module to construct database file path independent of OS (Windows/Linux/Mac)
const path = require("path");
// Import sqlite3 database library for data persistence
const sqlite3 = require("sqlite3").verbose();

// Construct absolute path to database file
// __dirname = directory of current file
// This creates/opens plc_data.db in the same directory as this file
const dbPath = path.join(__dirname, "backend/database/plc_data");

// Open or create SQLite database connection
// If database doesn't exist, SQLite automatically creates it
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        // Log error if database opening/creation fails
        console.error("Error opening database:", err.message);
    } else {
        // Log success message when database connection is established
        // Use db.serialize() to ensure database operations execute in order
        // This prevents race conditions when multiple operations run simultaneously
        db.serialize(() => {
            // Create table for storing historical PLC data if it doesn't already exist
            // The IF NOT EXISTS clause prevents errors if table already exists
            db.run(`
                CREATE TABLE IF NOT EXISTS plc_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ts TEXT,
                    pressure REAL,
                    motorRun INTEGER,
                    temperature REAL,
                    speedRPM REAL,
                    alarmActive INTEGER
                )
            `);
        });
    }
});

// Export database instance for use in other files (server.js)
// This allows server.js to use all database operations (db.run, db.all, etc.)
module.exports = db;