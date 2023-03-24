const express = require("express")
const router = express.Router()
const {create} = require("../controllers/pdfCreateController")

router.get("/generate-payslip",create)

module.exports = router