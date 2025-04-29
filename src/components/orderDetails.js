import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import NavBar from './navBar';
import Footer from './footer';
import './orders.css';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersList = querySnapshot.docs.map(doc => doc.data());
      setOrders(ordersList);
    };
    fetchOrders();
  }, [db]);

  return (
    <div>
      <NavBar />
      <div className="orders-container">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order">
              <p>Name: {order.name}</p>
              <p>Address: {order.address}</p>
              <p>Phone: {order.phone}</p>
              <p>Email: {order.email}</p>
              <p>Total Cost: {order.totalCost}</p>
              <p>Payment Method: {order.paymentMethod}</p>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;