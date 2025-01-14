// Importing assets
import hero from './hero.jpg';
import hoodie from './hoodie.png';
import intro from './intro.avif';
import logo from './logo.png';
import logoOrg from './logo_org.png';
import oversized from './oversized.png';
import slider1 from './slider2_1.png';
import slider2 from './slider2_2.png';
import slider3 from './slider2_3.png';
import slider4 from './slider2_4.png';
import slider5 from './slider2_5.png';
import slider6 from './slider2_6.png';
import slider7 from './slider2_7.png';
import slider8 from './slider2_8.png';
import slider9 from './slider2_9.png';
import sweatshirt from './sweatshirt.png';
import option1 from './option1.png';
import option2 from './option2.png';
import option3 from './option3.png';
import option4 from './option4.png';
import tshirt from './tshirt.png';

// Exporting assets
export const assets = {
    hero,
    hoodie,
    intro,
    logo,
    logoOrg,
    oversized,
    slider1,
    slider2,
    slider3,
    slider4,
    slider5,
    slider6,
    slider7,
    slider8,
    slider9,
    sweatshirt,
    tshirt,
};

export const products = [
    {
        _id: "p1",
        name: "Slider Product 1",
        description: "Premium-quality product with great style and comfort.",
        price: 499,
        image: slider1,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "T-Shirts",
        sizes: ["S", "M", "L", "XL"],
        date: 1716634345448,
        bestseller: true,
    },
    {
        _id: "p2",
        name: "Slider Product 2",
        description: "Stylish and comfortable apparel for everyday wear.",
        price: 599,
        image: slider2,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Tops",
        sizes: ["XS", "S", "M", "L"],
        date: 1716634345449,
        bestseller: false,
    },
    {
        _id: "p3",
        name: "Slider Product 3",
        description: "Made with premium fabric to give you ultimate comfort.",
        price: 699,
        image: slider3,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Sweatshirts",
        sizes: ["M", "L", "XL"],
        date: 1716634345450,
        bestseller: true,
    },
    {
        _id: "p4",
        name: "Slider Product 4",
        description: "Trendy oversized clothing to match Gen-Z aesthetics.",
        price: 799,
        image: slider4,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Oversized Tees",
        sizes: ["M", "L", "XL", "XXL"],
        date: 1716634345451,
        bestseller: true,
    },
    {
        _id: "p5",
        name: "Slider Product 5",
        description: "High-quality hoodie designed for ultimate warmth and comfort.",
        price: 999,
        image: slider5,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Hoodies",
        sizes: ["S", "M", "L"],
        date: 1716634345452,
        bestseller: false,
    },
    {
        _id: "p6",
        name: "Slider Product 6",
        description: "Lightweight and durable t-shirt for everyday use.",
        price: 399,
        image: slider6,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "T-Shirts",
        sizes: ["XS", "S", "M"],
        date: 1716634345453,
        bestseller: false,
    },
    {
        _id: "p7",
        name: "Slider Product 7",
        description: "Chic sweatshirt with modern designs.",
        price: 699,
        image: slider7,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Sweatshirts",
        sizes: ["M", "L", "XL"],
        date: 1716634345454,
        bestseller: true,
    },
    {
        _id: "p8",
        name: "Slider Product 8",
        description: "Casual oversized tees that provide ultimate comfort.",
        price: 799,
        image: slider8,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Oversized Tees",
        sizes: ["M", "L", "XL"],
        date: 1716634345455,
        bestseller: false,
    },
    {
        _id: "p9",
        name: "Slider Product 9",
        description: "Elegant hoodie for a stylish winter look.",
        price: 1099,
        image: slider9,option1,option2,option3,option4,
        category: "Unisex",
        subCategory: "Hoodies",
        sizes: ["S", "M", "L", "XL"],
        date: 1716634345456,
        bestseller: true,
    },
];