const express = require('express');
const userHandler = require('./routes/userHandler');
const shopHandler = require('./routes/shopHandler');
// const kycHandler = require('./routes/kycHandler');
// const bankAccountHandler = require('./routes/bankAccountHandler');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/users', userHandler);
app.use('/api/shops', shopHandler);
// app.use('/api/kyc', kycHandler);
// app.use('/api/bank-account', bankAccountHandler);


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'ONDC-Seller-App' // Specify the database name here
}).then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful database connection
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});