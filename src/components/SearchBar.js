import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value.trim().length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsLoading(true);
        try {
            const productsRef = collection(db, 'products');
            const q = query(
                productsRef,
                where('searchTerms', 'array-contains', value.toLowerCase())
            );
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSearchResults(results);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = (productId) => {
        navigate(`/productDetails/${productId}`);
        setShowResults(false);
        setSearchTerm('');
    };

    return (
        <div className="search-container" ref={searchRef}>
            <form 
                className="search-input-container"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (searchResults.length > 0) {
                        handleResultClick(searchResults[0].id);
                    }
                }}
            >
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowResults(true)}
                />
                {isLoading && <div className="search-spinner"></div>}
            </form>
            
            {showResults && searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="search-result-item"
                            onClick={() => handleResultClick(result.id)}
                        >
                            <img src={result.image} alt={result.name} />
                            <div className="result-details">
                                <h4>{result.name}</h4>
                                <p>Rs. {result.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {showResults && searchResults.length === 0 && !isLoading && (
                <div className="no-results">
                    No products found
                </div>
            )}
        </div>
    );
};

export default SearchBar; 