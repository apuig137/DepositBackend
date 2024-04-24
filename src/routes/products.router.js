import { Router } from "express";
import { addProduct, decreaseStock, getProductById, getProducts } from "../controllers/products.controller.js";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", addProduct)
router.delete("/:id", decreaseStock)

export default router

