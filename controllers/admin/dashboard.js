import { sequelize } from "../../db.config.js";
export const getWeeklySales = async (req, res) => {
    return res.status(200).json({ message: "working"});
}

export const getMonthlySales = async (req, res) => {
    return res.status(200).json({ message: "working"});
}

export const getSales = async(req, res) => {
    return res.status(200).json({ message: "working"});
}
