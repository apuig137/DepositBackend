import userModel from "../dao/user.model.js";
import mongoose from "mongoose";

export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ status: "error", error: "Incorrect credentials" });
        }

        const userEmail = req.user.email;
        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(400).send({ status: "error", error: "User not found" });
        }

        res.send({ status: "success", payload: { user: req.user, session: req.sessionID }, message: "Successful login" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Login fail" });
    }
};

const Session = mongoose.connection.collection("sessions");

export const logout = async (req, res) => {
    const sessionId = req.params.sessionId;

    try {
        const deleteResult = await Session.deleteOne({ _id: sessionId });

        if (deleteResult.deletedCount === 0) {
            return res.status(400).send({ status: "error", error: "No active session" });
        }

        res.send({ status: "success", message: "Successful logout" });
    } catch (error) {
        console.log("Error during logout:", error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};


