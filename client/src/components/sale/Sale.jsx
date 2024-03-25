import React from 'react'
import './Sale.css'
import { useNavigate } from 'react-router-dom'
const Sale = () => {
    const navigate = useNavigate()
    return (
        <div className='Sale'>
            <img className='sale-img' src="https://images.pexels.com/photos/7679656/pexels-photo-7679656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
            <div className="sale-btn">
                <button onClick={()=>navigate(`/products/64e0885e0587c08398ddfd4c`)}>Sale</button>
            </div>
        </div>
    )
}

export default Sale
