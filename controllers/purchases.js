import { sequelize } from "../db.config.js";

export const addPurchase = async (req, res) => {
    const { product_id, price, quantity } = req.body;
    res.send(req.body);
}