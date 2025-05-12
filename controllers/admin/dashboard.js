import { sequelize } from "../../db.config.js";
import { formatNumber, calculatePercentageChange } from "../../utils/format.js";

const sendSuccessResponse = (res, data, message = "Success") => {
  return res.status(200).json({ message, ...data });
};

export const getWeeklySales = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        SUM(amount) AS total_sales, 
        SUM(CASE 
          WHEN receipt_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
          THEN amount ELSE 0 END
        ) AS weekly_sales
      FROM receipts
    `);

    const total_sales = (result[0].total_sales || 0);
    const weekly_sales = formatNumber(result[0].weekly_sales || 0);

    return sendSuccessResponse(res, { total_sales, weekly_sales }, "Weekly sales fetched successfully");
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    return res.status(500).json({ message: "Failed to fetch weekly sales", error: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(receipt_date, '%Y-%m') AS month,
        SUM(amount) AS total_sales
      FROM receipts
      GROUP BY month
      ORDER BY month ASC
    `);

    const monthly_sales = result.map(row => formatNumber(row.total_sales || 0));
    return sendSuccessResponse(res, { monthly_sales }, "Monthly sales fetched successfully");
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    return res.status(500).json({ message: "Failed to fetch monthly sales", error: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(receipt_date, '%Y-%m') AS month,
        SUM(amount) AS total_sales
      FROM receipts
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `);

    if (result.length < 2) {
      return sendSuccessResponse(res, { percentage_change: null }, "Not enough data to calculate percentage change.");
    }

    const current = result[0].total_sales;
    const previous = result[1].total_sales;
    const percentage_change = calculatePercentageChange(current, previous);

    return sendSuccessResponse(res, {
      percentage_change: `${percentage_change.toFixed(2)}%`,
      current_month_sales: formatNumber(current),
      previous_month_sales: formatNumber(previous)
    }, "Percentage change fetched successfully");
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return res.status(500).json({ message: "Failed to fetch sales data", error: error.message });
  }
};

export const getWeeklyUser = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        COUNT(*) AS total_users,
        COUNT(CASE 
          WHEN registered_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
        THEN 1 END) AS weekly_users
      FROM users
    `);

    return sendSuccessResponse(res, {
      total_users: (result[0].total_users),
      weekly_users: formatNumber(result[0].weekly_users)
    }, "User statistics fetched successfully");
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ message: "Failed to fetch user stats", error: error.message });
  }
};

export const getMonthlyUser = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(registered_date, '%Y-%m') AS month,
        COUNT(*) AS user_count
      FROM users
      GROUP BY month
      ORDER BY month ASC
    `);

    const monthly_users = result.map(row => row.user_count);
    return sendSuccessResponse(res, { monthly_users }, "Monthly user count fetched successfully");
  } catch (error) {
    console.error("Error fetching monthly users:", error);
    return res.status(500).json({ message: "Failed to fetch monthly users", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const [result] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(registered_date, '%Y-%m') AS month,
        COUNT(*) AS user_count
      FROM users
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `);

    if (result.length < 2) {
      return sendSuccessResponse(res, { percentage_change: null }, "Not enough data to calculate percentage change.");
    }

    const current = result[0].user_count;
    const previous = result[1].user_count;
    const percentage_change = calculatePercentageChange(current, previous);

    return sendSuccessResponse(res, {
      percentage_change: `${percentage_change.toFixed(2)}%`
    }, "Percentage change in user registration fetched successfully");
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ message: "Failed to fetch user statistics", error: error.message });
  }
};
