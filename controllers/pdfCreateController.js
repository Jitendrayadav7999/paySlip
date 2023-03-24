const pdf = require("pdf-creator-node");
const fs = require("fs");
const moment = require('moment');
const html = fs.readFileSync("./html/dummy.html", "utf8");
const { toWords } = require('../helper/numToWord')
const {basic,HRA,DA} = require("../helper/salaryCal")

const create = async (req, resp) => {
    let {
        name,
        dateOfJoining,
        Designation,
        Department,
        Location,
        LOP,
        EmployeeNo,
        BankName,
        BankAccountNo,
        PANNumber,
        PFNo,
        PFUAN,
        actualSalary,
        netSalary,
        PT,
        TDS,
        monthYear } = req.query

    //Logic Part

    const EffectiveWorkDays = moment(monthYear, "YYYY-MM").daysInMonth()
     const pt = PT ? 200 : 00
    console.log(PT)

    const TotalDeductions = (parseInt(pt) + parseInt(TDS || 00))
    let basicFull = basic(actualSalary)
    let basicGross = basic(netSalary) 
    let daFull = DA(basicFull)
    let daGross = DA(basicGross)
    let hraFull = HRA(basicFull)
    let hraGross = HRA(basicGross)
    let conveyanceFull = parseInt(actualSalary) - (basicFull + daFull + hraFull) //actual
    let conveyanceGross = parseInt(netSalary) - (basicGross + daGross + hraGross)

    let totalEarningFull = basicFull + daFull + hraFull + conveyanceFull
    let totalEarningGross = basicGross + daGross + hraGross + conveyanceGross
    let netPAy = totalEarningGross - TotalDeductions

    let rupeesInEnglish = toWords(netPAy)

    // Two decimal number in price
    // actualSalary = parseInt(actualSalary).toFixed(2)
    // basicActual = basicActual.toFixed(2)
    // daFull = daFull.toFixed(2)
    // daActual = daActual.toFixed(2)
    // hraFull = hraFull.toFixed(2)
    // hraActual = hraActual.toFixed(2)
    // totalEarningFull = totalEarningFull.toFixed(2)
    // totalEarningActual = totalEarningActual.toFixed(2)
    // specialAllowanceFull = specialAllowanceFull.toFixed(2)
    // specialAllowanceActual = specialAllowanceActual.toFixed(2)

    // data format
    // let d = new Date(2010,11);
    // let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    // let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    // console.log(`${mo} ${ye}`);

    //PDF create Part Start
    const options = {
        format: "A4",
        orientation: "portrait"

    };
    const paySlipDetails = [
        {
            name,
            dateOfJoining,
            Designation,
            Department,
            Location,
            EffectiveWorkDays,
            LOP,
            EmployeeNo,
            BankName,
            BankAccountNo,
            PANNumber,
            PFNo,
            PFUAN,
            pt,
            TDS,
            TotalDeductions,
            monthYear,
            basicFull,
            basicGross,
            daFull,
            daGross,
            hraFull,
            hraGross,
            conveyanceFull,
            conveyanceGross,
            totalEarningFull,
            totalEarningGross,
            netPAy,
            rupeesInEnglish
        }
    ]
    const fileName = `${name}-${monthYear}.pdf`
    const document = {
        html: html,
        data: {
            paySlipDetails: paySlipDetails,
        },
        path: `./pdf/${fileName}`,
        type: "",
    };
    await pdf.create(document, options)
    resp.download(`./pdf/${fileName}`)
}
module.exports = { create }