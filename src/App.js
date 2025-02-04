import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import NavBar from './components/navBar';
import Profile from './components/profile';
import Intro from './components/intro';
import Featured from './components/featured';
import InfinteScrollReverse from './components/infinteScrollReverse';
import Curated from './components/curated';
import Branding from './components/branding';
import Footer from './components/footer';
import ProductDetails from './components/productDetails';
import Cart from './components/cart';
import Checkout from './components/checkout';
import ProductPage from './components/productPage';
import OrderSuccessful from './components/orderSuccessful';
import Login from './components/login';
import Signup from './components/signup';
import Orders from './components/order';
import './App.css';
import Lenis from 'lenis'
import CommentsPage from './components/commentsPage';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); // Track loading state
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => {
    setCart([...cart, item]);
  };
  
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };
  function ProductDetailsWrapper({ addToCart }) {
    const { productId } = useParams();
    return <ProductDetails productId={productId} addToCart={addToCart} username={username} setUsername={setUsername} />;
  }

  // Initialize Lenis
  const lenis = new Lenis({
    autoRaf: true,
  });
  // Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return (
    <Router>
      <div className="App">
        <NavBar username={username} setUsername={setUsername} loading={loading} />
        <Routes>
          <Route path="/productDetails/:productId" element={<ProductDetailsWrapper addToCart={addToCart}  username={username} setUsername={setUsername} />}  />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart}  username={username} setUsername={setUsername} />} />
          <Route
            path="/"
            element={
              <>
                <Intro />
                <Curated />
                <Featured />
                <InfinteScrollReverse />
                <Branding />
                <Footer />
              </>
            }
          />
          <Route path="/profile" element={<Profile username={username} setUsername={setUsername} setLoading={setLoading} />} />
          <Route path="/checkout" element={<Checkout cart={cart} username={username} setUsername={setUsername} />} />
          <Route path="/products/:subCategory" element={<ProductPage username={username} setUsername={setUsername} />} />
          <Route path="/orderSuccessful" element={<OrderSuccessful username={username} setUsername={setUsername} />} />
          <Route path="/login" element={<Login  username={username} setUsername={setUsername} />} />
          <Route path="/signup" element={<Signup username={username} setUsername={setUsername} />} />
          <Route path="/orders" element={<Orders username={username} setUsername={setUsername} />} />
          <Route path="/comments/:productId" element={<CommentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;