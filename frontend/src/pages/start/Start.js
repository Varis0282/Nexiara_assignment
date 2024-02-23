import React, { useEffect, useState } from 'react'
import { Card, message, Button } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../config';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Start = () => {
    const [user, setUser] = useState({
        userId: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const inputChangeHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSumbit = async () => {
        if (user.userId === '' || user.password === '') {
            message.error('Please fill all the fields');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/api/auth/login`, user);
            if (response.data.success) {
                message.success(response.data.message);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/quiz');
            }
        } catch (error) {
            console.log("🚀 ~ file: Start.js:29 ~ handleSumbit ~ error:", error);
            if (error.response.data.error === 'Invalid User') {
                navigate(`/signup?userId=${user.userId}`);
                setLoading(false);
                return message.error('User not found, Please signup');
            }
            message.error('Something went wrong');
        }
        setLoading(false);
    }

    const enterPressed = (e) => {
        if (e.key === 'Enter') {
            handleSumbit();
        }
    }

    useEffect(() => {
        if (searchParams.get('userId')) {
            setUser({ ...user, userId: searchParams.get('userId') })
        }
    }, [searchParams]);  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='flex items-center justify-center w-full bg-[#f5f5f5] h-screen'>
            <Card className='w-96 shadow-lg'>
                <Card.Meta title='Start the quiz' style={{ fontSize: '20px' }} className='text-center w-full' />
                <div className="flex w-full flex-col mt-4">
                    <input type="text" value={user.userId} placeholder="User Id" name='userId' className="w-full p-2 my-2 border-2 border-gray-300 rounded-md" onChange={inputChangeHandler} onKeyUp={enterPressed} />
                    <input type="password" value={user.password} placeholder="Password" name='password' className="w-full p-2 my-2 border-2 border-gray-300 rounded-md" onChange={inputChangeHandler} onKeyUp={enterPressed} />
                    <Button loading={loading} className="w-full font-semibold mt-4 h-8 rounded-md" onClick={() => handleSumbit()}>Start</Button>
                </div>
            </Card>
        </div>
    )
}

export default Start
