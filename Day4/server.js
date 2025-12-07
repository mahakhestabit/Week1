const http = require('http');

// Global variable to maintain the counter in memory
let requestCounter = 0;

const server = http.createServer((req, res) => {
    // 1. Set common headers for a JSON response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    // 2. Handle the three required routes
    if (req.url === '/ping') {
        // Requirement 1: /ping returns timestamp
        const timestamp = Date.now();
        const response = { 
            message: "pong",
            timestamp: timestamp 
        };
        res.end(JSON.stringify(response));

    } else if (req.url === '/headers') {
        // Requirement 2: /headers returns request headers
        const response = {
            message: "Request headers received",
            headers: req.headers
        };
        res.end(JSON.stringify(response));

    } else if (req.url === '/count') {
        // Requirement 3: /count maintains counter in memory
        requestCounter++; // Increment the counter
        const response = {
            message: "Counter incremented",
            count: requestCounter
        };
        res.end(JSON.stringify(response));

    } else {
        // Handle 404 Not Found for any other path
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found', path: req.url }));
    }
});

const PORT = 3000;
const HOST = '127.0.0.1';

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
    console.log(`Test endpoints:`);
    console.log(`  - Ping: http://${HOST}:${PORT}/ping`);
    console.log(`  - Headers: http://${HOST}:${PORT}/headers`);
    console.log(`  - Count: http://${HOST}:${PORT}/count`);
});
