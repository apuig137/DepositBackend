import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import config from "../config/config.js";
import displayRoutes from "express-routemap";
import session from "express-session";
import productsRouter from "./routes/products.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import bodyParser from "body-parser";
import initializePassport from "../config/passport.config.js";
import passport from "passport";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO = `${config.db}`;

// Middleware para manejar CORS en toda la aplicación
app.use(cors({
    origin: ["http://localhost:3000", "https://deposit-frontend-five.vercel.app", "https://deposit-frontend-5aitnf2b4-apuig137s-projects.vercel.app", "https://depositfrontend.onrender.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware para analizar JSON
app.use(express.json());

// Middleware para analizar datos de formulario
app.use(express.urlencoded({ extended: true }));

// Manejo de sesiones
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 3600,
    }),
    secret: "SecretKey",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/products", productsRouter);
app.use("/session", sessionsRouter);

// Inicia el servidor
const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Server on the port ${PORT}`);
});

