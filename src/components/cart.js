import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import NavBar from './navBar';
import Footer from './footer';
import { assets } from '../assets/images/assets';
import './cart.css';

const Cart = ({ username, setUsername }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const MAX_QUANTITY = 10;

  const mergeCarts = (firebaseCart, localCart) => {
    const mergedCart = [...localCart];
    
    firebaseCart.forEach(fbItem => {
      const existingItem = mergedCart.find(item => item.id === fbItem.id);
      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + fbItem.quantity, MAX_QUANTITY);
      } else {
        mergedCart.push(fbItem);
      }
    });
    
    return mergedCart;
  };

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUsername(currentUser.displayName || currentUser.email.split('@')[0]);
        
        try {
          const userCartRef = doc(db, 'carts', currentUser.uid);
          const userCartDoc = await getDoc(userCartRef);
          
          if (userCartDoc.exists()) {
            const firebaseCart = userCartDoc.data().items || [];
            const mergedCart = mergeCarts(firebaseCart, storedCartItems);
            
            await setDoc(userCartRef, { items: mergedCart }, { merge: true });
            localStorage.setItem('cart', JSON.stringify(mergedCart));
            setCartItems(mergedCart);
          } else {
            await setDoc(userCartRef, { items: storedCartItems });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
          setError('Failed to sync cart with server');
        }
      } else {
        localStorage.setItem('cart', JSON.stringify([]));
        setCartItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, setUsername, db]);

  const handleImageClick = (productId) => {
    navigate(`/productDetails/${productId}`);
    window.scrollTo(0, 0);
  };

  const addAnItem = () => {
    navigate(`/`);
  };

  const removeFromCart = async (productId, size) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = cartItems.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      if (auth.currentUser) {
        await updateFirebaseCart(updatedCart);
      }
    } catch (error) {
      setError('Failed to remove item. Please try again.');
      console.error('Error removing item:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, size, increment) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = cartItems
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const newQuantity = Math.min(Math.max(item.quantity + increment, 1), MAX_QUANTITY);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean);

      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      if (auth.currentUser) {
        await updateFirebaseCart(updatedCart);
      }
    } catch (error) {
      setError('Failed to update quantity. Please try again.');
      console.error('Error updating quantity:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFirebaseCart = async (updatedCart) => {
    try {
      const userCartRef = doc(db, 'carts', auth.currentUser.uid);
      await setDoc(userCartRef, { items: updatedCart }, { merge: true });
    } catch (error) {
      throw new Error('Failed to update cart in database');
    }
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    document.title = "Your Shopping Cart - Satta Pai";
  }, []);

  const checkoutPayment = (totalCost) => {
    navigate('/checkout', { state: { totalCost, items: cartItems } });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

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
                          disabled={item.quantity === MAX_QUANTITY}
                          className={`quantity-button plus ${item.quantity === MAX_QUANTITY ? 'disabled' : ''}`}
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
                    <p>Rs. {item.price * item.quantity}</p>
                  </li>
                  {index < cartItems.length - 1 && <hr className="separator" />}
                </div>
              ))}
            </ul>
            <hr className="separator" />
            <div className="totalCost">
              <h3>Total Cost Rs. {totalCost}</h3>
            </div>
            <div className="checkout-container">
              <button className="checkout" onClick={() => checkoutPayment(totalCost)}>Checkout</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;