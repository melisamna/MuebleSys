import { Router } from 'express';
import { getProducts } from '../controladores/product.js';
const router = Router();
router.get("/", getProducts);
export default router;
//# sourceMappingURL=product.js.map