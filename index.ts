import express, { Request, Response } from 'express';
import mysql, { Connection } from 'mysql2/promise';

// Create an Express.js application
const app = express();

// Middleware to parse request body as JSON
app.use(express.json());

// // MySQL database connection details
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'testdb',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// // Create a connection pool
// const pool = mysql.createPool(dbConfig);

// Endpoint to handle HTTP POST requests
app.post('/webhook/v1', async (req: Request, res: Response) => {
  try {
    // Get the request body
    console.log('Request-------------------');
    console.log('Body-------------------');
    console.log(req.body);
    console.log('Headers-------------------');
    console.log(req.headers);

    // // Connect to the database
    // const connection: Connection = await mysql.createConnection(dbConfig);

    // // Insert the user into the database
    // await connection.query('INSERT INTO webhook into ()');

    // // Close the database connection
    // await connection.end();

    // Send a success response
    res.status(200).send({ success: true, });
  } catch (error) {
    // Send an error response
    res.status(500).send({ error: (error as Error).message });
  }
});

// Add support for GET requests to our webhook
app.get("/webhook/v1", (req, res) => {
  
  // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === 'deepam@1013') {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });

// Start the server
const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});