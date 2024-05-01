import mongoose from "mongoose";

const productCollection = "Productos"

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    expiration:{
        type: Date,
        require: true
    },
    expirated:{
        type: Boolean,
        require: true
    },
    code:{
        type: Number,
        require: true,
        unique: true
    },
    stock:{
        type: Number,
        require: true
    },
    quantity:{
        type: Number,
        require: true
    }
})

// Middleware para convertir la cadena de fecha a un objeto de fecha antes de guardar
productSchema.pre('save', function (next) {
    // this se refiere al documento actual
    if (this.expiration) {
        this.expiration = new Date(this.expiration);
    }
    next();
});

export const productModel = mongoose.model(productCollection, productSchema)
