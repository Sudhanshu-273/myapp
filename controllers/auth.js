import { QueryError, Sequelize } from "sequelize";
import { sequelize } from "../db.config.js";
import jwt from "jsonwebtoken";
// import {bcrypt} from 'bcrypt'

export const user_data = async (req, res) => {
    const [data] = await sequelize.query("SELECT * FROM users");
    console.log(data);
    res.json({ "data": data });

}


export const login = async (req, res) => {
    const user = req.body;
    try {
        console.log(user)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found.",
            })
        }
        const { email, password } = user;

        const [[data], m1] = await sequelize.query("select * from users where email = :email", {
            replacements: {
                email: email,
            }
        })

        console.log(data);

        const user_id = data.id;


        if (password !== data.password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // res.status(200).json({
        //     success: true,
        //     message: "Login successful",
        //     data: {
        //         id: user_id,
        //         email: email,
        //     },
        // })

        const token = jwt.sign({
            id: user_id
        }, process.env.JWT_SECRET, {
            expiresIn: '9999h'
        });

        res.status(201).json({
            success: true,
            email: email,
            token: token,
            message: "Login successful",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "some error occured",
        })
    }
}

export const register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
}