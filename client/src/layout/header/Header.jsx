import React, { useEffect, useState } from 'react';
import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink from react-router-dom
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { Badge, notification } from 'antd';
import { useCart } from '../../context/cart';


const Header = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart] = useCart();
  const [value, setValue] = useState({ keyword: '' }); // Initialize value as an object with a 'keyword' property

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const curState = auth?.user?.role === 1 ? 'Admin' : auth?.user ? 'Profile' : 'Login';

  const redirect = () => {
    if (auth?.user) {
      if (auth.user.role === 1) {
        navigate('/admin-dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/login');
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v2/category/get-category`); // Removed the extra space before '/api'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate(`/products/search/${value.keyword}`); // Use value.keyword for the search term
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid navitems">
        <NavLink className="navbar-brand" to="/">wearAble</NavLink> {/* Use NavLink with 'to' instead of 'href' */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={handleMobileMenuToggle}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse  ${mobileMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 li-items">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact activeClassName="active">Home</NavLink> {/* Use NavLink with 'to' instead of 'href' */}
            </li>

            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Category
              </NavLink>
              <ul className="dropdown-menu">
                {categories.map((option, index) => (
                  <li className="dropdown-item" key={index}>
                    <NavLink className="link" to={`/products/${option._id}`}>
                      {option.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>



            <li onClick={redirect} className="nav-item">
              <NavLink className="nav-link active" to="/">{curState}</NavLink> {/* Use NavLink with 'to' instead of 'href' */}
            </li>
            <li onClick={()=>{navigate('/cart')}} className="nav-item">
              <NavLink className="nav-link active" to="/">
                <Badge count={cart.length} showZero>
                  cart
                </Badge>
              </NavLink>
            </li>
          </ul>
          <form className="d-flex" onSubmit={handleSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={value.keyword} onChange={(e) => setValue({ ...value, keyword: e.target.value })} />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
