import { generateUniqueCode } from "../utils.js";
import { productModel } from "../dao/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();

        res.json({ status: "success", payload: products });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "error", message: "Error trying to get products", payload: error });
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
        return res.status(400).send("All fields are required");
    }

    if (isNaN(price) || isNaN(quantity)) {
        return res.status(401).json({ status: "error", message: "Price and quantity must be numbers" });
    } else if (quantity < 1 || price < 0) {
        return res.status(402).json({ status: "error", message: "Quantity and price must be positive" });
    }

    let currentTime = new Date()
    let expirationParam = new Date(expiration)
    if(expirationParam < currentTime) {
        return res.status(403).json({ status: "error", message: "The product is expired" });
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

        const existingName = await productModel.findOne({ name: name });
        const existingExpiration = await productModel.findOne({ expiration: expiration });
        const existingPrice = await productModel.findOne({ price: price });

        let existingProduct = null;

        if ( existingPrice && existingName && existingExpiration && existingName._id.toString() === existingExpiration._id.toString()) {
            existingProduct = existingName
        }

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
            expirated: false,
            price,
            stock: productStock,
            quantity,
            code
        });
        res.send({ status: "success", payload: product });
        
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ status: "error", message: "An error occurred while creating the product" });
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await productModel.deleteOne({ _id: id });

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

            await findProduct.save();
            return res.json({ status: "success", payload: findProduct });
        } else {
            return res.status(400).json({ status: "error", message: "Cannot decrease stock below zero." });
        }
    } catch (error) {
        console.error("Error in decreaseStock:", error);
        return res.status(500).json({ status: "error", message: "Error decreasing stock." });
    }
};

export const expirateProduct = async (req, res) => {
    const id = req.params.id
    console.log("Prueba")

    const findProduct = await productModel.findById(id);
    const expiration = findProduct.expiration

    try {
        let currentTime = new Date()
        let expirationTime = new Date(expiration)
        if(expirationTime <= currentTime) {
            findProduct.expirated = true
            await findProduct.save()
            return res.json({ status: "success", message: "Successful expiration"});
        } else {
            return res.status(400).json({ status: "error", message: "Unexpired product"});
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: "error", message: "Error expirating product" });
    }
}