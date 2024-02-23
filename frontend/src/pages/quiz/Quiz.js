import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config';
import Question from '../../component/question/Question';
import { message } from 'antd';



const Quiz = () => {

  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: 0,
    selectedOption: ''
  });

  const headers = {
    'Authorization': `${localStorage.getItem('token')}`
  }

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/question/questions`);
      setQuiz(response.data.formattedQuestions);
    } catch (error) {
      console.error(error);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion.selectedOption === '') {
      message.error('Please select an option');
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}/api/question/submit`, {
        question: quiz[currentQuestion.question]._id,
        selectedAnswer: currentQuestion.selectedOption
      }, { headers });
      if (response.data.success) {
        setCurrentQuestion({ ...currentQuestion, question: currentQuestion.question + 1, selectedOption: '' });
        message.success(response.data.message||'Answer Submitted');
        // if the user has answered all the questions
        if (currentQuestion.question === 9) {
          message.success(`You have answered all the questions.`);
        }
      }
    } catch (error) {
      console.error(error);
      message.error('Internal Server Error');
    }
  };

  const selectOption = (option) => {
    setCurrentQuestion({ ...currentQuestion, selectedOption: option.target.value });
  };


  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div className='flex w-full h-screen bg-[#f5f5f5] justify-center items-center'>
      
      {quiz.length > 0 ? <Question question={quiz[currentQuestion.question].question} selectOption={selectOption} options={quiz[currentQuestion.question].options} currentQuestion={currentQuestion} nextQuestion={nextQuestion} /> : 'Data not loaded'}
    </div>
  )
}

export default Quiz
