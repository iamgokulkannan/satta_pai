import React, { useState, useEffect } from 'react';
import { products } from '../assets/images/assets';
import { useNavigate } from 'react-router-dom';
import './productDetails.css';
import NavBar from './navBar';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

function ProductDetails({ username, setUsername, productId }) {
  const product = products.find((p) => p._id === productId); // Find product by ID
  const navigate = useNavigate(); 

  const [selectedImage, setSelectedImage] = useState(product?.image || ''); // Initialize state for selected image
  const [zoomStyle, setZoomStyle] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (product) {
      document.title = product.name + " | Satta Pai";
    }
    fetchComments();
  }, [product]);

  const fetchComments = async () => {
    const querySnapshot = await getDocs(collection(db, 'comments'));
    const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(fetchedComments.filter(comment => comment.productId === productId));
  };
  
  const handleAddComment = async () => {
    if (!username) {
      alert("You need to log in to post a comment.");
      return;
    }
    
    if (!newComment.trim()) return;
  
    const commentData = {
      productId,
      username,
      text: newComment,
      timestamp: new Date()
    };
  
    await addDoc(collection(db, 'comments'), commentData);
    setNewComment('');
    fetchComments();
  };
  
  const handleDeleteComment = async (commentId) => {
    await deleteDoc(doc(db, 'comments', commentId));
    fetchComments();
  };
  const handleEditComment = async (commentId) => {
    await updateDoc(doc(db, 'comments', commentId), { text: editedText });
    setEditingComment(null);
    fetchComments();
  };
      
  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleImageClick = (productId) => {
    navigate(`/productDetails/${productId}`);
    window.location.reload();
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

  const proceedToCheckout = (totalCost) => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    navigate('/checkout', { state: { totalCost } });
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
      <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
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
          <button onClick={()=>proceedToCheckout(quantity*product.discountedPrice)} className="checkout-button">Proceed to Checkout</button>

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

      <div className="comments-section">
  <h3>Customer Reviews</h3>
  <textarea
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Write a review..."
  ></textarea>
  <button onClick={handleAddComment}>Post Comment</button>
  
  <div className="comments-list">
    {comments.map((comment) => (
      <div key={comment.id} className="comment">
        {editingComment === comment.id ? (
          <>
            <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)}></textarea>
            <button onClick={() => handleEditComment(comment.id)}>Save</button>
            <button onClick={() => setEditingComment(null)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>{comment.username}</strong>: {comment.text}</p>
            {comment.username === username && (
              <>
                <button onClick={() => setEditingComment(comment.id) || setEditedText(comment.text)}>Edit</button>
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </>
            )}
          </>
        )}
      </div>
    ))}
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