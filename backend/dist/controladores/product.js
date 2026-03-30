import {} from "express";
import { product } from "../modelos/product.js";
export const getProducts = async (req, res) => {
    const listProducts = await product.findAll();
    res.json(listProducts);
};
//# sourceMappingURL=product.js.map