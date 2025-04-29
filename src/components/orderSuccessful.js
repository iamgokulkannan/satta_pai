import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavBar from './navBar';
import Footer from './footer';
import './orderSuccessful.css';

const OrderSuccessful = ({ username, setUsername }) => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [products] = useState([]); // State to store fetched products

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) {
        alert('You must be logged in to view your orders.');
        navigate('/login');
        return;
      }
    
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
    
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const latestOrder = querySnapshot.docs[0].data();
          setOrderDetails(latestOrder);
        } else {
          console.error('No orders found for this user');
          navigate('/');
        }
      } catch (error) {
        if (error.code === 'failed-precondition') {
          console.error(
            'The required index is not ready yet. Please wait until it is built in the Firebase Console.'
          );
          alert(
            'The required index is still building. Please try again later. Visit the Firebase Console for more information.'
          );
        } else {
          console.error('Error fetching order details:', error);
        }
        navigate('/');
      }
    };

    fetchOrderDetails();
  }, [navigate]);

  return (
    <div>
      <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
      <div className="order-confirmation">
        <h1>Order Confirmation</h1>
        {orderDetails ? (
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
            <p><strong>Total Cost:</strong> ₹{orderDetails.total}</p>
            <p><strong>Address:</strong> {orderDetails.address}</p>

            <h3>Products:</h3>
            {products.length > 0 ? (
              <ul>
                {products.map(product => (
                  <li key={product.id}>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ₹{product.price}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading products...</p>
            )}
          </div>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessful;