import React, { useEffect, useState } from 'react';
import Layout from '../../../layout/Layout';
import './Product.css';
import ProductLayout from '../../../components/product-layout/ProductCard';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../../assets/Spinner';

const Product = ({ isAdmin, byCategory, bySearch }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id, keyword } = useParams();

  const fetchProducts = async () => {
    try {
      let res;
      if (byCategory) {
        res = await axios.get(` /api/v2/product/category-products/${id}`);
      } else if (bySearch) {
        res = await axios.get(` /api/v2/product/search/${keyword}`);
      } else {
        res = await axios.get(` /api/v2/product/get-product`);
      }

      if (res.data && res.data.product) {
        setProducts(res.data.product);
      } else {
        console.log('No products found.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [byCategory, bySearch, id, keyword]); // Include all relevant dependencies

  return (
    <Layout>
      <div className='product-container'>
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className='no-prod'>
            <h1>No products available</h1>
            <p>Come back later</p>
          </div>
        ) : (
          <div className='products'>
            {products.map((p) => (
              <Link className='link' key={p._id} to={isAdmin ? `/admin/product/${p.slug}` : `/product/${p.slug}`}>
                <ProductLayout
                  key={p._id}
                  name={p.name}
                  price={p.price}
                  description={p.description}
                  color={p.colors}
                  size={p.sizes}
                  isAdmin={isAdmin}
                  id={p._id}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Product;
