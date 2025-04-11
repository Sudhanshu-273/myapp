import { sequelize } from "../db.config.js";
import moment from "moment";

export const addSale = async (req, res) => {
    const { customer_id, product_id, price, quantity } = req.body;

    if (!customer_id || !product_id || !price || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const currentDate = moment().format("YYYY-MM-DD");

    const insertQuery = `
        INSERT INTO sales (customer_id, product_id, price, quantity, date)
        VALUES (:customer_id, :product_id, :price, :quantity, :date)
    `;

    try {
        await sequelize.query(insertQuery, {
            replacements: {
                customer_id,
                product_id,
                price,
                quantity,
                date: currentDate,
            },
            type: sequelize.QueryTypes.INSERT,
        });

        res.status(201).json({ message: "Sale recorded successfully" });
    } catch (error) {
        console.error("Error inserting sale:", error);
        res.status(500).json({ message: "Server error" });
    }
};
