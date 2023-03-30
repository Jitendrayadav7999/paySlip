const ejs = require("ejs")
const fs = require("fs");
const moment = require('moment');
const puppeteer = require("puppeteer")
const html = fs.readFileSync("./views/paySlip.ejs", "utf8");
const { toWords } = require('../helper/numToWord')
const { basic, HRA, DA } = require("../helper/salaryCal");

const generatePaySlipPdf = async (req, res) => {
    try {
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



        // data format
        // let d = new Date(2010,11);
        // let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        // let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        // console.log(`${mo} ${ye}`);


        const paySlipDetails =
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

        const fileName = `${name}-${monthYear}.pdf`

        const paySlip = ejs.render(html, paySlipDetails)


  //generate paySlip pdf logic
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(paySlip)
        await page.emulateMediaType("screen")
        await page.pdf({
            path: `pdf/${fileName}`,
            format:"A4",
            margin:{
                left:"20px",
                right:"20px"
            },
         
        });
        console.log("done")
        await browser.close();
        

        res.download(`pdf/${fileName}`)
        setTimeout(()=>{
            fs.unlinkSync(`pdf/${fileName}`);
        },1000)


    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Something Is Wrong" })
    }
}
module.exports = {  generatePaySlipPdf  }
