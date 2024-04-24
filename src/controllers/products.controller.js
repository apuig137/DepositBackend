import { generateUniqueCode } from "../utils.js";
import { productModel } from "../dao/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();

        res.json({ status: "success", payload: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error trying to get products" });
    }
};

export const getProductById = async (req, res) => {
    const id = req.params.id;

    try {
        const findProduct = await productModel.findOne({_id:id});

        if (!findProduct) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        res.json({ status: "success", payload: findProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error trying to get product by ID" });
    }
};


export const addProduct = async (req, res) => {
    const { name, expiration, price, quantity: rawQuantity } = req.body
    const quantity = parseInt(rawQuantity)

    let productStock

    if (!name || !expiration || !price || isNaN(quantity)) {
        console.log("All fields are required");
        return res.status(400).send("All fields are required");
    }

    if (quantity < 1 || price < 0) {
        return res.status(400).json({ status: "error", message: "Quantity and price must be positive" });
    }

    try {
        let code = generateUniqueCode()
        const existingCode = await productModel.findOne({ code: code });

        if (existingCode) {
            let newCode;
            do {
                newCode = generateUniqueCode();
            } while (await productModel.findOne({ code: newCode }));
            code = newCode;
        }

        const existingProduct = await productModel.findOne({ name: name });

        if (existingProduct) {
            existingProduct.stock += parseInt(quantity)
            await existingProduct.save();
            return res.send({ status: "success", payload: existingProduct });
        } else {
            productStock = quantity
        }

        let product = await productModel.create({
            name,
            expiration,
            price,
            stock: productStock,
            quantity,
            code
        });
        res.send({ status: "success", payload: product });
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error trying to create a product");
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await productModel.findOne({ _id: id });

        if (result.deletedCount === 1) {
            return res.status(200).json({ status: "success", message: "Product successfully removed" });
        } else {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error trying to delete product" });
    }
};

export const decreaseStock = async (req, res) => {
    const id = req.params.id;
    const quantity = req.params.quantity;


    try {
        const findProduct = await productModel.findById(id);

        if (!findProduct) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        if(findProduct.stock < 0) {
            await productModel.deleteOne({ _id: id });
            return res.json({ status: "success", message: "Product deleted." });
        }

        if (findProduct.stock > 0) {
            findProduct.stock -= 1;

            if (findProduct.stock === 0) {
                await productModel.deleteOne({ _id: id });
                return res.json({ status: "success", message: "Product deleted due to zero stock." });
            }

            await findProduct.save(); // Solo guardar si el producto no ha sido eliminado
            return res.json({ status: "success", payload: findProduct });
        } else {
            return res.status(400).json({ status: "error", message: "Cannot decrease stock below zero." });
        }
    } catch (error) {
        console.error("Error in decreaseStock:", error);
        return res.status(500).json({ status: "error", message: "Error decreasing stock." });
    }
};