import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
})

const userModel = mongoose.model(userCollection,userSchema);

export default userModel;
