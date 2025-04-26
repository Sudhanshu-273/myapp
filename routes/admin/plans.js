import express from "express";
import { addPlan, updatePlan, deletePlan, getPlan} from "../../controllers/admin/plans.js";
const router = express.Router();

router.get('/list', getPlan); 
router.post("/add", addPlan);
router.patch('/update',updatePlan );
router.delete('/delete',deletePlan);
export default router; 