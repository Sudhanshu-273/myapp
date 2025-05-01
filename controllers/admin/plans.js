import { sequelize } from "../../db.config.js";

export const getPlan = async (req, res) => {
  try {
    const getPlansSQL = "select p.id as id, p.duration, p.price, p.active, pt.name as plan_type from plans p inner join plan_types pt on p.plan_type = pt.id";
    const [plans] = await sequelize.query(getPlansSQL);
    const getDescriptionsSQL = "select name as plan_type, description from plan_types";
    const [descriptions] = await sequelize.query(getDescriptionsSQL);
    res.status(200).json({ plans: plans, descriptions: descriptions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const addPlan = async (req, res) => {
  const { id, duration, price, active } = req.body;

  if (!id || !duration || !price || active === undefined) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {

    const [planType] = await sequelize.query(
      `SELECT * FROM plan_types WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!planType) {
      return res.status(404).json({ message: "Plan type not found." });
    }


    await sequelize.query(
      `INSERT INTO plans (duration, price, active, plan_type) 
       VALUES (:duration, :price, :active, :plan_type)`,
      {
        replacements: {
          duration,
          price,
          active,
          plan_type: id,
        },
      }
    );
    res.status(201).json({ message: "Plan added successfully." });
  } catch (error) {
    console.error("Error adding plan:", error);
    res.status(500).json({ message: "Failed to add plan", error: error.message });
  }

};



export const updatePlan = async (req, res) => {
  const { id, duration, price, active, plan_type } = req.body;

  if (!id || !duration || !price || active === undefined || !plan_type) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {

    const [plan] = await sequelize.query(
      `SELECT * FROM plans WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }


    const [type] = await sequelize.query(
      `SELECT * FROM plan_types WHERE id = :plan_type`,
      {
        replacements: { plan_type },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!type) {
      return res.status(404).json({ message: "Provided plan_type does not exist." });
    }


    await sequelize.query(
      `UPDATE plans
       SET duration = :duration, price = :price, active = :active, plan_type = :plan_type
       WHERE id = :id`,
      {
        replacements: { id, duration, price, active, plan_type },
      }
    );

    res.status(200).json({ message: "Plan updated successfully." });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Failed to update plan", error: error.message });
  }
};


export const deletePlan = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Plan ID is required." });
  }

  try {

    const [plan] = await sequelize.query(
      `SELECT * FROM plans WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }


    await sequelize.query(
      `DELETE FROM plans WHERE id = :id`,
      {
        replacements: { id },
      }
    );

    res.status(200).json({ message: "Plan deleted successfully." });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({
      message: "Failed to delete plan",
      error: error.message,
    });
  }
};


// for plan types 


export const getPlanType = async (req, res) => {
  try {
    const listPlan = await sequelize.query(
      `SELECT * FROM plan_types`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (!listPlan || listPlan.length === 0) {
      return res.status(404).json({ message: "No matching plan types found." });
    }

    res.status(200).json({
      message: "Plan types fetched successfully",
      data: listPlan,
    });
  } catch (error) {
    console.error("Error fetching plan types:", error);
    res.status(500).json({
      message: "Failed to fetch plan types",
      error: error.message,
    });
  }
};

export const addPlanType = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required." });
  }

  try {

    const existingPlan = await sequelize.query(
      `SELECT * FROM plan_types WHERE name = :name`,
      {
        replacements: { name },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingPlan.length > 0) {
      return res.status(409).json({ message: "Plan type already exists." });
    }


    await sequelize.query(
      `INSERT INTO plan_types (name, description) VALUES (:name, :description)`,
      {
        replacements: { name, description },
      }
    );

    res.status(201).json({ message: "Plan type added successfully." });
  } catch (error) {
    console.error("Error adding plan type:", error);
    res.status(500).json({
      message: "Failed to add plan type",
      error: error.message,
    });
  }
};

export const updatePlanType = async (req, res) => {
  const { id, name, description } = req.body;

  if (!id || !name || !description) {
    return res.status(400).json({ message: "ID, name, and description are required." });
  }

  try {

    const [existingPlan] = await sequelize.query(
      `SELECT * FROM plan_types WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingPlan) {
      return res.status(404).json({ message: "Plan type not found." });
    }


    await sequelize.query(
      `UPDATE plan_types SET name = :name, description = :description WHERE id = :id`,
      {
        replacements: { id, name, description },
      }
    );

    res.status(200).json({ message: "Plan type updated successfully." });
  } catch (error) {
    console.error("Error updating plan type:", error);
    res.status(500).json({ message: "Failed to update plan type", error: error.message });
  }
};

export const deletePlanType = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Plan type ID is required." });
  }

  try {

    const [planType] = await sequelize.query(
      `SELECT * FROM plan_types WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!planType) {
      return res.status(404).json({ message: "Plan type not found." });
    }

    await sequelize.query(
      `DELETE FROM plan_types WHERE id = :id`,
      {
        replacements: { id },
      }
    );

    res.status(200).json({ message: "Plan type deleted successfully." });
  } catch (error) {
    console.error("Error deleting plan type:", error);
    res.status(500).json({ message: "Failed to delete plan type", error: error.message });
  }
};

