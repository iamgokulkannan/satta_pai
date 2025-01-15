import React, { useState, useEffect } from 'react';
import { products } from '../assets/images/assets';
import { useNavigate } from 'react-router-dom';
import './productDetails.css';
import NavBar from './navBar';

function ProductDetails({ productId }) {
  const product = products.find((p) => p._id === productId); // Find product by ID
  const navigate = useNavigate(); 

  const [selectedImage, setSelectedImage] = useState(product?.image || ''); // Initialize state for selected image
  const [zoomStyle, setZoomStyle] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      document.title = product.name + " - Satta Pai";
    }
  }, [product]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleImageClick = (productId) => {
    navigate(`/productDetails/${productId}`);
    window.scrollTo(0, 0);
  };

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      productId: product._id,
      image: product.image,
      name: product.name,
      price: product.discountedPrice,
      size: selectedSize,
      quantity,
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItemIndex = cart.findIndex(
      (item) => item.productId === cartItem.productId && item.size === cartItem.size
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload();
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

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
      display: 'block',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundImage: 'none' });
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <NavBar disableScrollEffect={true} />
      <div className="product-details">
        <div className="product-images">
          {[product.image, product.option1, product.option2, product.option3, product.option4].map((img, index) => (
            img && (
              <img
                key={index}
                src={img}
                alt={`Option ${index + 1}`}
                onClick={() => setSelectedImage(img)}
              />
            )
          ))}
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

          <div className="button-container">
            <p className="size">Size:</p>
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
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className={`quantity-button minus ${quantity === 1 ? 'disabled' : ''}`}
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="quantity">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="quantity-button plus"
              >
                +
              </button>
            </div>
          </div>

          <button onClick={addToCart} className="add-to-cart-button">Add to Cart</button>
          <button onClick={proceedToCheckout} className="checkout-button">Proceed to Checkout</button>

          <div className="product-additional-details">
            <p style={{ fontWeight: '500' }}>{product.description}</p>
            <p><strong>Composition:</strong> {product.details.composition}</p>
            <p><strong>GSM:</strong> {product.details.gsm}</p>
            <p><strong>Color:</strong> {product.details.color}</p>
            <p><strong>Production Country:</strong> {product.details.productionCountry}</p>
            <p><strong>Wash Care:</strong> {product.details.washCare.join(', ')}</p>
            <p><strong>Sizing:</strong> {product.details.sizing}</p>
            <p><strong>Order Processing Time:</strong> {product.details.orderProcessingTime}</p>
          </div>
        </div>
      </div>

      <div className="promoting">
        <div className="youMayAlso">You may also like</div>
        <div className="promoting-products">
          {products
            .filter((p) => p._id !== product._id && p.subCategory === product.subCategory)
            .slice(0, 4)
            .map((p) => (
              <div key={p._id} className="promoting-product">
                <img src={p.image} alt={p.name} onClick={() => handleImageClick(p._id)} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;