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

//shared
app.use('/api/auth', require('./routers/authRouter'));
app.use('/api', require('./routers/userRouter'));
app.use('/api', require('./routers/shared/postCommentRouter'));


//observer
app.use('/api', require('./routers/observer/dashboardRouter'));
app.use('/api', require('./routers/observer/groupRouter'));
app.use('/api', require('./routers/shared/chatRouter'));
app.use('/api', require('./routers/observer/reportRouter'));
app.use('/api', require('./routers/observer/profileRouter'));


//admin
app.use('/api', require('./routers/admin/roleRouter'));
app.use('/api/admin/users',  require('./routers/admin/userRouter'));
app.use('/api/admin/groups', require('./routers/admin/groupRouter'));


// student
app.use('/api/student', require('./routers/student/postRouter'));
app.use('/api/student', require('./routers/student/practiceRouter'));
app.use('/api/student', require('./routers/student/profileRouter'));

// teacher
app.use('/api', require('./routers/teacher/teacherRouter'));




app.use('/uploads', express.static('uploads'));




app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
})