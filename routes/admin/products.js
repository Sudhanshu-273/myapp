import express from 'express'
import { addProduct, getProducts } from '../../controllers/admin/products.js'

const router = express.Router()

router.post('/add', addProduct)
router.get('/list', getProducts);

export default router