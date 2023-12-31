// const express = require('express');
// const multer = require('multer');
// const mysql = require('mysql2'); // Use mysql2 instead of mysql
// const cors = require('cors');
// const mammoth = require('mammoth');
// const fs = require('fs');
// const cheerio = require('cheerio');
// const app = express();
// const port = 4009;

// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'egrad_quiz',
// };

// const connection = mysql.createConnection(dbConfig);

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database: ' + err.message);
//         throw err;
//     }
//     console.log('Connected to the database');
// });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage });

// app.use(cors());

// app.get('/quiz_coures', (req, res) => {
//   const sql = 'SELECT * FROM 1egquiz_courses';
//   connection.query(sql, (err, result) => {
//       if (err) {
//           console.error('Error querying the database: ' + err.message);
//           res.status(500).json({ error: 'Error fetching coureses' });
//           return;
//       }
//       res.json(result);
//   });
// });

// app.get('/quiz_exams/:course_id', (req, res) => {
//   const course_id = req.params.course_id;
//   const sql = 'SELECT * FROM 2egquiz_exam WHERE course_id = ?';
//   connection.query(sql, [course_id], (err, result) => {
//       if (err) {
//           console.error('Error querying the database: ' + err.message);
//           res.status(500).json({ error: 'Error fetching exams' });
//           return;
//       }
//       res.json(result);
//   });
// });

// app.get('/test_paper/:exam_id', (req, res) => {
//   const exam_id = req.params.exam_id;
//   const sql = 'SELECT * FROM test_paper WHERE exam_id = ?';
//   connection.query(sql, [exam_id], (err, result) => {
//       if (err) {
//           console.error('Error querying the database: ' + err.message);
//           res.status(500).json({ error: 'Error fetching Test Papers' });
//           return;
//       }
//       res.json(result);
//   });
// });


// app.get('/exam_subjects/:exam_id', (req, res) => {
//   const exam_id = req.params.exam_id;
//   const sql = 'SELECT i.subject_name,i.subi_id FROM exam_subjects e,egquiz_subindex i WHERE e.subi_id = i.subi_id AND exam_id=?';
//   connection.query(sql, [exam_id], (err, result) => {
//       if (err) {
//           console.error('Error querying the database: ' + err.message);
//           res.status(500).json({ error: 'Error fetching Test Papers' });
//           return;
//       }
//       res.json(result);
//   });
// });





// app.post('/upload', upload.single('document'), async (req, res) => {
//     const docxFilePath = `uploads/${req.file.filename}`;
//     const outputDir = `uploads/${req.file.originalname}_images`;
//     // const test_id = req.body.test_id;

//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir);
//     }
//     let Question_id;
//     try {
//         const result = await mammoth.convertToHtml({ path: docxFilePath });
//         const htmlContent = result.value;
//         const $ = cheerio.load(htmlContent);
//         const textResult = await mammoth.extractRawText({ path: docxFilePath });
//         const textContent = textResult.value;

//         // Split the text into sections based on a delimiter, e.g., paragraph separation.
//         // Assuming paragraphs are separated by double line breaks.
//         const textSections = textContent.split('\n\n');

//         // Get all images in the order they appear in the HTML
//         const images = [];
//         $('img').each(function (i, element) {
//             const base64Data = $(this).attr('src').replace(/^data:image\/\w+;base64,/, '');
//             const imageBuffer = Buffer.from(base64Data, 'base64');
//             images.push(imageBuffer);
//         });


//         // Create a variable to keep track of the current question id
//         let j = 0;
//         for (let i = 0; i < images.length; i++) {
//          if(j==0){
             
//               const newRecord = {
//                 "question_img": images[i],
//                 "test_paper_id": req.body.test_id,
//                 "subi_id":req.body.subi_id
               
//                 // Add more columns and values as needed
//               };
              
//               const insertQuery = 'INSERT INTO questions SET ?';
              
//               // Execute the INSERT query
//               connection.query(insertQuery, newRecord, (err, result) => {
//                 if (err) {
//                   console.error('Error inserting data: ' + err);
//                 } else {
//                      Question_id = result.insertId;
//                   console.log('Inserted data successfully.');
//                 }
//               });
//             j++;
              
