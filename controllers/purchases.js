import { sequelize } from "../db.config.js";
import moment from "moment";

export const addPurchase = async (req, res) => {
    const { product_id, price, quantity, total_amount } = req.body;

    // Basic validation
    if (!product_id || !price || !quantity || !total_amount) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const date = moment().format("YYYY-MM-DD");

        const insertQuery = `
            INSERT INTO purchases (product_id, quantity, price, total_amount, date)
            VALUES (:product_id, :quantity, :price,:total_amount, :date)
        `;

        await sequelize.query(insertQuery, {
            replacements: { product_id, quantity, price,total_amount, date },
        });

        return res.status(201).json({ message: "Purchase added successfully" });
    } catch (error) {
        console.error("[Purchase Error]", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProduct = async (req, res) => {
  try {
    const [products] = await sequelize.query(`
      SELECT *
      FROM products 
    `);

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found with purchases.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Unknown error",
    });
  }
};
