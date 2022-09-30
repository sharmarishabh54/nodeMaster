// create pdf  Document
const handlerbarPdf = require('handlebars-pdf');
const fs= require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../views/index.hbs')
console.log('file path', filePath)
const file = fs.readFileSync(filePath, 'utf8')


const createPdf= async (data)=>{
    const doc = {
        template: file,
        context: data,
        path: "./pdfFile/Subscriptionbill-"+ Date.now()+".pdf"
   }
    
    const pdf = await handlerbarPdf.create(doc)
    
    console.log('pdf is created')
    return pdf
}

module.exports = createPdf;
