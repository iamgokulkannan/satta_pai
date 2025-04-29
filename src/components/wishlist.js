import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { LazyImage } from '../utils/imageUtils';
import { cacheData, getCachedData } from '../utils/cacheUtils';
import NavBar from './navBar';
import Footer from './footer';
import './wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState('Your wishlist is empty');
  
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  
  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Check cache first
        const cachedWishlist = getCachedData(`wishlist_${auth.currentUser.uid}`);
        if (cachedWishlist) {
          setWishlistItems(cachedWishlist);
          setLoading(false);
          return;
        }
        
        // If not in cache, fetch from Firestore
        const wishlistRef = collection(db, 'wishlists');
        const q = query(wishlistRef, where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const items = [];
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          // Fetch product details
          const productRef = doc(db, 'products', data.productId);
          const productSnap = await getDoc(productRef);
          
          if (productSnap.exists()) {
            items.push({
              id: doc.id,
              productId: data.productId,
              addedAt: data.addedAt,
              ...productSnap.data()
            });
          }
        }
        
        // Sort by most recently added
        items.sort((a, b) => b.addedAt - a.addedAt);
        
        // Update state and cache
        setWishlistItems(items);
        cacheData(`wishlist_${auth.currentUser.uid}`, items, 5 * 60 * 1000); // Cache for 5 minutes
        
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load your wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [auth.currentUser, db, navigate]);
  
  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'wishlists', itemId));
      
      // Update state
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // Update cache
      cacheData(`wishlist_${auth.currentUser.uid}`, 
        wishlistItems.filter(item => item.id !== itemId), 
        5 * 60 * 1000
      );
      
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      setError('Failed to remove item. Please try again.');
    }
  };
  
  // Add item to cart
  const addToCart = async (product) => {
    try {
      // Get current cart
      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        // Update existing cart
        const cartData = cartSnap.data();
        const existingItemIndex = cartData.items.findIndex(item => item.productId === product.productId);
        
        if (existingItemIndex >= 0) {
          // Item already in cart, increase quantity
          cartData.items[existingItemIndex].quantity += 1;
        } else {
          // Add new item to cart
          cartData.items.push({
            productId: product.productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          });
        }
        
        await setDoc(cartRef, cartData);
      } else {
        // Create new cart
        await setDoc(cartRef, {
          userId: auth.currentUser.uid,
          items: [{
            productId: product.productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          }],
          updatedAt: Date.now()
        });
      }
      
      // Navigate to cart
      navigate('/cart');
      
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart. Please try again.');
    }
  };
  
  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  return (
    <div className="wishlist-page">
      <NavBar />
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-spinner">Loading your wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <p>{emptyMessage}</p>
            <button 
              className="browse-button"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-item">
                <div 
                  className="product-image"
                  onClick={() => handleProductClick(item.productId)}
                >
                  <LazyImage 
                    src={item.image} 
                    alt={item.name}
                    effect="blur"
                  />
                </div>
                <div className="product-details">
                  <h3 
                    className="product-name"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    {item.name}
                  </h3>
                  <p className="product-price">${item.price.toFixed(2)}</p>
                  <div className="product-actions">
                    <button 
                      className="add-to-cart-button"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="remove-button"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist; 