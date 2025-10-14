if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')

//routes
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

main().then(() => {
    console.log('connected to DB')
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ShopCart');
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/user/",userRoutes)
app.use("/",productRoutes)

app.listen(8080, () => {
    console.log(`server is running on PORT ${8080}`)
})