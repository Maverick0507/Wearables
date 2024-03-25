import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import axios from 'axios'
import './Register.css'
import { useNavigate } from 'react-router-dom'
const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(` /api/v2/auth/register`, { name, email, password, address, answer, phone })
           if(res?.data?.success)
           {
            alert(res?.data?.message)
            navigate('/login')
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
                    <input required type="text" placeholder='username' value={name} onChange={(e)=>setName(e.target.value)} />
                    <input required type="email" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                    <input required type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <input required type="text" placeholder='phone' value={phone} onChange={(e)=>setPhone(e.target.value)} />
                    <input required type="text" placeholder='address' value={address} onChange={(e)=>setAddress(e.target.value)} />
                    <input required type="text" placeholder='answer' value={answer} onChange={(e)=>setAnswer(e.target.value)}/>
                    <button className='form-btn'>Register</button>
                </form>
            </div>
        </Layout>
    )
}

export default Register
