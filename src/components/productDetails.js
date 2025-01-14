import React, { useState, useEffect } from 'react';
import { products } from '../assets/images/assets';
import './productDetails.css'; // Import the CSS file
import NavBar from './navBar';

function ProductDetails({ productId }) {
  const product = products.find((p) => p._id === productId); // Find product by ID

  const [selectedImage, setSelectedImage] = useState(product.image); // Initialize state for selected image
  const [zoomStyle, setZoomStyle] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    document.title = product.name; // Set the document title to the product name
  }, [product.name]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  if (!product) {
    return <div>Product not found</div>; // If product is not found
  }

  // Function to handle the zoom effect
  const handleMouseMove = (e) => {
    const imageElement = e.target;
    const { left, top, width, height } = imageElement.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const backgroundX = (mouseX / width) * 100;
    const backgroundY = (mouseY / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${selectedImage})`,
      backgroundPosition: `${backgroundX}% ${backgroundY}%`,
      display: 'block', // Show the zoomed area
    });
  };

  // Function to hide zoom when mouse leaves the image
  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundImage: 'none' }); // Remove background image when not zoomed
  };

  return (
    <div>
      <NavBar disableScrollEffect={true} />
      <div className="product-details">
        <div className="product-images">
          <img src={product.image} alt={product.name} onClick={() => setSelectedImage(product.image)} />
          <img src={product.option1} alt={product.option1} onClick={() => setSelectedImage(product.option1)} />
          <img src={product.option2} alt={product.option2} onClick={() => setSelectedImage(product.option2)} />
          <img src={product.option3} alt={product.option3} onClick={() => setSelectedImage(product.option3)} />
          <img src={product.option4} alt={product.option4} onClick={() => setSelectedImage(product.option4)} />
        </div>

        <div className="main-image-container">
          <img
            src={selectedImage}
            alt={product.name}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          <div className="zoomed" style={zoomStyle}></div>
        </div>

        <div className="details">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>Price: Rs. {product.price}.00</p>
          <p>Category: {product.category}</p>
          <div className='button-container'>
            <p className='size'>Sizes:</p>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;