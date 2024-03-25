import React, { useEffect, useState } from 'react';
import Layout from '../../../layout/Layout';
import './CreateCategory.css';
import axios from 'axios';
import { Modal, notification } from 'antd'
import CategoryForm from '../../../components/categoryForm/CategoryForm';


const CreateCategory = () => {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(` /api/v2/category/create-category`, {
                name,
            });

            if (res?.data?.success) {
                alert(res.data?.message);
            } else {
                alert(res.data?.message);
            }
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    // get all category
    const getAllCategory = async () => {
        try {
            const res = await axios.get(` /api/v2/category/get-category`);
            if (res?.data?.success) {
                setCategories([...res?.data?.category]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllCategory();
    }, []);


    // delete category
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(` /api/v2/category/delete-category/${id}`)
            if (res.data.success) {
                notification.warning("Deletion complete")
                getAllCategory()
            }
            else {
                alert(res.data.message)

            }
        } catch (error) {
            notification.error("Something went wrong while updating name")
        }
    }


    // update category
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put(` /api/v2/category/update-category/${selected._id}`, { name: updatedName })
            if (res.data.success) {
                alert(res.data.message)
                setSelected(null)
                setUpdatedName("")
                setVisible(false)
                getAllCategory()
            }
            else {
                alert(res.data.message)

            }
        } catch (error) {
            alert("Something went wrong while updating name")
        }
    }

    return (
        <Layout>
            <div className="category">
                <CategoryForm
                    handleSubmit={handleSubmit}
                    value={name}
                    setValue={setName}
                />
                <div className="Table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c._id}>
                                    <td className='T-data'>{c?.name}</td>
                                    <td className='T-btns'>
                                        <button
                                            onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c) }}

                                            className='T-btn-1'>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c._id)} // Pass it as a callback
                                            className='T-btn-2'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
                    <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                </Modal>
            </div>
        </Layout>
    );
}

export default CreateCategory;
