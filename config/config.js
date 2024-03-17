import dotenv from "dotenv"

dotenv.config()

export default {
    db:process.env.DB_URL,
    private_key:process.env.PRIVATE_KEY,
    baseUrl: 'localhost:8080',
    db_render: process.env.DB_URL_RENDER,
    psw_render: process.env.PSW
}