const mongoose = require("mongoose")
const { Schema, model } = mongoose

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    image: [{

        filename: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        }

    }],

    category: {
        type: String,
        required: true
    }

})

const Product = model("Product", productSchema)

module.exports = Product