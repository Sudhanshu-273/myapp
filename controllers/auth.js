import { QueryError, Sequelize } from "sequelize";
import { sequelize } from "../db.config.js";
// import {bcrypt} from 'bcrypt'

export const user_data = async (req,res) => {
    const [data] = await sequelize.query("SELECT * FROM users");
    console.log(data);
    res.json({"data": data});

}


export const login = async (req, res) => {
    // res.send("Logged in successfully");
    // console.log(body);
    const user = req.body;
    try {
        // const user = req.user;
        console.log(user)
        if(!user){
            return res.status(404).json({
                success:false,
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

        // check hashed password here

        if(password !== data.password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        res.status(200).json( {
            success: true,
            message: "Login successful",
            data: {
                id: user_id,
                email: email,
            },
        })

        // const passwordMatch = bcrypt.compareSync(
        //     password.toString(),
        //     user.password
        //   );
        //   if (!passwordMatch) {
        //     return res.status(401).json({
        //       success: false,
        //       message: "Incorrect password",
        //     });
        //   }
      
          return res.status(200).json({
            success: true,
            message: "Login successful",
          });
      
        
    } catch(error)
    {
        console.log(error);
        return res.status(500).json({
            data: {},
            success:false,
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