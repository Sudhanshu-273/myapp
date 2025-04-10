import { sequelize } from "../db.config.js";

export const home = async (req, res) => {

    console.log(req.user);

    const [data] = await sequelize.query("SELECT * FROM users where id = :id", {
        replacements: {
            id: req.user.id,
        }
    });

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
