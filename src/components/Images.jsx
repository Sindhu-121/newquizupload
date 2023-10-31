import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Imeages = () => {
    const [questions, setQuestions] = useState([]);
    const { subi_id } = useParams();

    useEffect(() => {
        // Make an API call to fetch questions and options for the specified subi_id
        axios.get(`http://localhost:4009/quiz_all/${subi_id}`)
            .then((response) => {
                setQuestions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [subi_id]);

    return (
        <div>
            <h1>Questions and Options</h1>
            {questions.map((question) => (
                <div key={question.question_id}>
                    <img src={`data:image/png;base64, ${question.question_img}`} alt={`Question ${question.question_id}`} />
                    <ul>
                        {question.options.map((option) => (
                            <li key={option.option_id}>
                                <img src={`data:image/png;base64, ${option.option_img}`} alt={`Option ${option.option_id}`} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Imeages;
