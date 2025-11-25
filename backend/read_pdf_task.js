import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, '../Climate_Cloud_Data.pdf');

try {
    const dataBuffer = fs.readFileSync(pdfPath);
    pdf(dataBuffer).then(function(data) {
        console.log(data.text);
    }).catch(err => {
        console.error("Error parsing PDF:", err);
    });
} catch (err) {
    console.error("Error reading file:", err);
}
