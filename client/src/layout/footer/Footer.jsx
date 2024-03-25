import React from 'react'
import './Footer.css'
import { FaLinkedin, FaTwitterSquare, FaFacebook, FaInstagramSquare } from 'react-icons/fa'
const Footer = () => {
  return (
    <div className='Footer'>

      <div className="f1">
        <h1>wearAble</h1>
      </div>

      <div className="f2">
        <p>Info</p>
        <ul>
          <li>Shop All</li>
          <li>About</li>
          <li>Contact</li>
          <li>Journal</li>
        </ul>
      </div>

      <div className="f3">
        <div className="f-data">
          <h1>Thank you</h1>
          <p>
            This is a wearAble store. Thank you to United by Blue for allowing us to use their stunning images. Head over to their site to purchase their products for real!
          </p>
        </div>
        <div className="f-social">
          <p> <FaLinkedin /></p>
          <p><FaTwitterSquare /></p>
          <p> <FaFacebook /></p>
          <p>  <FaInstagramSquare /></p>
        </div>
      </div>

      <div className="f4">
        <h1>Sign up and save</h1>
        <p>Subscribe to get notified about product launches, special offers and company newsspan</p>
        <input className='f4-email' type="email" placeholder='enter the email' />
        <button className='f4-btn'>Submit</button>
      </div>
    </div>
  )
}

export default Footer
