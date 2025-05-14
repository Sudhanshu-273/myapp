import { sequelize } from "../../db.config";

export const trainers = async (req, res) => {
    try {
        const getTrainersSQL = "select * from users where account_type = 2";
        const [data] = await sequelize.query(getTrainersSQL);
        res.status(200).json({
            status: true,
            message: "Trainers fetched",
            data: data
        });
    } catch (error) {
        console.log(error);
    }
}