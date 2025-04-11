import { sequelize } from "../db.config.js";

export const addSale = async (req, res) => {
    const { customer_id, product_id, price, quantity } = req.body;
    res.send(req.body);
}