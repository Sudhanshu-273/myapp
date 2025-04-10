import { sequelize } from "../db.config.js";

export const home = async (req, res) => {
    const [data] = await sequelize.query("SELECT * FROM muscle_group where id = :id", {
        replacements: {
            id: 1,
        }
    });
    console.log(data)
    res.json({ "data": data });
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