//          }
//          if(j>0 && j<5){
//             const newRecord = {
//                 "option_img": images[i],
//                 "question_id": Question_id
//                 // Add more columns and values as needed
//               };
              
//               const insertQuery = 'INSERT INTO options SET ?';
              
//               // Execute the INSERT query
//               connection.query(insertQuery, newRecord, (err, result) => {
//                 if (err) {
//                   console.error('Error inserting data: ' + err);
//                 } 
//               });
//             j++;
//          }
//          if(j==5){
//             const newRecord = {
//                 "solution_img": images[i],
//                 "question_id": Question_id
//                 // Add more columns and values as needed
//               };
              
//               const insertQuery = 'INSERT INTO solution SET ?';
              
//               // Execute the INSERT query
//               connection.query(insertQuery, newRecord, (err, result) => {
//                 if (err) {
//                   console.error('Error inserting data: ' + err);
//                 } 
//               });
//             j=0;

//          }
//         }
//         res.send('Text content and images extracted and saved to the database with the selected topic ID successfully.');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error extracting content and saving it to the database.');
//     }
// });
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



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
    database: 'egrad_quiz',
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

app.get('/quiz_coures', (req, res) => {
  const sql = 'SELECT * FROM 1egquiz_courses';
  connection.query(sql, (err, result) => {
      if (err) {
          console.error('Error querying the database: ' + err.message);
          res.status(500).json({ error: 'Error fetching coureses' });
          return;
      }
      res.json(result);
  });
});

app.get('/quiz_exams/:course_id', (req, res) => {
  const course_id = req.params.course_id;
  const sql = 'SELECT * FROM 2egquiz_exam WHERE course_id = ?';
  connection.query(sql, [course_id], (err, result) => {
      if (err) {
          console.error('Error querying the database: ' + err.message);
          res.status(500).json({ error: 'Error fetching exams' });
          return;
      }
      res.json(result);
  });
});

app.get('/test_paper/:exam_id', (req, res) => {
  const exam_id = req.params.exam_id;
  const sql = 'SELECT * FROM test_paper WHERE exam_id = ?';
  connection.query(sql, [exam_id], (err, result) => {
      if (err) {
          console.error('Error querying the database: ' + err.message);
          res.status(500).json({ error: 'Error fetching Test Papers' });
          return;
      }
      res.json(result);
  });
});


app.get('/exam_subjects/:exam_id', (req, res) => {
  const exam_id = req.params.exam_id;
  const sql = 'SELECT i.subject_name,i.subi_id FROM exam_subjects e,egquiz_subindex i WHERE e.subi_id = i.subi_id AND exam_id=?';
  connection.query(sql, [exam_id], (err, result) => {
      if (err) {
          console.error('Error querying the database: ' + err.message);
          res.status(500).json({ error: 'Error fetching Test Papers' });
          return;
      }
      res.json(result);
  });
});




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
      const textSections = textContent.split('\n\n');

      const images = [];
      $('img').each(function (i, element) {
          const base64Data = $(this).attr('src').replace(/^data:image\/\w+;base64,/, '');
          const imageBuffer = Buffer.from(base64Data, 'base64');
          images.push(imageBuffer);
      });


  
      let j = 0; var Question_id;
      for (let i = 0; i < images.length; i++) {
       if(j==0){
        const questionRecord = {
          "question_img": images[i],
          "test_paper_id": req.body.test_id,
          "subi_id": req.body.subi_id
      };
      console.log(j)
      Question_id = await insertRecord('questions', questionRecord);
          j++;
       }
       else if(j>0 && j<5){
        const optionRecord = {
          "option_img": images[i],
          "question_id": Question_id
      };
      console.log(j)
      await insertRecord('options', optionRecord);
          j++;
       }
      else if(j==5){
        const solutionRecord = {
          "solution_img": images[i],
          "question_id": Question_id
      };
      console.log(j)
      await insertRecord('solution', solutionRecord);
          j=0;
       }
  
      }
      res.send('Text content and images extracted and saved to the database with the selected topic ID successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error extracting content and saving it to the database.');
  }

});
// async function insertAnswer(table, record) {
//   return new Promise((resolve, reject) => {
//     const insertQuery = `INSERT INTO ${table} (answer_img, question_id) VALUES (?, ?)`;
//     connection.query(insertQuery, [record.answer_img, record.question_id], (err, result) => {
//       if (err) {
//         console.error('Error inserting answer data: ' + err);
//         reject(err);
//       } else {
//         console.log(`Answer id: ${result.insertId}`);
//         resolve(result.insertId);
//       }
//     });
//   });
// }
 
