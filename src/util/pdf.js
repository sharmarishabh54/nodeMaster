// create pdf  Document
const handlerbarPdf = require('handlebars-pdf');
const fs= require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../views/index.hbs')
console.log('file path', filePath)
const file = fs.readFileSync(filePath, 'utf8')

const time = new Date();
const min = String(time.getMinutes())
const hh = String(time.getHours())
const dd = String(time.getDate())
const mm = String(time.getMonth() + 1)
const yy = String(time.getFullYear())

const createPdf= async (data)=>{
    const doc = {
        template: file,
        context: data,
        path: "./Subscriptionbill-"+hh+"-"+min+"-"+dd+"-"+mm+"-"+yy+".pdf"
   }
    
    const pdf = await handlerbarPdf.create(doc)
    
    console.log('pdf is created')
    return pdf
}

module.exports = createPdf;
