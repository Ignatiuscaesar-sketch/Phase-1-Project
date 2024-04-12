const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files from the public directory
app.use(express.json()); // for parsing application/json

// Define your API endpoints here
// Example:
app.get('/api/events', (req, res) => {
    // logic to fetch and send events data
});

app.post('/api/events', (req, res) => {
    // logic to add a new event
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
