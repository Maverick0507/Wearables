import React from 'react'
import './Hero2.css'
import { useNavigate } from 'react-router-dom'

const Hero2 = () => {
    const navigate = useNavigate()
    return (

        <div className='Hero2'>
            <div className="hero2-left">
                <img src="https://images.pexels.com/photos/3252792/pexels-photo-3252792.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                <div className="hero2-left-data">
                    <h1>Best Sellers</h1>
                    <button onClick={() => navigate(`/products/64e1df81ac2050d8452bebb2`)}  >Shop now</button>
                </div>
            </div>
            <div className="hero2-right">
                <img src="https://images.pexels.com/photos/5869022/pexels-photo-5869022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                <div className="hero2-right-data">
                    <h1>New Arivals</h1>
                    <button onClick={() => navigate(`/products/64e088550587c08398ddfd44`)}  >Shop now</button>
                </div>
            </div>
        </div>

    )
}

export default Hero2
