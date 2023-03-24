const basic = (salary) =>{
    salary = parseInt(salary)
    return parseInt(salary) * 0.55
}
const HRA = (salary) =>{
    salary = parseInt(salary)
    return parseInt(salary) * 0.45
}
const DA = (salary) =>{
    salary = parseInt(salary)
    return parseInt(salary) * 0.32
}


module.exports = {basic,HRA,DA}