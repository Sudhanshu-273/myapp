import {addSale} from "../../controllers/member/sales.js";

const router = express.Router();
router.post("/sale", addSale);

export default router;