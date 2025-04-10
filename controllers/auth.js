import bcrypt from "bcrypt";
import {sequelize} from "../db.config.js";


export const login = (req, res) => {
    res.send("Logged in");
}

export const register = async (req, res) => {

    try {
        const { name, password, confirmPassword} = req.body;

        if (!name || !password || !confirmPassword) {
            return res.status(400).json({ message: "Name, password, and confirmPassword are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }


        const [existingUser] = await sequelize.query("SELECT * FROM users WHERE name = :name", {
            replacements: { name },
            type: sequelize.QueryTypes.SELECT
        });

        // console.log(existingUser);

        if (existingUser) {
            return res.status(409).json({ message: "User already registered" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await sequelize.query(
            "INSERT INTO users (name, password) VALUES (:name, :hashedPassword)",
            {
                replacements: { name, hashedPassword },
            }
        );

        console.log('User created successfully:', result);

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error('Error during registration:', error);

        if (error instanceof Error) {
            return res.status(500).json({ message: "Server error, please try again later" });
        }

        return res.status(500).json({ message: "Database error, please try again later" });
    }
    
    
}