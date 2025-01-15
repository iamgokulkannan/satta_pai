import React, { useState, useEffect } from 'react';
import NavBar from './navBar';
import Footer from './footer';
import './cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const removeFromCart = (itemId, itemSize) => {
    const updatedCartItems = cartItems.filter(
      (item) => !(item.productId === itemId && item.size === itemSize)
    );
    setCartItems(updatedCartItems); // Update the state
    localStorage.setItem('cart', JSON.stringify(updatedCartItems)); // Update localStorage
    window.location.reload();
    window.scrollTo(0, 0);
  };
  const handleImageClick = (productId) => {
    navigate(`/productDetails/${productId}`);
    window.scrollTo(0, 0);
  };
  const addAnItem = () => {
    navigate(`/`);
  };

  return (
    <div>
      <NavBar disableScrollEffect={true} />
        <div className="cart">

        {cartItems.length === 0 ? (
          <div className="empty">
            <p>Oops ! Your Cart is empty</p>
            <span>Please <text onClick={addAnItem}>add an item</text> to cart to view it</span>
            
          </div>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.productId}>
              <img src={item.image} alt={item.name} onClick={()=> handleImageClick(item.productId)}/>
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rs.{item.price}</p>
              </div>
              <button onClick={() => removeFromCart(item.productId, item.size)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  <Footer/>
</div>
  );
};

export default Cart;