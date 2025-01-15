import React, { useState, useEffect } from 'react';
import { products } from '../assets/images/assets';
import './productDetails.css'; // Import the CSS file
import NavBar from './navBar';

function ProductDetails({ productId }) {
  const product = products.find((p) => p._id === productId); // Find product by ID

  const [selectedImage, setSelectedImage] = useState(product.image); // Initialize state for selected image
  const [zoomStyle, setZoomStyle] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1); // Initialize state for quantity

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  useEffect(() => {
    document.title = product.name + " - Satta Pai"; // Set the document title to the product name
  }, [product.name]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  function updateQuantity() {
    const quantityInput = document.querySelector(".quantity-input");
    const minusButton = document.querySelector(".quantity-button.minus");
  
    // Update the input value
    quantityInput.value = quantity;
  
    // Disable the minus button if quantity is 1
    if (quantity === 1) {
      minusButton.classList.add("disabled");
    } else {
      minusButton.classList.remove("disabled");
    }
  }
  
  // Initialize the quantity input and buttons
  document.addEventListener("DOMContentLoaded", () => {
    updateQuantity();
  });

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
  };

  const proceedToCheckout = () => {
    // Logic to proceed to checkout
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
          <div className="price-container">
            {product.originalPrice && (
              <span className="original-price" style={{ textDecoration: 'line-through', marginRight: '10px' }}>
                Rs. {product.originalPrice}.00
              </span>
            )}
            <span className="discounted-price">Rs. {product.discountedPrice}.00 </span>
            {product.originalPrice && <span className="sale-box">Sale</span>}
          </div>
          <div className="shipping">
            <p><span className="underline">Shipping</span> calculated at checkout</p>
          </div>
          <div className='button-container'>
            <p className='size'>Size:</p>
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

          <div className="quantity-container">
            <p>Quantity</p>
            <div className="quantity-container-box">
              <button
                onClick={decreaseQuantity}
                className={`quantity-button minus ${quantity === 1 ? 'disabled' : ''}`}
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="quantity">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="quantity-button plus"
              >
                +
              </button>
            </div>
          </div>
            <button onClick={addToCart} className="add-to-cart-button">Add to Cart</button>
            <button onClick={proceedToCheckout} className="checkout-button">Proceed to Checkout</button>


          {/* Rendering product details */}
          <div className="product-additional-details">
            <p style={{fontFamily: '500'}}>{product.description}</p>
            <p><strong>Composition:</strong> {product.details.composition}</p>
            <p><strong>GSM:</strong> {product.details.gsm}</p>
            <p><strong>Color:</strong> {product.details.color}</p>
            <p><strong>Production Country:</strong> {product.details.productionCountry}</p>
            <p><strong>Wash Care:</strong> {product.details.washCare[0]}</p>
            {product.details.washCare.slice(1).map((instruction, index) => (
              <p key={index}>{instruction}</p>
            ))}
            <p><strong>Sizing:</strong> {product.details.sizing}</p>
            <p><strong>Order Processing Time:</strong> {product.details.orderProcessingTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;