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
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCartItems);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUsername(currentUser.displayName || currentUser.email.split('@')[0]);
        await syncCartWithFirebase(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [auth, setUsername]);

  const syncCartWithFirebase = async (userId) => {
    if (!userId) return;

    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const userCartRef = doc(db, 'carts', userId);

    try {
      const userCartDoc = await getDoc(userCartRef);
      let mergedCart = localCart;

      if (userCartDoc.exists()) {
        const existingCart = userCartDoc.data().items || [];

        // 🚀 **Avoid Duplicate Merging**
        if (JSON.stringify(existingCart) === JSON.stringify(localCart)) {
          console.log('Cart already in sync, skipping merge.');
          return;
        }

        mergedCart = mergeCarts(existingCart, localCart);
      }

      // ✅ **Update Firestore with merged cart (only if needed)**
      if (mergedCart.length > 0) {
        await setDoc(userCartRef, { items: mergedCart }, { merge: true });
        console.log('Cart successfully synced with Firebase');
      }

      // 🔥 **Clear local storage only if Firebase has the cart**
      localStorage.removeItem('cart');
      setCartItems(mergedCart);
    } catch (error) {
      console.error('Error syncing cart with Firebase:', error.message);
    }
  };

  const mergeCarts = (existingCart, newCart) => {
    const mergedCart = [...existingCart];
    newCart.forEach((newItem) => {
      const existingItemIndex = mergedCart.findIndex(
        (item) => item.productId === newItem.productId && item.size === newItem.size
      );
      if (existingItemIndex > -1) {
        mergedCart[existingItemIndex].quantity += newItem.quantity;
      } else {
        mergedCart.push(newItem);
      }
    });
    return mergedCart;
  };

  const handleImageClick = (productId) => {
    navigate(`/productDetails/${productId}`);
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
    if (auth.currentUser) {
      updateFirebaseCart(updatedCart);
    }
  };

  const updateQuantity = (productId, size, increment) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.productId === productId && item.size === size) {
          const newQuantity = item.quantity + increment;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean);

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    if (auth.currentUser) {
      updateFirebaseCart(updatedCart);
    }
  };

  const updateFirebaseCart = async (updatedCart) => {
    try {
      const userCartRef = doc(db, 'carts', auth.currentUser.uid);
      await setDoc(userCartRef, { items: updatedCart }, { merge: true });
    } catch (error) {
      console.error('Error updating Firebase cart:', error.message);
    }
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    document.title = "Your Shopping Cart - Satta Pai";
  }, []);

  const checkoutPayment = (totalCost) => {
    navigate('/checkout', { state: { totalCost, items: cartItems } });
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