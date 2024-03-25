import React, { useState } from 'react';
import Layout from '../../layout/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(` /api/v2/auth/forgot-password`, {
        email,
        newPassword,
        answer,
      });

      if (res?.data?.success) {
        alert(res?.data?.message);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };

  return (
    <Layout>
      <div className="register">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Email "
            required
          />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your favorite Sport Name "
            required
          />
         <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  required
                />
          <button className="form-btn" type="submit">
            Reset
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
