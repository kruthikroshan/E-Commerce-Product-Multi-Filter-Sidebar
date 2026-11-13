'use strict';

/**
 * Master product inventory (static, deterministic).
 * Fields: id, name, category, price (INR), rating (0-5), reviews, emoji, hue
 * `emoji` + `hue` are used to render the SVG thumbnail (see routes/products.js).
 */
const seed = [
  // Electronics
  ['Wireless Earbuds Pro', 'Electronics', 2499, 4.5, '🎧', 210],
  ['Smart Watch Series 5', 'Electronics', 6999, 4.2, '⌚', 220],
  ['Bluetooth Speaker Mini', 'Electronics', 1799, 3.9, '🔊', 200],
  ['Mechanical Keyboard', 'Electronics', 3999, 4.7, '⌨️', 230],
  ['Gaming Mouse RGB', 'Electronics', 1499, 4.1, '🖱️', 240],
  ['4K Action Camera', 'Electronics', 8999, 4.4, '📷', 210],
  ['Portable Power Bank 20000mAh', 'Electronics', 1299, 4.0, '🔋', 190],
  ['Noise Cancelling Headphones', 'Electronics', 11999, 4.8, '🎧', 225],
  ['10" Android Tablet', 'Electronics', 13499, 3.6, '📱', 215],
  ['LED Desk Lamp', 'Electronics', 899, 3.4, '💡', 45],
  ['USB-C Hub 7-in-1', 'Electronics', 1999, 3.8, '🔌', 200],
  ['Webcam Full HD', 'Electronics', 2199, 2.9, '📹', 235],
  ['Smart Home Plug (2-pack)', 'Electronics', 799, 4.3, '🔌', 205],
  ['E-Reader 6"', 'Electronics', 7499, 4.6, '📖', 210],
  ['Wireless Charger Pad', 'Electronics', 999, 2.5, '⚡', 195],
  ['Laptop Stand Aluminium', 'Electronics', 1599, 4.2, '💻', 220],
  // Apparel
  ['Classic Cotton T-Shirt', 'Apparel', 499, 4.0, '👕', 10],
  ['Slim Fit Denim Jeans', 'Apparel', 1799, 4.3, '👖', 215],
  ['Hooded Sweatshirt', 'Apparel', 1499, 4.5, '🧥', 280],
  ['Formal Oxford Shirt', 'Apparel', 1299, 3.7, '👔', 200],
  ['Summer Floral Dress', 'Apparel', 1999, 4.4, '👗', 340],
  ['Winter Puffer Jacket', 'Apparel', 3499, 4.7, '🧥', 15],
  ['Cotton Chinos', 'Apparel', 1399, 3.5, '👖', 35],
  ['Wool Scarf', 'Apparel', 699, 3.2, '🧣', 355],
  ['Running Shorts', 'Apparel', 599, 4.1, '🩳', 160],
  ['Knit Beanie', 'Apparel', 349, 2.8, '🧢', 5],
  ['Linen Kurta', 'Apparel', 1199, 4.6, '👘', 30],
  ['Yoga Leggings', 'Apparel', 899, 4.2, '🧘', 290],
  ['Raincoat Packable', 'Apparel', 1599, 3.0, '🧥', 190],
  ['Polo T-Shirt Pack of 3', 'Apparel', 1099, 3.9, '👕', 150],
  ['one-8 T-shirt pack of 10', 'Apparel', 4500, 3.8, '👕', 150],
  // Footwear
  ['Daily Running Shoes', 'Footwear', 2999, 4.5, '👟', 140],
  ['Leather Formal Shoes', 'Footwear', 3499, 4.1, '👞', 25],
  ['Canvas Sneakers', 'Footwear', 1299, 3.8, '👟', 170],
  ['Trail Hiking Boots', 'Footwear', 4999, 4.7, '🥾', 100],
  ['Rubber Flip-Flops', 'Footwear', 299, 3.3, '🩴', 180],
  ['Women\'s Block Heels', 'Footwear', 1899, 4.0, '👠', 330],
  ['Sports Sandals', 'Footwear', 1099, 4.2, '👡', 150],
  ['Slip-On Loafers', 'Footwear', 1699, 2.7, '👞', 35],
  ['High-Top Basketball Shoes', 'Footwear', 5499, 4.6, '👟', 0],
  ['Fuzzy Home Slippers', 'Footwear', 399, 3.6, '🥿', 310],
  ['Waterproof Rain Boots', 'Footwear', 1599, 3.1, '🥾', 200],
  ['Premium Leather Sneakers', 'Footwear', 8999, 4.9, '👟', 20],
];

const products = seed.map(([name, category, price, rating, emoji, hue], i) => ({
  id: i + 1,
  name,
  category,
  price,
  rating,
  reviews: 40 + ((i * 37) % 900), // deterministic review count
  emoji,
  hue,
}));

module.exports = products;
