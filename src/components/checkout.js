import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Use useLocation for state
import NavBar from './navBar';
import Footer from './footer';
import { assets } from '../assets/images/assets';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Access the location object to get state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cod',
  });

  // Get totalCost from location state
  const totalCost = location.state?.totalCost || 0;  // Fallback to 0 if no state is passed

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      key: 'rzp_test_NaBWqfY1b83Kid',
      amount: totalCost * 100, // Razorpay requires the amount in paise (cents)
      currency: 'INR',
      name: 'Satta Pai',
      description: 'Payment Transaction',
      image: assets.logo,
      handler: function (response) {
        navigate('/orderSuccessful');
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div>
      <NavBar disableScrollEffect={true} />
      <div className="checkout-container">
        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
          <button type="submit" className="checkout-button">Proceed to Payment</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;