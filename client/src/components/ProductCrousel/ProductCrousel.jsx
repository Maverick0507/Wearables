import React, { useEffect, useState } from 'react';
import './ProductCrousel.css';
import axios from 'axios';
import ProductCard from '../product-layout/ProductCard';
import { Link } from 'react-router-dom';
import { FcNext, FcPrevious } from 'react-icons/fc'

const ProductCrousel = () => {
    const [products, setProducts] = useState([]);
    const [index, setIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(6);
    const [length, setLength] = useState(0);
    const [maxItems, setMaxItems] = useState(6);  // Initial number of items to display

    const handleResize = () => {
        // Adjust the number of items to display based on screen width
        if (window.innerWidth <= 576) {
            setMaxItems(3);  // Change this number based on your requirements
        } else {
            setMaxItems(6);  // Change this number based on your requirements
        }
    };
    

    const allProducts = async () => {
        try {
            const res = await axios.get(`/api/v2/product/get-product/limited`);
            if (res?.data) {
                setProducts(res?.data?.product);
                setLength(res?.data?.total);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        allProducts();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const previous = () => {
        if (index !== 0) {
            setIndex(index - maxItems);
            setNextIndex(nextIndex - maxItems);
        }
    };

    const next = () => {
        if (index < length - maxItems) {
            setIndex(nextIndex);
            setNextIndex(nextIndex + maxItems);
        }
    };

    return (
        <div className='craousel-component'>
            <h1>Fall in comfort</h1>
            <p>Our top picks for a consciously cozy season.</p>
            <div className='crousel-product-card'>
                {products.slice(index, nextIndex).map((p) => (
                    <Link className='link' to={`/product/${p.slug}`} key={p._id}>
                        <ProductCard
                            name={p.name}
                            price={p.price}
                            description={p.description}
                            color={p.colors}
                            isAdmin={false}
                            id={p._id}
                        />
                    </Link>
                ))}
            </div>
            <div className='crousel-btn'>
                <button onClick={previous}><FcPrevious /></button>
                <button onClick={next}><FcNext /></button>
            </div>
        </div>
    );
};

export default ProductCrousel;
