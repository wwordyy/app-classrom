const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan")
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;


app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());     
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));  

app.use('/api/auth', require('./routers/authRouter'));
app.use('/api', require('./routers/dashboardRouter'));
app.use('/api', require('./routers/userRouter'));



app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
})