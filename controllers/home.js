import { sequelize } from "../db.config.js";

export const home = async (req, res) => {

    res.json({ "message": "Welcome to the home page" });
}

export const getAllEquipment = async (req, res) => {
    try {
        const [data] = await sequelize.query("SELECT * FROM gym_equipments");
        res.json({ "data": data });
    } catch (error) {
        console.error("Error fetching equipment data: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}
