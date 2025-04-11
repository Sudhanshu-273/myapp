import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import homeRoutes from './routes/home.js'
import { middle } from "./middlewares/middle.js";
import { sequelize } from './db.config.js'
import authRoutes from './routes/auth.js'
import { verifyToken } from "./middlewares/auth.js";
import salesRoutes from './routes/sales.js'
import purchasesRoutes from './routes/purchases.js'
import productsRoutes from './routes/products.js'


// express app initialize hua hai

const app = express()


// sequelize connect kia hai

sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("Error connecting to database: ", err);
    });

// middleware use kia hai basic wale saare

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.json());

// routes use kia hai yaha pe

app.use("/auth", authRoutes)
app.use("/sale", salesRoutes);
app.use("/purchases", purchasesRoutes);
app.use("/products", productsRoutes);
// app.use("/", verifyToken, homeRoutes);


// server idhar fire hua hai


app.listen(8080, (req, res) => {
    console.log("Server up and running on " + process.env.DEV_PORT);
})