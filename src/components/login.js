import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './login.css';

// Your Firebase configuration
const firebaseConfig = {
 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in
                console.log('User signed in:', userCredential.user);
            })
            .catch((error) => {
                setError(error.message);
                alert('Error signing in , Please try back later', error);
            });
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // Signed in
                console.log('User signed in with Google:', result.user);
                navigate('/');
            })
            .catch((error) => {
                setError(error.message);
                console.error('Error signing in with Google:', error);
            });
    };

    const goToNavigate =() =>{
        
        navigate('/signup');
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                {error && <p className="error">{error}</p>}
                
                <button type="submit">Login</button>
            </form>
            <button className="google-button" onClick={handleGoogleSignIn}>
                Continue with Google
            </button>
            <p>Don't have an account? <span onClick={()=>goToNavigate()} className='signup'>Sign Up</span></p>
        </div>
    );
};

export default Login;
