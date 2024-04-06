import { Router } from "express";
import passport from "passport";
import { login, logout } from "../controllers/sessions.controller.js";

const router = Router();

router.post("/login", passport.authenticate('login'), login);
router.delete("/logout/:sessionId", logout);

router.get('/form', (req, res) => {
    res.render('login');
});
router.get("/home", (req, res) => {
    res.render('home', {
        user: req.session.user
    });
});

export default router;

