'use strict';

/**
 * Master product inventory (realistic e-commerce dataset with real photography & URLs).
 * Fields: id, name, category, price (INR), rating (0-5), reviews, image, productUrl, emoji, hue
 */
const seed = [
  // --- Electronics ---
  [
    'Wireless Earbuds Pro with ANC',
    'Electronics',
    2499,
    4.5,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    'https://www.amazon.in/dp/B0BDHWDR12',
    '🎧',
    210
  ],
  [
    'Smart Watch Series 9 GPS',
    'Electronics',
    6999,
    4.2,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'https://www.apple.com/watch/',
    '⌚',
    220
  ],
  [
    'Bluetooth Speaker Mini Bass',
    'Electronics',
    1799,
    3.9,
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    'https://www.jbl.com/bluetooth-speakers/',
    '🔊',
    200
  ],
  [
    'RGB Mechanical Keyboard',
    'Electronics',
    3999,
    4.7,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    'https://www.keychron.com/',
    '⌨️',
    230
  ],
  [
    'Ergonomic Gaming Mouse',
    'Electronics',
    1499,
    4.1,
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    'https://www.razer.com/gaming-mice',
    '🖱️',
    240
  ],
  [
    '4K Ultra HD Action Camera',
    'Electronics',
    8999,
    4.4,
    'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?w=600&auto=format&fit=crop&q=80',
    'https://gopro.com/',
    '📷',
    210
  ],
  [
    'Fast-Charging Power Bank 20000mAh',
    'Electronics',
    1299,
    4.0,
    'https://images.unsplash.com/photo-1609592807784-06169d27375a?w=600&auto=format&fit=crop&q=80',
    'https://www.anker.com/',
    '🔋',
    190
  ],
  [
    'Studio Noise Cancelling Headphones',
    'Electronics',
    11999,
    4.8,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://electronics.sony.com/audio/headphones',
    '🎧',
    225
  ],
  [
    '10.1" HD Android Tablet',
    'Electronics',
    13499,
    3.6,
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    'https://www.samsung.com/tablets/',
    '📱',
    215
  ],
  [
    'Minimalist LED Desk Lamp',
    'Electronics',
    899,
    3.4,
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    'https://www.ikea.com/',
    '💡',
    45
  ],
  [
    'Aluminium USB-C Hub 7-in-1',
    'Electronics',
    1999,
    3.8,
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80',
    'https://www.anker.com/',
    '🔌',
    200
  ],
  [
    'Full HD Streaming Webcam',
    'Electronics',
    2199,
    2.9,
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
    'https://www.logitech.com/',
    '📹',
    235
  ],
  [
    'WiFi Smart Home Plug (2-Pack)',
    'Electronics',
    799,
    4.3,
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    'https://www.tp-link.com/',
    '🔌',
    205
  ],
  [
    'Glare-Free E-Reader 6"',
    'Electronics',
    7499,
    4.6,
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80',
    'https://www.amazon.in/kindle',
    '📖',
    210
  ],
  [
    'Qi Fast Wireless Charger Pad',
    'Electronics',
    999,
    2.5,
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80',
    'https://www.belkin.com/',
    '⚡',
    195
  ],
  [
    'Adjustable Laptop Stand Aluminium',
    'Electronics',
    1599,
    4.2,
    'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80',
    'https://www.moft.us/',
    '💻',
    220
  ],

  // --- Apparel ---
  [
    'Classic Heavy Cotton T-Shirt',
    'Apparel',
    499,
    4.0,
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'https://www.nike.com/in/t-shirts',
    '👕',
    10
  ],
  [
    'Slim Fit Stretch Denim Jeans',
    'Apparel',
    1799,
    4.3,
    'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
    'https://www.levi.in/',
    '👖',
    215
  ],
  [
    'Fleece Pullover Hoodie',
    'Apparel',
    1499,
    4.5,
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    'https://www.adidas.co.in/hoodies',
    '🧥',
    280
  ],
  [
    'Formal Tailored Oxford Shirt',
    'Apparel',
    1299,
    3.7,
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
    'https://www.ralphlauren.com/',
    '👔',
    200
  ],
  [
    'Summer Floral Midi Dress',
    'Apparel',
    1999,
    4.4,
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    'https://www.zara.com/',
    '👗',
    340
  ],
  [
    'Down Insulated Puffer Jacket',
    'Apparel',
    3499,
    4.7,
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80',
    'https://www.thenorthface.com/',
    '🧥',
    15
  ],
  [
    'Slim Stretch Cotton Chinos',
    'Apparel',
    1399,
    3.5,
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
    'https://www.dockers.com/',
    '👖',
    35
  ],
  [
    'Merino Wool Winter Scarf',
    'Apparel',
    699,
    3.2,
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    'https://www.burberry.com/',
    '🧣',
    355
  ],
  [
    'Breathable Running Shorts',
    'Apparel',
    599,
    4.1,
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80',
    'https://www.nike.com/in/shorts',
    '🩳',
    160
  ],
  [
    'Warm Ribbed Knit Beanie',
    'Apparel',
    349,
    2.8,
    'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&auto=format&fit=crop&q=80',
    'https://www.carhartt.com/',
    '🧢',
    5
  ],
  [
    'Handloom Pure Linen Kurta',
    'Apparel',
    1199,
    4.6,
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    'https://www.fabindia.com/',
    '👘',
    30
  ],
  [
    'High-Waist Yoga Leggings',
    'Apparel',
    899,
    4.2,
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80',
    'https://shop.lululemon.com/',
    '🧘',
    290
  ],
  [
    'Waterproof Packable Raincoat',
    'Apparel',
    1599,
    3.0,
    'https://images.unsplash.com/photo-1544022613-e87ce7526edb?w=600&auto=format&fit=crop&q=80',
    'https://www.patagonia.com/',
    '🧥',
    190
  ],
  [
    'Classic Pique Polo T-Shirt (Pack of 3)',
    'Apparel',
    1099,
    3.9,
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    'https://www.lacoste.com/',
    '👕',
    150
  ],
  [
    'Athletic Training Tees (Pack of 5)',
    'Apparel',
    1899,
    4.3,
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'https://in.puma.com/',
    '👕',
    150
  ],

  // --- Footwear ---
  [
    'Air Cushion Daily Running Shoes',
    'Footwear',
    2999,
    4.5,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'https://www.nike.com/in/running',
    '👟',
    140
  ],
  [
    'Derby Leather Formal Shoes',
    'Footwear',
    3499,
    4.1,
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
    'https://www.clarks.in/',
    '👞',
    25
  ],
  [
    'Low-Top Canvas Sneakers',
    'Footwear',
    1299,
    3.8,
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    'https://www.vans.com/',
    '👟',
    170
  ],
  [
    'All-Terrain Trail Hiking Boots',
    'Footwear',
    4999,
    4.7,
    'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    'https://www.timberland.com/',
    '🥾',
    100
  ],
  [
    'Comfort Beach Flip-Flops',
    'Footwear',
    299,
    3.3,
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=80',
    'https://www.havaianas.com/',
    '🩴',
    180
  ],
  [
    'Elegant Suede Block Heels',
    'Footwear',
    1899,
    4.0,
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    'https://www.aldoshoes.com/',
    '👠',
    330
  ],
  [
    'Cushioned Sport Sandals',
    'Footwear',
    1099,
    4.2,
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80',
    'https://www.crocs.in/',
    '👡',
    150
  ],
  [
    'Italian Penny Loafers',
    'Footwear',
    1699,
    2.7,
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    'https://www.gucci.com/',
    '👞',
    35
  ],
  [
    'High-Top Retro Basketball Shoes',
    'Footwear',
    5499,
    4.6,
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    'https://www.nike.com/in/jordan',
    '👟',
    240
  ],
  [
    'Memory Foam House Slippers',
    'Footwear',
    399,
    3.6,
    'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&auto=format&fit=crop&q=80',
    'https://www.ugg.com/',
    '🥿',
    310
  ],
  [
    'Rubber Waterproof Rain Boots',
    'Footwear',
    1599,
    3.1,
    'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=600&auto=format&fit=crop&q=80',
    'https://www.hunterboots.com/',
    '🥾',
    200
  ],
  [
    'Luxury White Leather Sneakers',
    'Footwear',
    8999,
    4.9,
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    'https://www.commonprojects.com/',
    '👟',
    20
  ],
];

const products = seed.map(([name, category, price, rating, image, productUrl, emoji, hue], i) => ({
  id: i + 1,
  name,
  category,
  price,
  rating,
  reviews: 40 + ((i * 37) % 900),
  image,
  productUrl,
  emoji,
  hue,
}));

module.exports = products;
