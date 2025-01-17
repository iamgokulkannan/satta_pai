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
import Signup from './signup';
import Orders from './components/order';
import './App.css';

function ProductDetailsWrapper({ addToCart }) {
  const { productId } = useParams();
  return <ProductDetails productId={productId} addToCart={addToCart} />;
}

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

  return (
    <Router>
      <div className="App">
        <NavBar username={username} setUsername={setUsername} loading={loading} />
        <Routes>
          <Route path="/productDetails/:productId" element={<ProductDetailsWrapper addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
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
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/products/:subCategory" element={<ProductPage />} />
          <Route path="/orderSuccessful" element={<OrderSuccessful cart={cart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;