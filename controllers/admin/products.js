import { sequelize } from "../../db.config.js";

export const addProduct = async (req, res) => {
  const { title, price } = req.body;
  res.send(req.body);
};

export const getProducts = async (req, res) => {
  const query = `SELECT * FROM products`;

  try {
    const products = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
