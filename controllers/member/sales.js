import { sequelize } from "../../db.config.js";
import moment from "moment";

export const addSale = async (req, res) => {
  try {
    const { user_id, items, totalAmount } = req.body;
    console.log(req.body);
    if (!user_id || !totalAmount) {
      return res.status(400).json({ message: "All fields are required urgent." });
    }
    items.map(async (item) => {
      const { product_id, quantity, price } = item;
      if (!product_id || !quantity || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }
    });

    const currentDate = moment()
      .utcOffset("+05:30")
      .format("YYYY-MM-DD HH:mm:ss");
    const insertQuery = `
      INSERT INTO receipts (user_id, amount, receipt_date)
      VALUES (:user_id, :amount, :receipt_date)`;

    const data = await sequelize.query(insertQuery, {
      replacements: {
        user_id: user_id,
        amount: totalAmount,
        receipt_date: currentDate,
      },
      type: sequelize.QueryTypes.INSERT,
    });

    const receipt_id = data[0];

    items.map(async (item) => {
      const { product_id, quantity, price } = item;
      const insertQuery = `
        INSERT INTO sales (receipt_id, product_id, quantity, price)
        VALUES (:receipt_id, :product_id, :quantity, :price)`;

      await sequelize.query(insertQuery, {
        replacements: {
          receipt_id: receipt_id,
          product_id: product_id,
          quantity: quantity,
          price: price,
        },
        type: sequelize.QueryTypes.INSERT
      });

      // fail hone pe rollback karna hai
    });
    

    // console.log(data);

    res.status(201).json({ message: "Sale recorded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
