const express = require("express")
const pdfCreateRoute = require("./routes/pdfCreateRoute")
const app = express()
 
app.use("/api",pdfCreateRoute)

app.listen(3000,()=>console.log("server is running on port 3000"))

