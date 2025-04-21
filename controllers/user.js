import { sequelize } from "../db.config.js";

export const updateUser = async (req, res) => {
  try {
    const { id, name } = req.body;

    // Validate required fields
    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "User ID and name are required.",
      });
    }

    // Check if user exists
    const [user] = await sequelize.query(
      `SELECT * FROM users WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update name only
    await sequelize.query(
      `UPDATE users SET name = :name WHERE id = :id`,
      {
        replacements: { id, name },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "User name updated successfully.",
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
