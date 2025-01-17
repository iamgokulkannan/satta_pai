import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './order.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [db, user]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="no-orders">No orders found.</p>;
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className="order-item">
            <h2>Order ID: {order.id}</h2>
            <p>Date: {new Date(order.date.seconds * 1000).toLocaleDateString()}</p>
            <p>Total: ${order.total}</p>
            <div className="order-items">
              <h3>Items:</h3>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;