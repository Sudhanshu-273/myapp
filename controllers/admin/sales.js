import { sequelize } from "../../db.config.js";
import moment from "moment";

export const addSale = async (req, res) => {
    const { customer_id, product_id, totalAmount, quantity } = req.body;

    if (!customer_id || !product_id || !totalAmount || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const currentDate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

    const insertQuery = `
        INSERT INTO sales (customer_id, product_id, totalAmount, quantity, sale_date)
        VALUES (:customer_id, :product_id, :totalAmount, :quantity, :sale_date)
    `;

    try {
        await sequelize.query(insertQuery, {
            replacements: {
                customer_id,
                product_id,
                totalAmount,
                quantity,
                sale_date: currentDate,
            },
            type: sequelize.QueryTypes.INSERT,
        });

        res.status(201).json({ message: "Sale recorded successfully" });
    } catch (error) {
        console.error("Error inserting sale:", error);
        res.status(500).json({ message: "Server error" });
    }
};

