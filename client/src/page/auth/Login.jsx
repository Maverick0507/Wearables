import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import axios from 'axios'
import './Register.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(` /api/v2/auth/login`, { email, password })
            if (res?.data?.success) {
                alert(res?.data?.message)
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem("auth", JSON.stringify(res.data))
                if(res?.data?.user?.role === 1)
                {
                    navigate('/admin-dashboard')
                }
                else
                {
                    navigate('/')
                }
            }
            else
            {
                alert("Please use valid details")
 
            }
        } catch (error) {
            console.log(error)
            alert("Something went wrong")
        }
    }
    return (
        <Layout>
            <div className="register">
                <form onSubmit={handleSubmit}>
                    <input required type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input required type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className='form-btn'>Login</button>
                </form>
                <div className='forget-password'>
                    <button onClick={()=>navigate('/forget-password')} className='forget-password-btn'>Forget password</button>
                </div>
                <div className='sign-up'>
                    <p>Don't have a account ?</p>
                    <button onClick={() => navigate('/register')} className='form-btn-2'>Register</button>
                </div>
            </div>
        </Layout>
    )
}

export default Login
