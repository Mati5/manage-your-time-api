const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./app/routes/auth');
const timerRoute = require('./app/routes/timer');


const app = express();

dotenv.config();

//Connect to DB


//Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/timer', timerRoute);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server up on ${process.env.SERVER_PORT}`);
});