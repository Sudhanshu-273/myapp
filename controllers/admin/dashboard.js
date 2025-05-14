import { sequelize } from "../../db.config.js";
import { formatNumber, calculatePercentageChange } from "../../utils/format.js";
import moment from "moment";

const sendSuccessResponse = (res, data, message = "Success") => {
  return res.status(200).json({ message, ...data });
};

export const getSalesDetails = async (req, res) => {
  console.log("salesss");
  try {
    // Weekly Sales
    const [weeklySalesResult] = await sequelize.query(`
      SELECT 
        SUM(amount) AS total_sales, 
        SUM(CASE 
          WHEN receipt_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
          THEN amount ELSE 0 END
        ) AS weekly_sales
      FROM receipts
    `);

    const total_sales = weeklySalesResult[0].total_sales || 0;
    const weekly_sales = formatNumber(weeklySalesResult[0].weekly_sales || 0);

    // Monthly Sales
    const [monthlySalesResult] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(receipt_date, '%Y-%m') AS month,
        SUM(amount) AS total_sales
      FROM receipts
      GROUP BY month
      ORDER BY month ASC
    `);

    const salesMap = {};
   monthlySalesResult.forEach(row => {
   salesMap[row.month] = formatNumber(row.total_sales || 0);
});

  const currentYear = moment().year();
  const monthsWithData = Array.from({ length: 12 }, (_, index) => {
  const monthKey = `${currentYear}-${(index + 1).toString().padStart(2, '0')}`;
  return salesMap[monthKey] || 0;
});

    // Percent Change
    const [salesPercentResult] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(receipt_date, '%Y-%m') AS month,
        SUM(amount) AS total_sales
      FROM receipts
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `);

    let percentage_change = null;
    let current_month_sales = null;
    let previous_month_sales = null;

    if (salesPercentResult.length >= 2) {
      const current = salesPercentResult[0].total_sales;
      const previous = salesPercentResult[1].total_sales;
      percentage_change = `${calculatePercentageChange(current, previous).toFixed(2)}`;
      current_month_sales = formatNumber(current);
      previous_month_sales = formatNumber(previous);
    }

    return sendSuccessResponse(res, {
      total_sales,
      weekly_sales,
      monthsWithData,
      percentage_change,
      current_month_sales,
      previous_month_sales
    }, "All sales details fetched successfully");
  } catch (error) {
    console.error("Error fetching sales details:", error);
    return res.status(500).json({ message: "Failed to fetch sales details", error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    // Weekly Users
    const [weeklyUserResult] = await sequelize.query(`
      SELECT 
        COUNT(*) AS total_users,
        COUNT(CASE 
          WHEN registered_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()
        THEN 1 END) AS weekly_users
      FROM users
    `);

    const total_users = weeklyUserResult[0].total_users;
    const weekly_users = formatNumber(weeklyUserResult[0].weekly_users);

    // Monthly Users
    const [monthlyUserResult] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(registered_date, '%Y-%m') AS month,
        COUNT(*) AS user_count
      FROM users
      GROUP BY month
      ORDER BY month ASC
    `);

    const userMap = {};
  monthlyUserResult.forEach(row => {
    userMap[row.month] = Number(row.user_count);
  });

// Set your desired year
  const currentYear = moment().year(); // Or any year like 2025

// Generate array for Jan–Dec of that year
  const monthly_users = Array.from({ length: 12 }, (_, index) => {
  const monthKey = `${currentYear}-${(index + 1).toString().padStart(2, '0')}`;
  return userMap[monthKey] || 0;
});


    // User Percent Change
    const [userPercentResult] = await sequelize.query(`
      SELECT 
        DATE_FORMAT(registered_date, '%Y-%m') AS month,
        COUNT(*) AS user_count
      FROM users
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `);

    let user_percentage_change = null;

    if (userPercentResult.length >= 2) {
      const current = userPercentResult[0].user_count;
      const previous = userPercentResult[1].user_count;
      user_percentage_change = `${calculatePercentageChange(current, previous).toFixed(2)}`;
    }

    return sendSuccessResponse(res, {
      total_users,
      weekly_users,
      monthly_users,
      user_percentage_change
    }, "All user details fetched successfully");
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Failed to fetch user details", error: error.message });
  }
};

export const topProducts = async (req, res) => {
  try {
    const topProductsSQL = "select s.product_id, p.name, SUM(s.price) as amount from sales s inner join products p on s.product_id=p.id group by s.product_id order by amount desc;";
    const [data] = await sequelize.query(topProductsSQL);
    console.log(data);
    res.status(200).json({
      status: true,
      message: "Top products fetched",
      data: data
    });
  } catch (error) {
    console.log(error);
    res.satus(500).json({
      status: false,
      message: error,
    })
  }

}
