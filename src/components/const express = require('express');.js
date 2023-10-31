const express = require('express');
const multer = require('multer');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const cors = require('cors');
const mammoth = require('mammoth');
const fs = require('fs');
const cheerio = require('cheerio');
const app = express();
const port = 4009;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'egquizdatabase',
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.message);
        throw err;
    }
    console.log('Connected to the database');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(cors());

app.post('/upload', upload.single('document'), async (req, res) => {
    const docxFilePath = `uploads/${req.file.filename}`;
    const outputDir = `uploads/${req.file.originalname}_images`;
    // const test_id = req.body.test_id;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    try {
        const result = await mammoth.convertToHtml({ path: docxFilePath });
        const htmlContent = result.value;
        const $ = cheerio.load(htmlContent);
        const textResult = await mammoth.extractRawText({ path: docxFilePath });
        const textContent = textResult.value;

        // Split the text into sections based on a delimiter, e.g., paragraph separation.
        // Assuming paragraphs are separated by double line breaks.
        const textSections = textContent.split('\n\n');

        // Get all images in the order they appear in the HTML
        const images = [];
        $('img').each(function (i, element) {
            const base64Data = $(this).attr('src').replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            images.push(imageBuffer);
        });


        // Create a variable to keep track of the current question id
        let j = 0;
        for (let i = 0; i < images.length; i++) {
         if(j==0){
             var Question_id;
              const newRecord = {
                "question_img": images[i],
                "test_paper_id": req.body.test_id,
                "subi_id":req.body.subi_id
                // Add more columns and values as needed
              };
              
              const insertQuery = 'INSERT INTO questions SET ?';
              
              // Execute the INSERT query
              connection.query(insertQuery, newRecord, (err, result) => {
                if (err) {
                  console.error('Error inserting data: ' + err);
                } else {
                     Question_id = result.insertId;
                  console.log('Inserted data successfully.');
                }
              });
            j++;
              
         }
         if(j>0 && j<5){
            const newRecord = {
                "option_img": images[i],
                "question_id": Question_id
                // Add more columns and values as needed
              };
              
              const insertQuery = 'INSERT INTO options SET ?';
              
              // Execute the INSERT query
              connection.query(insertQuery, newRecord, (err, result) => {
                if (err) {
                  console.error('Error inserting data: ' + err);
                } 
              });
            j++;
         }
         if(j==5){
            const newRecord = {
                "solution_img": images[i],
                "question_id": Question_id
                // Add more columns and values as needed
              };
              
              const insertQuery = 'INSERT INTO solution SET ?';
              
              // Execute the INSERT query
              connection.query(insertQuery, newRecord, (err, result) => {
                if (err) {
                  console.error('Error inserting data: ' + err);
                } 
              });
            j=0;

         }
        }
        res.send('Text content and images extracted and saved to the database with the selected topic ID successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error extracting content and saving it to the database.');
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

