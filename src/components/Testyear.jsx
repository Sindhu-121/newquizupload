import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import Quizpage form './components/Quizpage'
import axios from 'axios';
const Testyear = () => {
 
    const [testData, setTestData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:4009/test_paper')
          .then(response => {
            setTestData(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
 
 
  return (
    <div>
      <ul>
        {testData.map(item => (
          <li key={item.test_year_id}>
            <Link to={'/quiz_all/:subi_id'}>
            <strong>Test:</strong> {item.year}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
 
export default Testyear;