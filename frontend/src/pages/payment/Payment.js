import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseUrl } from '../../config';
import { message } from 'antd';

const Payment = () => {

  const headers = {
    'Authorization': `${localStorage.getItem('token')}`
  }

  const [score, setScore] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const handlePayment = async (response) => {
    const razorpay = {
      order_id: response.razorpay_order_id,
      payment_id: response.razorpay_payment_id,
      signature: response.razorpay_signature
    }
    try {
      const data = await axios.post(`${baseUrl}/api/payment/verify`, razorpay , { headers });
      if (data.data.success) {
        message.success("Payment Successful");
        getUserPaymentStatus();
      }
    } catch (error) {
      console.log(error); // eslint-disable-line
      message.error("Payment Failed");
    }
  };

  const handlePaymentFailed = (response) => {
    message.error("Payment Failed");
    console.log(response); // eslint-disable-line
  };

  const handleCreatePayment = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/payment/payment`, { amount: 1000 }, { headers });
      console.log(response.data.response.id);
      const options = {
        key: 'rzp_test_WPJEmCwUG0xFQH',
        amount: 1000,
        currency: "INR",
        name: "Varis Rajak",
        description: `Recharge Wallet Amount 10`,
        image: 'https://picsum.photos/200/300.jpg',
        order_id: response.data.response.id,
        handler: (response) => {
          handlePayment(response);
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", handlePaymentFailed);

      rzp1.open();
    } catch (error) {
      console.log(error); // eslint-disable-line
      message.error("Payment Failed");
    }
  }

  const getUserScore = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/question/score`, {}, { headers });
      if (response.data.success) {
        setScore(response.data.score);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getUserPaymentStatus = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/user`, {}, { headers });
      if (response.data.success) {
        setPaymentStatus(true);
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    getUserScore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex flex-col py-4 justify-center items-center bg-[#fafafa]'>
      <p className='font-semibold text-3xl'>Congratulations You scored 🤫 points</p>
      <p className='font-semibold text-xl mt-3'>Want to know your score ? Make a payment of a small amount to view score.</p>
      <button className='bg-[#24773a] text-white px-4 py-2 rounded-md mt-4' onClick={() => handleCreatePayment()}>Make Payment</button>
      <div className="w-full h-full flex justify-center items-center">
        {paymentStatus ? <p className='font-semibold text-xl mt-3'>Your payment is successful. Your score is {score}.</p> : ''}
      </div>
    </div>
  )
}

export default Payment
