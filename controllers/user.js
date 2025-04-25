import { sequelize } from "../db.config.js";
import bcrypt from "bcrypt";
export const updateUser = async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;

    if (!id || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "User ID, email, and phone are required.",
      });
    }

    const [user] = await sequelize.query(`SELECT * FROM users WHERE id = :id`, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updateFields = {};

    // Check for email change
    if (email !== user.email) {
      updateFields.email = email;
      updateFields.verified = 0;
    }

    // Check for phone change
    if (phone !== user.phone) {
      updateFields.phone = phone;
    }

    if (name !== user.name) {
      updateFields.name = name;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes needed. User is already up to date.",
      });
    }

    const setClause = Object.keys(updateFields)
      .map((key) => `${key} = :${key}`)
      .join(", ");

    await sequelize.query(`UPDATE users SET ${setClause} WHERE id = :id`, {
      replacements: { id, ...updateFields },
      type: sequelize.QueryTypes.UPDATE,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating user.",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required.",
      });
    }

    const [user] = await sequelize.query(
      `SELECT id, email, password FROM users WHERE email = :email`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email.",
      });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sequelize.query(
      `UPDATE users SET password = :hashedPassword WHERE id = :id`,
      {
        replacements: {
          id: user.id,
          hashedPassword,
        },
        type: sequelize.QueryTypes.UPDATE,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};
