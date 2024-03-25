import React from 'react';

const CategoryForm = ({ handleSubmit, value, setValue }) => {
    return (
        <div>
            <form onSubmit={handleSubmit} className='Category-form'>
                <input
                    type="text"
                    placeholder='Enter new Category'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CategoryForm;
