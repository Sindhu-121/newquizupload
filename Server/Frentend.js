const express = require('express');
const multer = require('multer');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const cors = require('cors');
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
app.use(cors());

//feaching coureses

app.get('/courses', (req, res) => {
    const query = 'SELECT course_name FROM 1egquiz_courses';
    connection.query(query, (error, results) => {
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

  app.get("/exams/:course_id", (req, res) => {
    const course_id = req.params.course_id;
    const sql = "SELECT exam_name FROM 2egquiz_exam WHERE course_id= ?";
    db.query(sql, [course_id], (err, result) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        res.status(500).json({ error: 'Error fetching exams' });
        return;
      }
      res.json(result);
    });
  });

  app.get("/test_paper/:exam_id",(req,res)=>{
  const sql="SELECT year,paper_name FROM test_paper WHERE exam_id= ?";
  const exam_id=req.params.exam_id;
  db.query(sql, [exam_id] ,(err,result)=>{
    if(err){
      console.error('Error querying the database: ' + err.message);
     res.status(500).json({ error: 'Error fetching subjects' });
    return;
  }
  res.json(result);
  })
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
            question_img,
            option_img: [],
          });
        }
   
        const option = {
          option_img,
        };
   
        subjects[subject_name].questions.find(q => q.question_id === question_id).option_img.push(option);
      });
   
      res.json(subjects);
    });
  });
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});