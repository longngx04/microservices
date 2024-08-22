const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

//enable cors 
app.use(cors());
// Connect to MongoDB
const MONGO_URI = "mongodb://localhost:27017/Microservice"
mongoose.connect(MONGO_URI || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());

// Routes
const urlRouter = require('./routes/urlRoute'); // Adjust the path as needed
app.use('/', urlRouter);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
