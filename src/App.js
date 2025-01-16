import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Intro from './components/intro';
import NavBar from './components/navBar';
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
import './App.css';

function ProductDetailsWrapper({ addToCart }) {
  const { productId } = useParams();
  return <ProductDetails productId={productId} addToCart={addToCart} />;
}

function App() {
  const [cart, setCart] = useState([]);  // This ensures cart is always an array

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };


  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/productDetails/:productId" element={<ProductDetailsWrapper addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/" element={
            <>
              <Intro />
              <Curated />
              <Featured />
              <InfinteScrollReverse />
              <Branding />
              <Footer />
            </>
          } />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/products/:subCategory" element={<ProductPage />} />
          <Route
            path="/orderSuccessful"
            element={<OrderSuccessful cart={cart} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;