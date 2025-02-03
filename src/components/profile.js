import React, { useState, useEffect } from 'react';
import { getAuth, deleteUser, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import NavBar from './navBar';

const Profile = ({ username, setUsername, setLoading }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [inputUsername, setInputUsername] = useState(username);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUsername(data.username || '');
            setInputUsername(data.username || '');
            setAddress(data.address || '');
            setPhone(data.phone || '');
          }
        } catch (error) {
          console.error('Error fetching profile:', error.message);
        } finally {
          setLoading(false); // Profile data has been fetched
        }
      };

      fetchUserData();
    }
  }, [db, user, setUsername, setLoading]);

  const handleSave = async () => {
    try {
      if (user) {
        // Update Firebase Auth displayName
        await updateProfile(user, {
          displayName: inputUsername,
        });

        // Update Firestore document
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, { username: inputUsername, address, phone }, { merge: true });

        setUsername(inputUsername);
        setSuccessMessage('Profile updated successfully!');
        console.log('Updated values:', { inputUsername, address, phone });

        // Optionally, re-fetch data to reflect changes
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUsername(data.username || '');
          setAddress(data.address || '');
          setPhone(data.phone || '');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
    navigate('/');
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user).then(() => {
        navigate('/'); // Redirect to signup or another appropriate page
      }).catch((error) => {
        console.error('Error deleting user:', error);
      });
    }
  };

  return (
    <>
      <NavBar disableScrollEffect={true} username={username} setUsername={setUsername} />
      <div className="profile-container">
        <h1>Profile</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />

          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </>
  );
};

export default Profile;