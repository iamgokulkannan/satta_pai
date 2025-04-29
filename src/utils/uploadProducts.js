import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { convertImageToBase64 } from './imageUtils';
import { assets } from '../assets/images/assets';

const products = [
    {
        name: "Product 1",
        description: "Description for Product 1",
        price: 99.99,
        category: "category1",
        subCategory: "subCategory1",
        image: assets.product1
    },
    {
        name: "Product 2",
        description: "Description for Product 2",
        price: 149.99,
        category: "category1",
        subCategory: "subCategory2",
        image: assets.product2
    },
    // Add more products as needed
];

export const uploadProductsToFirestore = async () => {
    try {
        const productsCollection = collection(db, 'products');
        
        for (const product of products) {
            try {
                // Convert image to base64
                const base64Image = await convertImageToBase64(product.image);
                
                // Create product document
                const productDoc = {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    subCategory: product.subCategory,
                    image: base64Image,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Add to Firestore
                await addDoc(productsCollection, productDoc);
                console.log(`Successfully uploaded ${product.name}`);
            } catch (error) {
                console.error(`Error uploading ${product.name}:`, error);
            }
        }
        
        console.log('All products uploaded successfully');
    } catch (error) {
        console.error('Error in upload process:', error);
    }
}; 