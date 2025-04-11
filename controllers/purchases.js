import { sequelize } from "../db.config.js";
import moment from "moment";

export const addPurchase = async (req, res) => {
    const { product_id, price, quantity } = req.body;

    // Basic validation
    if (!product_id || !price || !quantity) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const date = moment().format("YYYY-MM-DD");

        const insertQuery = `
            INSERT INTO purchases (product_id, price, quantity, date)
            VALUES (:product_id, :price, :quantity, :date)
        `;

        await sequelize.query(insertQuery, {
            replacements: { product_id, price, quantity, date },
        });

        return res.status(201).json({ message: "Purchase added successfully" });
    } catch (error) {
        console.error("[Purchase Error]", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