// // Inside your route handler:
// let currentQuestionIndex = 1; // Initialize the current question index to 1
// for (let i = 0; i < textSections.length; i++) {
//   if (textSections[i].trim().startsWith('[ans]')) {
//     const answerText = textSections[i].trim().replace('[ans]', '');
//     const answerRecord = {
//       answer_img: answerText,
//       question_id: currentQuestionIndex,
//     };
//     await insertAnswer('answer', answerRecord);
//     console.log(`Answer text '${answerText}' inserted successfully into answer table for question id ${currentQuestionIndex}`);
//     currentQuestionIndex++; // Increment the current question index
//   }
// }
function insertRecord(table, record) {
return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO ${table} SET ?`;
    connection.query(insertQuery, record, (err, result) => {
        if (err) {
            // console.error('Error inserting data: ' + err);
            reject(err);
        } else {
            console.log(`${table} id: ${result.insertId}`);
            resolve(result.insertId);
        }
    });
});
}


// app.get("/quiz_all/:subi_id", (req, res) => {
//   const subi_id = req.params.subi_id;
  
//   const sql = ` SELECT q.question_id,q.question_img,o.option_img,o.option_id FROM questions q,options o WHERE q.question_id=o.question_id AND q.subi_id=?`;

//   connection.query(sql, [subi_id], (err, results) => {
//       if (err) {
//           console.error('Error querying the database: ' + err.message);
//           res.status(500).json({ error: 'Error fetching data' });
//           return;
//       }

//       const questions = {};

//       results.forEach((row) => {
//           const { question_img,question_id,option_img,option_id } = row;

//           if (!questions[question_id]) {
//               questions[question_id] = {
//                 question_id,
//                 question_img:question_img.toString('base64'),
//                   options: [],
//               };
//           }

//           const option = {
//               option_id,
//               option_img:option_img.toString('base64'),
//           };

//           questions[question_id].options.push(option);
//       });

//       res.json(Object.values(questions)); // Convert the object to an array of questions.
//   });
// });


app.get('/test_paper', (req, res) => {
  // Query to select data from the test table
  const query = 'SELECT test_paper_id,year,paper_name FROM test_paper';
  // Execute the query
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Error retrieving data from database.');
      return;
    }
    console.log('Retrieved data from test table:');
    console.log(results);
    // Send the retrieved data as JSON response
    res.json(results);
  });
});

app.get("/quiz_all/:test_paper_id", (req, res) => {
    const sql = "SELECT q.question_id,q.question_img,es.subi_id,es.subject_name,o.option_img,o.option_id FROM questions q,egquiz_subindex es,options o WHERE `test_paper_id` = ? AND q.subi_id=es.subi_id AND q.question_id=o.question_id;";
    const test_paper_id = req.params.test_paper_id;
    db.query(sql, [test_paper_id], (err, results) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        res.status(500).json({ error: 'Error fetching Exams_Id' });
        return;
      }
   
      const subjects = {};
   
      results.forEach((row) => {
        const { subi_id, subject_name, question_id, question_img,option_img } = row;
   
        if (!subjects[subject_name]) {
          subjects[subject_name] = {
            subi_id,
            subject_name,
            questions: [],
          };
        }
   
        const question = subjects[subject_name].questions.find(q => q.question_id === question_id);
        if (!question) {
          subjects[subject_name].questions.push({
            question_id,
            question_img:question_img.toString('base64'),
            option_img: [],
          });
        }
   
        const option = {
            option_img:option_img.toString('base64'),
        };
   
        subjects[subject_name].questions.find(q => q.question_id === question_id).option_img.push(option);
      });
   
      res.json(subjects);
    });
  });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});