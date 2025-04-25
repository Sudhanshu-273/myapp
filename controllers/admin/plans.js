import { sequelize } from "../../db.config.js";

export const getPlan = async (req, res) => {
  res.status(200).json({ message: "Plan fetched successfully" });
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
