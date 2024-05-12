import { Router } from "express";
import { addProduct, decreaseStock, deleteProduct, expirateProduct, getProductById, getProducts } from "../controllers/products.controller.js";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", addProduct)
router.post("/expirate/:id", expirateProduct)
router.delete("/:id", decreaseStock)
router.delete("/deleteall/:id", deleteProduct)

export default router

