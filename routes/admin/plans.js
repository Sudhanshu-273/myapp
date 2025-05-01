import express from "express";
import { addPlan, updatePlan, deletePlan, getPlan, getPlanType, addPlanType, updatePlanType, deletePlanType} from "../../controllers/admin/plans.js";
const router = express.Router();

// for plans
router.get('/list', getPlan); 
router.post("/add", addPlan);
router.patch('/update',updatePlan );
router.delete('/delete',deletePlan);

// for plan types
router.get('/list_type', getPlanType); 
router.post("/add_type", addPlanType);
router.patch('/update_type',updatePlanType );
router.delete('/delete_type',deletePlanType);
export default router; 