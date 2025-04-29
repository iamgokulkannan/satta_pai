import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import ProductsManagement from './ProductsManagement';
import ReviewsManagement from './ReviewsManagement';
import UsersManagement from './UsersManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Check if user is admin
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().isAdmin) {
                        setIsAdmin(true);
                    } else {
                        setError('You do not have admin privileges');
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setError('Error checking admin privileges');
                    navigate('/');
                }
            } else {
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db, navigate]);

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (error) {
        return <div className="admin-error">{error}</div>;
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <h1>Admin Dashboard</h1>
                <div className="admin-nav-links">
                    <button 
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                    <button 
                        className={activeTab === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                    <button 
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </div>
            </nav>

            <main className="admin-content">
                {activeTab === 'products' && <ProductsManagement />}
                {activeTab === 'reviews' && <ReviewsManagement />}
                {activeTab === 'users' && <UsersManagement />}
            </main>
        </div>
    );
};

export default AdminDashboard; 