import passport from "passport";
import LocalStrategy from "passport-local"
import userModel from "../src/dao/user.model.js";

const initializePassport = () => {
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }
            if (password !== user.password) {
                console.log("Invalid credentials");
                return done(null, false, { message: "Invalid credentials" });
            }
            return done(null, user);
        } catch (error) {
            console.error("Error logging in:", error);
            return done({ message: "Error logging in" });
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userModel.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
}

export default initializePassport;

