import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Intro from './components/intro';
import NavBar from './components/navBar';
import Featured from './components/featured';
import InfinteScrollReverse from './components/infinteScrollReverse';
import Curated from './components/curated';
import Branding from './components/branding';
import Footer from './components/footer';
import ProductDetails from './components/productDetails';
import './App.css';

function ProductDetailsWrapper() {
  const { productId } = useParams();
  return <ProductDetails productId={productId} />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/productDetails/:productId" element={
            <>
              <ProductDetailsWrapper />
              <Footer />
            </>
          } />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;