import React, { useState } from 'react';

function Cart({ cart, removeFromCart }) {
  const [isCartVisible, setIsCartVisible] = useState(false);

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <div>
      <button onClick={toggleCartVisibility}>
        {isCartVisible ? 'Hide Cart' : 'View Cart'}
      </button>
      {isCartVisible && (
        <div>
          <h1>Cart</h1>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Cart;