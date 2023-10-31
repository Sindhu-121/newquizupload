import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Images = () => {
    const [question, setQuestion] = useState([]);

    useEffect(() => {
        // Make an API call to fetch base64 encoded image strings from the server
        axios.get('http://localhost:4009/questions')
            .then((response) => {
                setQuestion(response.data);
            })
            .catch((error) => {
                console.error('Error fetching image data:', error);
            });
    }, []);

    return (
        <div>
            <h1>Images</h1>
            <div className="image-container">
                {question.map((imageData, index) => (
                    <img key={index} src={`data:image/png;base64, ${imageData.questions}`} alt={`question ${index}`} />
                ))}
            </div>
        </div>
    );
};

export default Images;