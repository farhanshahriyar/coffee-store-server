const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('coffee server is up and running')
})

// listen on port
app.listen(port, () => {
    console.log(`coffee server is running on port ${port}`)
})