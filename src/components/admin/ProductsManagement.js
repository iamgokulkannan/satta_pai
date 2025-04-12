import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { convertImageToBase64 } from '../../utils/imageUtils';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        image: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsCollection = collection(db, 'products');
            const snapshot = await getDocs(productsCollection);
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64Image = await convertImageToBase64(URL.createObjectURL(file));
                setNewProduct({ ...newProduct, image: base64Image });
            } catch (error) {
                setError('Failed to process image');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productsCollection = collection(db, 'products');
            await addDoc(productsCollection, {
                ...newProduct,
                price: parseFloat(newProduct.price),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                subCategory: '',
                image: null
            });
            fetchProducts();
        } catch (error) {
            setError('Failed to add product');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, 'products', productId));
                fetchProducts();
            } catch (error) {
                setError('Failed to delete product');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="products-management">
            <h2>Products Management</h2>
            
            <form className="product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Sub Category"
                    value={newProduct.subCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                <button type="submit">Add Product</button>
            </form>

            <div className="products-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Category: {product.category}</p>
                            <p>Sub Category: {product.subCategory}</p>
                        </div>
                        <div className="product-actions">
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsManagement; 