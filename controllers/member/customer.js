import { sequelize } from "../../db.config.js";
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

export const getDurations = async (req, res) => {
  const getDurationsSQL = 'select DISTINCT duration from plans;';
  const [data] = await sequelize.query(getDurationsSQL);
  const durations = data.map((item) => item.duration);
  res.status(200).json({ data: durations });
}

export const getPlanTypes = async (req, res) => {
  const getPlanTypesSQL = 'select * from plan_types';
  const [data] = await sequelize.query(getPlanTypesSQL);
  res.status(200).json({ data: data });
}

export const add_subscription = async (req, res) => {

  // isko update karna hai

  try {
    const { plan_type, duration, user_id, price } = req.body;
    // plan_type duration user_id price

    const [[plan]] = await sequelize.query('select * from plans where plan_type = :plan_type and duration = :duration', {
      replacements: {
        plan_type: plan_type,
        duration: duration
      }
      }
    );

    // console.log(plan.plan_type)
    // let duration = plan.plan_type;

    let start_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    let end_date = moment().utcOffset("+05:30").format("YYYY-MM-DD");

    switch (duration) {
      case 1:
        end_date = moment()
        .utcOffset("+05:30")
        .subtract(-1, "months")
        .format("YYYY-MM-DD");
        break;
      case 3:
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-3, "months")
          .format("YYYY-MM-DD");
        break;
      case 6:
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-6, "months")
          .format("YYYY-MM-DD");
        break;
      case 12:
        end_date = moment()
          .utcOffset("+05:30")
          .subtract(-12, "months")
          .format("YYYY-MM-DD");
        break;
      default:
    }

    const [data] = await sequelize.query(
      "insert into subscriptions (user_id, plan_id, amount, start_date, end_date) values (:user_id, :plan_id, :amount, :start_date, :end_date)",
      {
        replacements: {
          user_id: user_id,
          plan_id: plan.id,
          amount: price,
          start_date: start_date,
          end_date: end_date,
        },
      },
    );

    return res.json({ message: "Subscriber added successfully", data : {
      subscription_id : data
    } });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Error adding subscriber", error: err });
  }
};
