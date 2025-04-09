import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import axios from "axios";
import homeRoutes from './routes/home.js'
import { middle } from "./middlewares/middle.js";
const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());


app.get("/",middle, homeRoutes);

app.get("/joke", async (req, res) => {
    const response = await axios.get("https://catfact.ninja/fact");
    res.send(response.data.fact);
})

app.post("/add", (req, res) => {
    console.log("Data jo aaya ------->", req.body);
    res.status(201).json({ "data": "Posted Successfully" });
});


app.listen(8080, (req, res) => {
    console.log("Server up and running on " + process.env.DEV_PORT);
})