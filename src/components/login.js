import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './login.css';
import NavBar from './navBar';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in
                console.log('User signed in:', userCredential.user);
                navigate('/');
            })
            .catch((error) => {
                setError(error.message);
                alert('Error signing in , Please try back later', error);
            });
    };

    const handleGoogleSignIn = async () => {
            setLoading(true);
            setError('');
            
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
        
                await setDoc(doc(db, 'users', user.uid), {
                    username: user.displayName || '',
                    email: user.email,
                    phone: user.phoneNumber || '',
                    uid: user.uid,
                }, { merge: true });
        
                // alert('Signed in with Google!');
                navigate('/');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

    const goToNavigate =() =>{
        navigate('/signup');
    }
    const goToNavigateForgetPassword =() =>{
        navigate('/forgotPassword');
    }

    return (
        <>
        <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
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
            <p>Forget Password <span onClick={()=>goToNavigateForgetPassword()} className='signup'>reset</span></p>
        </div>
    </>
    );
};

export default Login;