import { sequelize } from "../db.config.js";

export const addProduct = async (req, res) => {
    const { title, price } = req.body;
    res.send(req.body);
}