import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const Uploadformet = () => {
    
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const[testpaper,setTestpaper] =useState([])
    const [subjects, setSubjects] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectTestPaper,setSelectTestPaper] =useState('');
    const [selectedSubject, setSelectedSubject] = useState('');


    
    useEffect(() => {
        axios.get('http://localhost:4008/quiz_coures/')
            .then((res) => {
                setCourses(res.data);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    const fetchExams = (courseId) => {
        axios.get(`http://localhost:4008/quiz_exams/${courseId}`)
            .then((res) => {
                setExams(res.data);
            })
            .catch((error) => {
                console.error('Error fetching exams:', error);
            });
    };
    const fetchTestPaper = (examId) => {
        axios.get(`http://localhost:4008/test_paper/${examId}`)
            .then((res) => {
                setExams(res.data);
            })
            .catch((error) => {
                console.error('Error fetching test paper:', error);
            });
    };
    const fetchSubjects = (examId) => {
        axios.get(`http://localhost:4008/exam_subjects/${examId}`)
            .then((res) => {
                console.log('Subjects API Response:', res.data);
                setSubjects(res.data);
            })
            .catch((error) => {
                console.error('Error fetching subjects:', error);
            });
    };
    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId);
        setSelectedExam('');
        setSelectedSubject('');
        setSelectTestPaper('');
        fetchExams(courseId);
    };
    
    const handleExamChange = (event) => {
        const examId = event.target.value;
        setSelectedExam(examId);
        setSelectedSubject('');
        setSelectTestPaper('');
        fetchTestPaper(examId);
    };
    const handleTestParerChange = (event) => {
        const examId = event.target.value;
        setSelectedExam(examId);
        setSelectedSubject('');
        setSelectTestPaper('');
        fetchSubjects(examId);
    };
    
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('document', file);
        // formData.append('test_id', selectedTestId);
        fetch('http://localhost:4008/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            alert('suscefully uploded Document')
          })
          .catch((error) => {
            console.error(error);
          });
      };