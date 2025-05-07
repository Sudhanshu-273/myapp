import { sequelize } from "../../db.config.js";
export const getWeeklySales = async (req, res) => {
    try {
    const [result] = await sequelize.query(
      `
       SELECT 
        SUM(amount) AS total_sales, 
        SUM(CASE WHEN YEARWEEK(receipt_date, 1) = YEARWEEK(CURDATE(), 1) THEN amount ELSE 0 END) AS weekly_sales
      FROM receipts
      ` 
    );
    let amount = result[0].weekly_sales || 0;
    let formattedTotal = 0;

    if (amount >= 1000000) {
      formattedTotal = (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      formattedTotal = (amount / 1000).toFixed(1) + 'K';
    } else {
      formattedTotal = amount;
    }
    return res.status(200).json({
      message: "Weekly sales fetched successfully",
      total_aomunt: formattedTotal,
      weekly_sales: result[0].weekly_sales,
      total_sales:result[0].total_sales,

    });
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    return res.status(500).json({
      message: "Failed to fetch monthly sales",
      error: error.message,
    });
  }
}

export const getMonthlySales = async (req, res) => {
  try {
    const [result] = await sequelize.query(
      `
     SELECT 
        SUM(amount) AS total_sales
      FROM receipts
      GROUP BY DATE_FORMAT(receipt_date, '%Y-%m')
      ORDER BY DATE_FORMAT(receipt_date, '%Y-%m') DESC
      `
    );

    const monthlySales = result.map(row => row.total_sales);

    res.status(200).json({
      message: "Monthly sales fetched successfully",
      monthly_sales: monthlySales,
    });
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    return res.status(500).json({
      message: "Failed to fetch monthly sales",
      error: error.message,
    });
  }
};

export const getSales = async (req, res) => {
    try {
      const [result] = await sequelize.query(
        `
        SELECT 
          SUM(amount) AS total_sales
        FROM receipts
        GROUP BY DATE_FORMAT(receipt_date, '%Y-%m')
        ORDER BY receipt_date DESC
        `
      );
  
      if (result.length < 2) {
        return res.status(200).json({
          message: "Not enough data to calculate percentage change.",
          percentage_change: null,
        });
      }

      const currentMonthSales = result[0].total_sales;
      const previousMonthSales = result[1].total_sales;  
      const percentageChange =
        ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;

      const formatSales = (value) => {
        if (value >= 1_000_000) {
          return (value / 1_000_000).toFixed(1) + 'M';
        } else if (value >= 1_000) {
          return (value / 1_000).toFixed(1) + 'K';
        } else {
          return value.toString();
        }
      };
  
      res.status(200).json({
        message: "Percentage change fetched successfully",
        percentage_change: `${percentageChange.toFixed(2)}%`,
        current_month_sales: formatSales(currentMonthSales),
        previous_month_sales: formatSales(previousMonthSales),
      });
    } catch (error) {
      console.error("Error fetching sales data:", error);
      return res.status(500).json({
        message: "Failed to fetch sales data",
        error: error.message,
      });
    }
  };
  
export const getUser = async(req, res) => {

}

export const getWeeklyUser = async(req, res) => {
    
}

export const getMonthlyUser = async(req, res) => {
    
}