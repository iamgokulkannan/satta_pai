import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { makeUserAdmin, removeAdminStatus } from '../../utils/adminUtils';
import './UsersManagement.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            console.log('Snapshot received:', snapshot.docs.length, 'users');
            
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('Processed users:', usersList);
            setUsers(usersList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(`Failed to fetch users: ${error.message}`);
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            if (currentStatus) {
                await removeAdminStatus(userId);
            } else {
                await makeUserAdmin(userId);
            }
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error toggling admin status:', error);
            setError(`Failed to update admin status: ${error.message}`);
        }
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (users.length === 0) {
        return <div className="no-users">No users found in the database.</div>;
    }

    return (
        <div className="users-management">
            <h2>Users Management</h2>
            <div className="users-list">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <div className="user-info">
                            <h3>{user.username || 'No username'}</h3>
                            <p>Email: {user.email}</p>
                            <p>UID: {user.uid}</p>
                            <p>Admin Status: {user.isAdmin ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="user-actions">
                            <button
                                className={user.isAdmin ? 'remove-admin' : 'make-admin'}
                                onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                            >
                                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersManagement; 