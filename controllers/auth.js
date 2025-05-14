import { QueryError, Sequelize } from "sequelize";
import { sequelize } from "../db.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import moment from "moment";

export const user_data = async (req, res) => {
    const [data] = await sequelize.query("SELECT * FROM users");
    console.log(data);
    res.json({ data: data });
};

export const login = async (req, res) => {
    const user = req.body;
   
    try {
        // console.log(user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found in req body.",
            });
        }
        const { email, password } = user;

        const [[data], m1] = await sequelize.query(
            "select users.id, users.name, users.email, users.phone,users.password,  users.account_status, users.verified, user_accounts.title from users inner join user_accounts on users.account_type = user_accounts.id where users.email = :email",
            {
                replacements: {
                    email: email,
                },
            },
        );

        console.log(data);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not Found.",
            });
        }

        const user_id = data.id;

        if (!(await bcrypt.compare(password, data.password))) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // for update time
        await sequelize.query( `Update users set last_login_time = NOW() where id = ${user_id}`);
        const token = jwt.sign(
            {
                id: user_id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "9999h",
            },
        );
        console.log(data);
        res.status(200).json({
            data: data,
            success: true,
            token: token,
            message: "Login successful",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "some error occured : " + error,
        });
    }
};

export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, accountType } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "email, password, and confirmPassword are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const [existingUser] = await sequelize.query(
            "SELECT * FROM users WHERE email = :email",
            {
                replacements: { email },
            },
        );

        console.log("Existing user:", existingUser);

        if (existingUser.length) {
            return res.status(409).json({ message: "User already registered" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const registered_date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

        const result = await sequelize.query(
            "INSERT INTO users (email, password, account_type, registered_date) VALUES (:email, :password, :account_type, :registered_date)",
            {
                replacements: {
                    email: email,
                    password: hashedPassword,
                    account_type: accountType,
                    registered_date: registered_date,
                },
            },
        );

        console.log("User created successfully:", result);

        return res
            .status(201)
            .json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);

        if (error instanceof Error) {
            return res
                .status(500)
                .json({ message: "Server error, please try again later" });
        }

        return res
            .status(500)
            .json({ message: "Database error, please try again later" });
    }
};

export const generateOtp = () => {
    return Math.floor(Math.random() * 900000) + 100000;
};

export const sendOtp = async (req, res) => {
    const { email } = req.body;

    console.log(process.env.MAIL_USER);

    const [[user]] = await sequelize.query(
        "select * from users where email = :email",
        {
            replacements: {
                email: email,
            },
        },
    );

    console.log(user);
    if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found with the provided email.",
        });
      }

    const otp = generateOtp();

    // window.localStorage.setItem("otp", otp);
    req.session.otp = otp;

    const html_text = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">My Gym App</a>
    </div>
    <p style="font-size:1.1em">Hi ${user.name},</p>
    <p>Thank you for registering on My Gym App. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Sudhanshu Chaubey</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>My Gym App</p>
    </div>
  </div>
</div>`;

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    try {
        await mailTransporter.sendMail({
            from: "mygymm@gmail.com",
            to: email,
            subject: "Otp",
            html: html_text,
        });

        res.send({
            success: true,
            message: "Email sent successfully",
            otp: otp,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};

export const verifyOtp = async (req, res) => {
    const { user_id, email, otp } = req.body;
    const storedOtp = req.session.otp;
    console.log(storedOtp, otp);
    if (!storedOtp) {
        return res.status(401).json({
            success: false,
            message: "Otp not found",
        });
    }
    if (storedOtp != otp) {
        return res.status(401).json({
            success: false,
            message: "Incorrect otp",
        });
    }

    try {
        const result = await sequelize.query(
            "update users set verified = 1 where email = :email",
            {
                replacements: {
                    email: email,
                },
            },
        );
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "OTP Cannot be Verified. Try Again Later",
        });
    }

    console.log("User verified successfully:");

    // verify user code

    return res.status(200).json({
        success: true,
        message: "User verified",
    });
};
