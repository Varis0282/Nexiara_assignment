import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Start, Signup, Quiz, Payment } from './pages'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Start />} />
        <Route path="/start" element={<Start />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
