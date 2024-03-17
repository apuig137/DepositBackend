import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts } from "../controllers/products.controller.js";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", addProduct)
router.delete("/:id", deleteProduct)

export default router