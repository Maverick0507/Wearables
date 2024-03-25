import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import Layout from '../../../layout/Layout';
import './SingleProduct.css';
import axios from 'axios';
import { Select, notification } from "antd";
const { Option } = Select;

const SingleProduct = () => {


    const [productName, setProductName] = useState('');
    const [productId, setProductId] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [productData, setProductData] = useState('');
    const [colorInput, setColorInput] = useState([]);
    const [sizeInput, setSizeInput] = useState([]);

    const [photos, setPhotos] = useState(null);
    const [categories, setCategories] = useState([])


    const { slug } = useParams(); // Extract the slug from route params


    // single product
    const fetchSingleProduct = async () => {
        try {
            const res = await axios.get(` /api/v2/product/single-product/${slug}`);
            setProductName(res.data.product.name)
            setPrice(res.data.product.price)
            setQuantity(res.data.product.quantity)
            setProductData(res.data.product.description)
            setColorInput(res.data.product.colors)
            setSizeInput(res.data.product.sizes)
            setCategory(res.data.product.category)
            setProductId(res.data.product._id)

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        // Fetch single product when component mounts
        fetchSingleProduct();
    }, []);



    // all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(` /api/v2/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Error',
                description: 'An error occurred while getting categories.',
            });
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);


    // update function
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {


            const productFormData = new FormData();
            productFormData.append("name", productName);
            productFormData.append("description", productData);
            productFormData.append("price", price);
            productFormData.append("quantity", quantity);
            productFormData.append("category", productId);
            photos && productFormData.append("photos", photos);
            productFormData.append("colors", colorInput); // Convert the colors array to a JSON string
            const response = await axios.put(
                ` /api/v2/product/update-product/${productId}`,
                productFormData
            );

            if (response.data.success) {
                notification.success({
                    message: 'Product Updated',
                    description: response.data.message,
                });
            } else {
                notification.error({
                    message: 'Product Updation Failed',
                    description: response.data.message,
                });
            }

        } catch (error) {
            console.error(error);
            notification.error({
                message: 'm',
                description: 'An error occurred while updating the product.',
            });
        }
    };









    return (
        <Layout>
            <div className="Create-Product">
                <h2>Update a  Product</h2>
                <form className='p-form' onSubmit={handleSubmit}>
                    <input required type="text" placeholder='Product name' value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <Select
                        bordered={false}
                        placeholder="Select a category"
                        size="large"
                        showSearch
                        className="form-select mb-3"
                        onChange={(value) => {
                            setCategory(value);
                        }}
                    >
                        {categories?.map((c) => (
                            <Option key={c._id} value={c._id}>
                                {c.name}
                            </Option>
                        ))}
                    </Select>
                    <input required type="text" placeholder='Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input required type="text" placeholder='Product Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                    <input type='text' value={productData} placeholder='Product Description' onChange={(e) => setProductData(e.target.value)} />
                    <input
                        type="text"
                        placeholder="Colors (comma-separated)"
                        value={colorInput.join(',')}
                        onChange={(e) => setColorInput(e.target.value.split(',').map(color => color.trim()))}
                    />
                     <input
                        type="text"
                        placeholder="Size (comma-separated)"
                        value={sizeInput.join(',')}
                        onChange={(e) => setSizeInput(e.target.value.split(',').map(color => color.trim()))}
                    />

                    <div className="mb-3">
                        {photos ? (
                            <div >
                                <img
                                    src={URL.createObjectURL(photos)}
                                    alt="product_photo"
                                    className="p-img"
                                />
                            </div>
                        ) :
                            (
                                <div >
                                    <img
                                        src={` /api/v2/product/get-photo/${productId}`}
                                        alt="product_photo"
                                        className="p-img"
                                    />
                                </div>
                            )}
                    </div>

                    <button className="submit">Update Product</button>
                </form>
            </div>
        </Layout>
    );
};

export default SingleProduct;
