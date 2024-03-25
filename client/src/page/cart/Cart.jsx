

import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import './Cart.css';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import DropIn from 'braintree-web-drop-in-react';
import axios from 'axios';

const Cart = () => {
    const [auth, setAuth] = useAuth();
    const id = auth?.user?._id;
    const [cart, setCart] = useCart();

    const [clientToken, setClientToken] = useState('');
    const [instance, setInstance] = useState('');
    const [loading, setLoading] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });

    const navigate = useNavigate();

    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total += item.price;
            });
            return total.toLocaleString('en-us', {
                style: 'currency',
                currency: 'USD',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const consolidatedCart = cart.reduce((acc, item) => {
        const existingItem = acc.find(
            (existing) => existing.product._id === item._id
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            acc.push({ product: item, quantity: 1 });
        }

        return acc;
    }, []);

    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };

    // get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(
                ` /api/v2/product/braintree/token`
            );
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    // handle payment
    const handlePayment = async () => {
        try {
            const { nonce } = await instance.requestPaymentMethod();

            const { data } = await axios.post(
                ` /api/v2/product/braintree/payment`,
                {
                    nonce,
                    cart,
                    id,
                    shippingAddress, // Include the shipping address in the request
                }
            );

            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/');
            notification.success({
                message: 'Payment Complete',
                description: 'Your payment has been successfully completed.',
            });
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="Cart">
                <div className="product-details">
                    {auth?.user ? (
                        <h1>
                            hey, {auth?.user?.name} you have {cart.length} items in your cart
                        </h1>
                    ) : (
                        <h1>Please, login</h1>
                    )}

                    <div className="cart-info">
                        <div className="product">
                            {consolidatedCart.map((item) => (
                                <div key={item.product._id} className="cart-item">
                                    <div className="product-image">
                                        <img src={` /api/v2/product/get-photo/${item.product._id}`} alt="" />
                                    </div>
                                    <div className="product-info">
                                        <h1>{item.product.name}</h1>
                                        <p> <span className='data'>Quantity:</span> {item.quantity}</p>
                                        <p> <span className='data'>Price:</span> {item.product.price}</p>
                                        <p> <span className='data'>Price:</span> {item.product.selectedSize}</p>
                                        <p> <span className='data'>Color:</span> {item.product.selectedColor}</p>

                                        <div className='remove-btn'>
                                            <button onClick={() => removeCartItem(item.product._id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="payment-details">
                            <h2>Total Price: {totalPrice()}</h2>

                            {/* Shipping Address Input Fields */}
                            <div className="shipping-address">
                                <h2>Shipping Address</h2>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={auth?.user?.address ? auth.user.address : shippingAddress.fullName}
                                    onChange={(e) =>
                                        setShippingAddress({
                                            ...shippingAddress,
                                            fullName: e.target.value,
                                        })
                                    }
                                />
                                if want delivery on different address then please change address in profile section
                            </div>
                            {/* End of Shipping Address Input Fields */}

                            {!clientToken || !cart?.length ? (
                                ''
                            ) : (
                                <>
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: {
                                                flow: 'vault',
                                            },
                                        }}
                                        onInstance={(instance) => setInstance(instance)}
                                    />
                                </>
                            )}
                            {auth?.user ? (
                                <button
                                    className="payment-btn"
                                    onClick={handlePayment}
                                >
                                    {loading ? 'Processing...' : 'Make Payment'}
                                </button>
                            ) : (
                                <button className="payment-btn" onClick={() => navigate('/login')}>
                                    Please Login for payment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;

