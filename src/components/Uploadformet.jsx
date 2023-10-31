import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Uploadformet = () => {
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [testpaper, setTestpaper] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedTestPaper, setSelectedTestPaper] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        axios.get('http://localhost:4009/quiz_coures/')
            .then((res) => {
                setCourses(res.data);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    const fetchExams = (courseId) => {
        axios.get(`http://localhost:4009/quiz_exams/${courseId}`)
            .then((res) => {
                setExams(res.data);
            })
            .catch((error) => {
                console.error('Error fetching exams:', error);
            });
    };

    const fetchTestPaper = (examId) => {
        axios.get(`http://localhost:4009/test_paper/${examId}`)
            .then((res) => {
                setTestpaper(res.data);
            })
            .catch((error) => {
                console.error('Error fetching test paper:', error);
            });
    };

    const fetchSubjects = (examId) => {
        axios.get(`http://localhost:4009/exam_subjects/${examId}`)
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
        setSelectedTestPaper('');
        fetchExams(courseId);
    };

    const handleExamChange = (event) => {
        const examId = event.target.value;
        setSelectedExam(examId);
        setSelectedSubject('');
        setSelectedTestPaper('');
        fetchTestPaper(examId);
        fetchSubjects(examId);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('subi_id', selectedSubject);
        formData.append('test_id', selectedTestPaper);
        fetch('http://localhost:4009/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                alert('successfully uploaded Document');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="">
                        <em>Select the Course</em>
                    </MenuItem>
                    {courses.map((course) => (
                        <MenuItem key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                    value={selectedExam}
                    onChange={handleExamChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="">
                        <em>Select the Exam</em>
                    </MenuItem>
                    {exams.map((exam) => (
                        <MenuItem key={exam.exam_id} value={exam.exam_id}>
                            {exam.exam_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                    value={selectedTestPaper}
                    onChange={(event) => setSelectedTestPaper(event.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="">
                        <em>Select the Test Paper</em>
                    </MenuItem>
                    {testpaper.map((TestPaper) => (
                        <MenuItem key={TestPaper.test_paper_id} value={TestPaper.test_paper_id}>
                            {TestPaper.year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                    value={selectedSubject}
                    onChange={(event) => setSelectedSubject(event.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="">
                        <em>Select the Subject</em>
                    </MenuItem>
                    {subjects.map((subject) => (
                        <MenuItem key={subject.subi_id} value={subject.subi_id}>
                            {subject.subject_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <h1>Document Image Uploader</h1>
            <input type="file" accept=".docx" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <div></div>
        </div>
    );
};

export default Uploadformet;
