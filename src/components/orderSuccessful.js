import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './navBar';
import Footer from './footer';
import './orderSuccessful.css';

const OrderSuccessful = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const order = JSON.parse(localStorage.getItem('orderDetails'));
    if (!order) {
      navigate('/'); // Redirect to home if there's no order
    } else {
      setOrderDetails(order);
    }
  }, [navigate]);

  return (
    <div>
      <NavBar />
      <div className="order-confirmation">
        <h1>Order Confirmation</h1>
        {orderDetails ? (
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {orderDetails.cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-details">
                    <p>{item.name}</p>
                    <p>Size: {item.size}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs. {item.price}.00</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h3>Total: Rs. {orderDetails.totalCost}.00</h3>
            </div>

            <div className="user-details">
              <h3>Shipping Information</h3>
              <p>Name: {orderDetails.userDetails.name}</p>
              <p>Address: {orderDetails.userDetails.address}</p>
              <p>Phone: {orderDetails.userDetails.phone}</p>
              <p>Email: {orderDetails.userDetails.email}</p>
            </div>

            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessful;