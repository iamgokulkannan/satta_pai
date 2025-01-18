import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../assets/images/assets';
import NavBar from './navBar';
import Footer from './footer';
import './productPage.css';

const ProductPage = ( {username , setUsername} ) => {
    const { subCategory } = useParams();
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState({
      composition: "All",
      size: "All",
      category: "All",
      gsm: "All",
    });
  
    useEffect(() => {
      const filtered = products.filter((product) => product.subCategory === subCategory);
      setFilteredProducts(filtered);
    }, [subCategory]);
  
    const productsPerPage = 20;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
    const handleFilterChange = (filterType, value) => {
      const updatedFilters = { ...selectedFilters, [filterType]: value };
      setSelectedFilters(updatedFilters);
  
      const filtered = products.filter((product) => {
        return (
          product.subCategory === subCategory &&
          (updatedFilters.composition === "All" || product.details.composition === updatedFilters.composition) &&
          (updatedFilters.size === "All" || product.sizes.includes(updatedFilters.size)) &&
          (updatedFilters.category === "All" || product.category === updatedFilters.category) &&
          (updatedFilters.gsm === "All" || product.details.gsm.toString() === updatedFilters.gsm)
        );
      });
  
      setFilteredProducts(filtered);
      setCurrentPage(1);
    };
  
    const handleImageClick = (productId) => {
      navigate(`/productDetails/${productId}`);
      window.scrollTo(0, 0);
    };
  
    const displayedProducts = filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
  
    return (
      <div>
        <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
        <div className="product-page">
          <h1>{subCategory}</h1>
          <div className="filters">
            <label>Filter by Composition:</label>
            <select
              value={selectedFilters.composition}
              onChange={(e) => handleFilterChange("composition", e.target.value)}
            >
              <option value="All">All</option>
              <option value="100% cotton">100% cotton</option>
              {/* Add more compositions as needed */}
            </select>
  
            <label>Filter by Size:</label>
            <select
              value={selectedFilters.size}
              onChange={(e) => handleFilterChange("size", e.target.value)}
            >
              <option value="All">All</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
  
            <label>Filter by Category:</label>
            <select
              value={selectedFilters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="All">All</option>
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
  
            <label>Filter by GSM:</label>
            <select
              value={selectedFilters.gsm}
              onChange={(e) => handleFilterChange("gsm", e.target.value)}
            >
              <option value="All">All</option>
              <option value="160">160</option>
              <option value="200">200</option>
              <option value="240">240</option>
            </select>
          </div>
  
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleImageClick(product._id)}
              >
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Rs. {product.discountedPrice}.00</p>
              </div>
            ))}
          </div>
  
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  };

export default ProductPage;