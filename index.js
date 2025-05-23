import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import homeRoutes from "./routes/home.js";
import { middle } from "./middlewares/middle.js";
import { sequelize } from "./db.config.js";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middlewares/auth.js";
import session from "express-session";
import './cron.js'

import salesRoutes from "./routes/admin/sales.js";
import purchasesRoutes from "./routes/admin/purchases.js";
import productsRoutes from "./routes/admin/products.js";
import userRoutes from "./routes/user.js";
import customerRoutes from "./routes/member/customer.js";
import plansRoutes from "./routes/admin/plans.js";
import dashboardRoutes from "./routes/admin/dashboard.js";

// express app initialize hua hai

const app = express();

// sequelize connect kia hai

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log(process.env.DB_NAME);
        console.log("Error connecting to database: ", err);
    });

// middleware use kia hai basic wale saare



app.use(cors({
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 300000 }, // Optional: session expires in 5 minutes
    }),
);

app.use((req, res, next) => {
    console.log("middle called")
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

// routes use kia hai yaha pe

app.use("/auth", authRoutes);
app.use("/member/sale", salesRoutes);
app.use("/member/customer", customerRoutes);
app.use("/admin/purchases", purchasesRoutes);
app.use("/admin/products", productsRoutes);
app.use('/admin/plans', plansRoutes);
app.use('/admin/dashboard', dashboardRoutes)
app.use("/user", userRoutes);
app.use("/", homeRoutes);

// server idhar fire hua hai

app.listen(8080, (req, res) => {
    console.log("Server up and running on http://localhost:" + process.env.DEV_PORT);
});
