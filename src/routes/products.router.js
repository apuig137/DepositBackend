import { Router } from "express";
import { addProduct, decreaseStock, deleteProduct, getProductById, getProducts } from "../controllers/products.controller.js";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", addProduct)
router.delete("/:id", decreaseStock)
router.delete("/deleteall/:id", deleteProduct)

export default router

