import { sequelize } from "../../db.config.js";

export const getPlan = async (req, res) => {
  const { name, duration } = req.body;

  if (!name || !duration) {
    return res.status(400).json({ message: "Name and duration are required." });
  }

  try {
    const [results] = await sequelize.query(
      `
     select price from plans 
      `,
      {
        replacements: { name, duration },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log(results.price);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No matching plan found." });
    }

    res.status(200).json({
      message: "Plan details fetched successfully",
      price: results.price
    });
  } catch (error) {
    console.error("Error fetching plan details:", error);
    res.status(500).json({
      message: "Failed to fetch plan details",
      error: error.message,
    });
  }
};


export const addPlan = async (req, res) => {
  
  res.status(201).json({ message: "Plan added successfully" });
};

export const updatePlan = async (req, res) => {
  res.status(200).json({ message: "Plan updated successfully" });
};

export const deletePlan = async (req, res) => {
  res.status(200).json({ message: "Plan deleted successfully" });
};
