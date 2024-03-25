import React, { useState, useEffect } from 'react';
import Layout from '../../../layout/Layout';
import "./CreateProduct.css";
import axios from 'axios';
import { Select, notification } from "antd";
const { Option } = Select;

const CreateProduct = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [productData, setProductData] = useState('');
    const [colorInput, setColorInput] = useState([]);
    const [sizeInput, setSizeInput] = useState([]);
    const [photos, setPhotos] = useState(null);
    const [categories, setCategories] = useState([])



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const productFormData = new FormData();
            productFormData.append("name", productName);
            productFormData.append("description", productData);
            productFormData.append("price", price);
            productFormData.append("quantity", quantity);
            productFormData.append("photos", photos);
            productFormData.append("category", category);
            productFormData.append("colors", colorInput); // Convert the color array to a JSON string
            productFormData.append("sizes", sizeInput); // Convert the size array to a JSON string

            const response = await axios.post(
                ` /api/v2/product/create-product`,
                productFormData
            );

            if (response.data.success) {
                notification.success({
                    message: 'Product Created',
                    description: response.data.message,
                });
            } else {
                notification.error({
                    message: 'Product Creation Failed',
                    description: response.data.message,
                });
            }

        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Error',
                description: 'An error occurred while creating the product.',
            });
        }
    };

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

    return (
        <Layout>
            <div className="Create-Product">
                <h2>Create a New Product</h2>
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
                        onChange={(e) => setSizeInput(e.target.value.split(',').map(s => s.trim()))}
                    />
                    <input required className='img-input' type="file" accept="image/*" onChange={(e) => setPhotos(e.target.files[0])} />

                    <button className="submit">Create Product</button>
                </form>
            </div>
        </Layout>
    );
};

export default CreateProduct;
