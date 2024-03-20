import userModel from "../dao/user.model.js";

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

        req.session.user = {
            email: user.email,
        };

        res.send({ status: "success", payload: req.session.user, message: "Successful login" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Login fail" });
    }
};

export const logout = async (req, res) => {
    try {
        req.session.destroy(async err => {
        if (err) return res.status(500).send({ status: "error", error: "Couldn't logout" });
            const userEmail = req.user.email;
            const user = await userModel.findOne({ email: userEmail });
            res.send({ status: "success", message: "Successful logout"});
        })
    } catch (error) {
        console.log(error)
    }
    
}

