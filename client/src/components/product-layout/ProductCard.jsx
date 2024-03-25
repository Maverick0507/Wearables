import React from 'react';
import './ProductCard.css';
import { MdCancel } from 'react-icons/md'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ProductLayout = ({ name, price, size, color, id, isAdmin }) => {

    const navigate = useNavigate()

    const deleteProduct = async (pid) => {
        try {
            const res = await axios.delete(` /api/v2/product/delete-product/${pid}`)
            if (res?.data?.success) {
                alert(res.data.message)
                navigate('/admin/products')
            }


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
           
                <div
                    className="product-card "
                    key={id}
                >
                    <div className="product-img">
                        <img
                            src={` /api/v2/product/get-photo/${id}`}
                            className="card-img"
                            alt={name}
                        />
                    </div>
                    <div className="p-data">
                        <p>{name}</p>
                        <p>Price: {price}</p>

                        <div className="color-container">
                            {color.map((c, index) => (
                                <button className='color-btn' style={{ background: `${c}` }} key={index}></button>
                            ))}
                        </div>
                    </div>

                    {isAdmin ? (
                        <div>
                            <button onClick={() => deleteProduct(id)} className='delete-btn'>
                                <MdCancel className='del-icon' />
                            </button>
                        </div>

                    ) : (null)}
                    {!isAdmin ? (
                        <>
                            <div className="p-cart-btn">
                                <button className="quickAdd">quick add</button>
                            </div>
                        </>
                    ) : null}
                </div>
          
        </>
    );
};

export default ProductLayout;
