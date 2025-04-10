import { sequelize } from "../db.config.js";

export const home = async (req, res) => {
    const [data] = await sequelize.query("SELECT * FROM muscle_group");
    console.log(data)
    res.json({"data" : data});
}
