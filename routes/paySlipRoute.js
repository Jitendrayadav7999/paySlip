const express = require("express")
const router = express.Router()
const {generatePaySlipPdf} = require("../controllers/paySlipController")

router.get("/generate-payslip",generatePaySlipPdf)

module.exports = router