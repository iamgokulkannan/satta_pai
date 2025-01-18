import React, { useState, useEffect } from 'react';
import NavBar from './navBar';
import Footer from './footer';
import './cart.css';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/images/assets';

const Cart = ({username , setUsername}) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  


  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleImageClick = (productId) => {
    navigate(`/productDetails/${productId}`);
    window.location.reload();
    window.scrollTo(0, 0);
  };


  const addAnItem = () => {
    navigate(`/`);
  };

  const removeFromCart = (productId, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.productId === productId && item.size === size)
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.location.reload();
    window.scrollTo(0, 0);
  };

  const updateQuantity = (productId, size, increment) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.productId === productId && item.size === size) {
          const newQuantity = item.quantity + increment;
          if (newQuantity <= 0) {
            return null; // Remove the item
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean); // Remove null items

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.location.reload();
    window.scrollTo(0, 0);
  };

  // Calculate total cost
  const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  useEffect(() => {
      document.title = "Your Shopping Cart - Satta Pai";
  })

  const checkoutPayment = (totalCost) => {
    navigate('/checkout', { state: { totalCost } });
  };
  return (
    <div>
      <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
      <div className="cart">
        {cartItems.length === 0 ? (
          <div className="empty">
            <p>Oops! Your Cart is empty</p>
            <span>
              Please <span className="add-item" onClick={addAnItem}>add an item</span> to view it.
            </span>
          </div>
        ) : (
          <div>
            <div className="yourCart">
              <p>Your Cart</p>
              <span onClick={() => navigate(`/`)}>Continue Shopping</span>
            </div>
            <ul>

              <li>
                <div className="cartHeader">
                  <p className="cartItem">Product</p>
                  <p className="cartItem">Quantity</p>
                  <p className="cartItem">Price</p>
                </div>
              </li>

              <hr className="separator" />
              {cartItems.map((item, index) => (
                <div key={`${item.productId}-${item.size}`}>
                  <li className="wholeCart">
                    <img
                      src={item.image}
                      alt={item.name}
                      onClick={() => handleImageClick(item.productId)}
                    />
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <div className="quantityCont">
                      <div className="quantityRemoveContainer">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, -1)}
                          disabled={item.quantity === 1}
                          className={`quantity-button minus ${item.quantity === 1 ? 'disabled' : ''}`}
                        >
                          -
                        </button>
                        <p>{item.quantity}</p>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, 1)}
                          className="quantity-button plus"
                        >
                          +
                        </button>
                        <div className="trash">
                          <img
                            src={assets.bin}
                            onClick={() => removeFromCart(item.productId, item.size)}
                            alt="Remove"
                          />
                        </div>
                      </div>
                    </div>
                    <p>Rs. {item.price * item.quantity}</p> {/* Calculate price dynamically */}
                  </li>
                  {index < cartItems.length - 1 && <hr className="separator" />} {/* Add horizontal line */}
                </div>
              ))}
            </ul>

            <hr className="separator" />
            <div className="totalCost">
              <h3>Total Cost Rs. {totalCost}</h3>
            </div>
            <div className="checkout-container">
              <button className="checkout" onClick={()=> checkoutPayment(totalCost)}>Checkout</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;