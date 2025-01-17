import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useLocation for state
import NavBar from './navBar';
import Footer from './footer';
import { assets } from '../assets/images/assets';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firestore imports
import { getAuth } from 'firebase/auth'; // For authenticated user's ID
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object to get state
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cod',
  });

  // Get totalCost and items from location state
  const totalCost = location.state?.totalCost || 0; // Fallback to 0 if no state is passed
  const items = location.state?.items || []; // Fallback to an empty array if no items are passed

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

  const saveOrderToFirestore = async (paymentDetails) => {
    if (!user) {
      alert('You need to be logged in to place an order.');
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        date: new Date(),
        total: totalCost,
        items: items,
        address: formData.address,
        paymentDetails: paymentDetails || null,
        paymentMethod: formData.paymentMethod,
      };

      await addDoc(collection(db, 'orders'), orderData);
      alert('Order placed successfully!');
      navigate('/orderSuccessful');
    } catch (error) {
      console.error('Error saving order:', error.message);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === 'cod') {
      // Save the order for Cash on Delivery
      saveOrderToFirestore();
    } else {
      // Razorpay Online Payment
      const options = {
        key: 'rzp_test_NaBWqfY1b83Kid',
        amount: totalCost * 100, // Razorpay requires the amount in paise (cents)
        currency: 'INR',
        name: 'Satta Pai',
        description: 'Payment Transaction',
        image: assets.logo,
        handler: function (response) {
          // Save the order after successful payment
          saveOrderToFirestore(response);
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
    }
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