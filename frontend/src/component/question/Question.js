import React from 'react'
import { Card, Radio, Button } from 'antd';
const Question = ({ question, options, nextQuestion, selectOption, currentQuestion }) => {
  return (
    <div className="flex flex-col gap-4">
      <Card title={question} style={{ width: 500 }} className='shadow-lg bg-[#d1d1d1]'>
        <div className="flex flex-col">
          <Radio.Group onChange={selectOption} value={currentQuestion.selectedOption} optionType='default' className='flex flex-col gap-4'>
            {options.map((option, index) => (
              <Radio value={option.option} key={index}>{option.option}</Radio>
            ))}
          </Radio.Group>
        </div>
      </Card>
      <div className="flex justify-end h-12">
        <Button onClick={() => nextQuestion()}>Sumbit</Button>
      </div>
    </div>
  )
}

export default Question
