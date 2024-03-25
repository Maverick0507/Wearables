import React, { useEffect, useState } from 'react';
import Layout from '../../../layout/Layout';
import './Profile.css';
import { useAuth } from '../../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Profile = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [answer, setAnswer] = useState('');
    const [orders, setOrders] = useState([]);

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

    const handleLogout = async () => {
        try {
            const res = await axios.get(` /api/v2/auth/logout`);
            setAuth({
                user: null,
                token: ''
            });
            localStorage.removeItem('auth');
            alert('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    // all orders
    const getOrders = async () => {
        try {
            const res = await axios.get(` /api/v2/auth/user/all-orders/${auth.user._id}`);
            if (res) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [auth?.token]);

    return (
        <Layout>
            <div className='profile'>
                <div className='profile-left'>
                    <h1>Orders</h1>
                    {orders?.length > 0 ? (
                        <div className="items">
                            {orders.map((order) => (
                                <div items >
                                    {order.products.map((p, i) => (
                                        <div onClick={() => navigate(`/product/${p.slug}`)} className="item">
                                            <img src={` /api/v2/product/get-photo/${p._id}`}
                                                alt={p.name} />
                                            <div className="item-data">
                                                <p><span className='value'>Price: </span> {p.price}</p>
                                                <p><span className='value'>Quantity: </span> {order.products.length}</p>
                                                <p><span className='value'>Order At: </span> {moment(order.createdAt).fromNow()}</p>
                                                <p>{order.status}</p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No orders</p>
                    )}
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
        </Layout >
    );
};

export default Profile;
