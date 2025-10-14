let allProducts = [
    {
        "title": "Leather Office Chair",
        "description": "Ergonomic leather chair with lumbar support, adjustable height, and 360° swivel.",
        "price": 249.50,
        "stock": 30,
        "image": [
            { "filename": "ShopCart/officechair_blk1", "url": "https://m.media-amazon.com/images/I/81Ef-Jgq+PL._SX679_.jpg" },
            { "filename": "ShopCart/officechair_blk2", "url": "https://m.media-amazon.com/images/I/71UfggX4VML._SX679_.jpg" }
        ],
        "category": "Furniture"
    },

    {
        "title": "Wireless Bluetooth Headphone",
        "description": "Over-ear wireless Bluetooth headphones with noise cancellation, built-in microphone, and 30-hour battery life.",
        "price": 179.99,
        "stock": 45,
        "image": [
            { "filename": "ShopCart/headphone_blk1", "url": "https://m.media-amazon.com/images/I/41lArSiD5hL._SX466_.jpg" },
            { "filename": "ShopCart/headphone_blk2", "url": "https://m.media-amazon.com/images/I/71TvdUf4kyL._SX466_.jpg" }
        ],
        "category": "Electronics"
    },

    {
        "title": "Running Shoes",
        "description": "Lightweight and breathable running shoes with cushioned soles, anti-slip grip, and 360° flexibility for optimal comfort.",
        "price": 89.99,
        "stock": 60,
        "image": [
            { "filename": "ShopCart/runshoes_red1", "url": "https://m.media-amazon.com/images/I/71QXHLcLAGL._SX625_.jpg" },
            { "filename": "ShopCart/runshoes_red2", "url": "https://m.media-amazon.com/images/I/61ROjv-D49L._SY625_.jpg" },
            { "filename": "ShopCart/runshoes_red3", "url": "https://m.media-amazon.com/images/I/51bA3EoyaRL._SY695_.jpg" }
        ],
        "category": "Footwear"
    },

    {
        "title": "Stainless Steel Water Bottle",
        "description": "Durable double-wall stainless steel water bottle with vacuum insulation, leak-proof lid, and 360° easy-grip design to keep drinks hot or cold for hours.",
        "price": 29.99,
        "stock": 75,
        "image": [
            { "filename": "ShopCart/waterbottle_ss1", "url": "https://m.media-amazon.com/images/I/71M3gfjIkDL._AC_UL480_FMwebp_QL65_.jpg" }
        ],
        "category": "Accessories"
    },

    {
        "title": "Smart LED Desk Lamp",
        "description": "Adjustable LED desk lamp with 5 brightness levels, touch controls, and built-in USB charging port.",
        "price": 59.99,
        "stock": 40,
        "image": [
            { "filename": "ShopCart/desklamp_led1", "url": "https://m.media-amazon.com/images/I/61JeyD0QXuL._AC_UL480_FMwebp_QL65_.jpg" },
            { "filename": "ShopCart/desklamp_led2", "url": "https://m.media-amazon.com/images/I/61zPESnuY2L._AC_UL480_FMwebp_QL65_.jpg" }
        ],
        "category": "Lighting"
    },

    {
        "title": "Ergonomic Keyboard",
        "description": "Split design ergonomic keyboard with soft-touch keys and wrist rest for comfortable long typing sessions.",
        "price": 99.99,
        "stock": 35,
        "image": [
            { "filename": "ShopCart/keyboard_erg1", "url": "https://m.media-amazon.com/images/I/61oNUQ-IbHL._AC_UY327_FMwebp_QL65_.jpg" },
            { "filename": "ShopCart/keyboard_erg2", "url": "https://m.media-amazon.com/images/I/7138-thYO9L._AC_UY327_FMwebp_QL65_.jpg" }
        ],
        "category": "Electronics"
    },

    {
        "title": "Portable Bluetooth Speaker",
        "description": "Compact waterproof Bluetooth speaker with deep bass, 12-hour battery life, and 360° sound projection.",
        "price": 79.99,
        "stock": 50,
        "image": [
            { "filename": "ShopCart/speaker_bt1", "url": "https://m.media-amazon.com/images/I/71ur52HJ8cL._AC_UY327_FMwebp_QL65_.jpg" },
            { "filename": "ShopCart/speaker_bt2", "url": "https://m.media-amazon.com/images/I/71b122pwbpL._AC_UY327_FMwebp_QL65_.jpg" }
        ],
        "category": "Electronics"
    },

    {
        "title": "Gaming Mouse Pad XL",
        "description": "Extra-large RGB gaming mouse pad with smooth surface, anti-slip rubber base, and customizable lighting modes.",
        "price": 39.99,
        "stock": 65,
        "image": [
            { "filename": "ShopCart/mousepad_rgb1", "url": "https://m.media-amazon.com/images/I/71+z-1d6j8L._AC_UY327_FMwebp_QL65_.jpg" },
            { "filename": "ShopCart/mousepad_rgb2", "url": "https://m.media-amazon.com/images/I/51ofb1-sFxL._AC_UY327_FMwebp_QL65_.jpg" }
        ],
        "category": "Gaming Accessories"
    },

    {
        "title": "Travel Backpack",
        "description": "Water-resistant travel backpack with multiple compartments, USB charging port, and padded laptop sleeve.",
        "price": 69.99,
        "stock": 55,
        "image": [
            { "filename": "ShopCart/backpack_travel1", "url": "https://m.media-amazon.com/images/I/81Bdhfm7UuL._AC_UY327_FMwebp_QL65_.jpg" },
            { "filename": "ShopCart/backpack_travel2", "url": "https://m.media-amazon.com/images/I/71BThmdKXWL._AC_UY327_FMwebp_QL65_.jpg" }
        ],
        "category": "Bags & Travel"
    }

]

module.exports = { products: allProducts }