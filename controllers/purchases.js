import { sequelize } from "../db.config.js";

export const addPurchase = async (req, res) => {
    const { product_id, product_name, price, quantity, newProduct } = req.body;
    res.send(req.body);
}