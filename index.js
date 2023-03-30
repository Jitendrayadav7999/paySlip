const express = require("express")
const paySlipRoute = require("./routes/paySlipRoute")
const app = express()
app.set("view engine","ejs")
app.use("/api",paySlipRoute)

app.listen(3000,()=>console.log("server is running on port 3000"))