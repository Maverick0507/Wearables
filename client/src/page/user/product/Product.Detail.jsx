import React, { useEffect, useState } from 'react';
import Layout from '../../../layout/Layout';
import './ProductDetail.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../context/cart';
import { notification } from 'antd';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useCart();

  const fetchProduct = async () => {
    try {
      const res = await axios.get(` /api/v2/product/single-product/${slug}`);
      if (res?.data) {
        setProduct(res.data.product);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const addToCart = () => {
    if (product && product.selectedSize && product.selectedColor) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      notification.success({
        message: 'Item Added',
        description: 'The item has been added to your cart.',
      });
    } else {
      notification.error({
        message: 'Error',
        description: 'Please select size and color before adding to cart.',
      });
    }
  };

  const handleSizeSelection = (selectedSize) => {
    setProduct({ ...product, selectedSize });
  };

  const handleColorSelection = (selectedColor) => {
    setProduct({ ...product, selectedColor });
  };

  return (
    <Layout>
      <div className="Prod-Detail">
        {loading ? <p>Loading...</p> : (
          <div className='prod-container'>
            <div className="prod-img">
              <img src={` /api/v2/product/get-photo/${product._id}`}
                alt={product.name} />
            </div>
            <div className="prod-data">
              <h1>{product.name}</h1>
              <p>Rs. {product.price}</p>
              <div className="color-container">
                {product.colors.map((c, index) => (
                  <button
                  className={`color-btn ${product.selectedColor === c ? 'Cselected' : ''}`}
                  style={{ background: c }}
                    key={index}
                    onClick={() => handleColorSelection(c)}
                  ></button>
                ))}
              </div>
              <div className="size-container">
                {product.sizes.map((s, index) => (
                  <button
                    className={`size-btn ${product.selectedSize === s ? 'selected' : ''}`}
                    key={index}
                    onClick={() => handleSizeSelection(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p>Description: <span className='prod-description'>{product.description}</span></p>
              <div className='prod-details-btn'>
                <button className='btn-1' onClick={addToCart}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
