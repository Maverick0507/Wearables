import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import '../user/profile/Profile.css';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'
const AdminDashbaord = () => {

    const navigate = useNavigate()

    const [auth, setAuth] = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [answer, setAnswer] = useState('');

    // get user data
    useEffect(() => {
        if (auth.user) {
            // Populate the form fields with user data from the context
            setName(auth.user.name);
            setEmail(auth.user.email);
            setAddress(auth.user.address);
            setPhone(auth.user.phone);
            setAnswer(auth.user.answer);
        }
    }, [auth.user]);





    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUserData = {
                ...auth.user,
                name,
                email,
                password,
                address,
                phone,
                answer
            };

            const res = await axios.put(` /api/v2/auth/update-profile`, updatedUserData);

            if (res?.data?.success) {
                alert(res?.data?.message);
                // Update the auth context with the updated user data
                setAuth({ ...auth, user: updatedUserData });
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };


    const handleLogout = () => {
        try {
            const res = axios.get(` /api/v2/auth/logout`)
            setAuth({
                user: null,
                token: ''
            })
            localStorage.removeItem('auth');
            alert('Log out succesfullyy')
            navigate('/')

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Layout>
            <div className="admin">
                <div className='profile'>
                    <div className='profile-left'>
                        <h1>Dashboard</h1>

                        <div className="admin-dashboard">
                            <button onClick={() => navigate('/create-category')}>Create Category</button>

                            <button onClick={() => navigate('/create-product')}>Create Product</button>
                            <button onClick={() => navigate('/admin/products')}> Product</button>
                            <button onClick={() => navigate('/admin/allOrders')}> All Orders</button>


                        </div>

                    </div>
                    <div className='profile-right'>
                        <h1>User Profile</h1>

                        <div className='profile-form-div' >
                            <form className='profile-form' onSubmit={handleSubmit}>
                                <input required type='text' placeholder='username' value={name} onChange={(e) => setName(e.target.value)} />
                                <input disabled type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                <input required type='text' placeholder='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                                <input required type='text' placeholder='address' value={address} onChange={(e) => setAddress(e.target.value)} />
                                <input required type='text' placeholder='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} />
                                <button className='form-btn' type='submit'>
                                    Update Profile
                                </button>
                            </form>
                        </div>
                        <button onClick={handleLogout} className='LogOut-btn' type='submit'>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminDashbaord
