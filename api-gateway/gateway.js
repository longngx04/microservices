const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

app.use('/api/shorten', createProxyMiddleware({
    target: 'http://localhost:5001', // URL shortening service
    changeOrigin: true,
    pathRewrite: {
        '^/api/shorten': '', // Remove base path
    },
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
