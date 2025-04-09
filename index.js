import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import axios from "axios";
const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());


app.get("/", (req, res) => {
    res.json({ "data": "Hi I am running" });
})

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