import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const makeUserAdmin = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        await updateDoc(userRef, {
            isAdmin: true
        });

        return true;
    } catch (error) {
        console.error('Error making user admin:', error);
        throw error;
    }
};

export const removeAdminStatus = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        await updateDoc(userRef, {
            isAdmin: false
        });

        return true;
    } catch (error) {
        console.error('Error removing admin status:', error);
        throw error;
    }
}; 