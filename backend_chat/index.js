require("dotenv").config();

const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const cookies = require("cookie-parser");
const login = require("./routes/login");
const user = require("./routes/users");
const message  = require("./routes/message");
const convo = require("./routes/conversation");

const app = express();
app.use(express.json());
app.use(cookies());

database();

const port = 3000;

app.listen(port,()=>{
    console.log("app is live on port 3000");
})

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



app.use("/api/auth",login);
app.use("/api/conversation",convo);
app.use("/api",message);
app.use("/api/users",user)