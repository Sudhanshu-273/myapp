import { sequelize } from '../db.config.js';  

export const getCustomer = async (req, res) => {
  try {
    // Run the query to get customer names with their account type name
    const [customers] = await sequelize.query(
      `SELECT users.id, users.name, user_accounts.account_type_name 
       FROM users 
       JOIN user_accounts ON users.account_type = user_accounts.account_type_id`
    );

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found.",
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Customers retrieved successfully.",
      data: customers,
    });

  } catch (error) {
    console.error("Error fetching customer data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
