import { sequelize } from "../db.config.js";
import moment from "moment";

export const getCustomer = async (req, res) => {
  try {
    // Run the query to get customer names with their account type name
    const [customers] = await sequelize.query(
      `select users.id, users.name,user_accounts.title from users join user_accounts on users.account_type = user_accounts.id`,
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

export const getPlans = async (req, res) => {
  const [plans] = await sequelize.query("SELECT * FROM plans");
  res.json({ data: plans });
};

export const addSubscriber = async (req, res) => {
  try {
    const { customer_id, plan_id, price, duration } = req.body;

    let start_date = moment().utcOffset("+05:30").format("DD-MM-YYYY");

    let end_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    switch (duration) {
      case "1":
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-1, "months")
          .format("YYYY-MM-DD");
        break;
      case "3":
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-3, "months")
          .format("YYYY-MM-DD");
        break;
      case "6":
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-6, "months")
          .format("YYYY-MM-DD");
        break;
      case "12":
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-12, "months")
          .format("YYYY-MM-DD");
        break;
      default:
    }

    const [data] = await sequelize.query(
      "INSERT INTO subscriptions (customer_id, plan_id, total_price, start_date, end_date) VALUES (:customer_id, :plan_id, :price, :start_date, :end_date)",
      {
        replacements: {
          customer_id: customer_id,
          plan_id: plan_id,
          price: price,
          start_date: start_date,
          end_date: end_date,
        },
      },
    );

    return res.json({ message: "Subscriber added successfully" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Error adding subscriber", error: err });
  }
};
