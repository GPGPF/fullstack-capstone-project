/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");
// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
const giftRouter=require("./routes/giftRoutes");
// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
const searchRouter=require("./routes/searchRoutes");
const authRouter=require("./routes/authRoutes");

const app = express();
app.use("*",cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use("/api/gifts",giftRouter);
app.use("/api/search",searchRouter);
app.use("/api/auth",authRouter);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server")
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});