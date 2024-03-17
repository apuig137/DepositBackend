import { fileURLToPath } from "url"
import { dirname } from "path"

export const generateUniqueCode = () => {
    let code = 0;

    for (let i = 0; i < 6; i++) {
        const digit = Math.floor(Math.random() * 10);
        code = code * 10 + digit; // Agrega el dígito al código, desplazando los dígitos existentes una posición a la izquierda
    }

    return code;
}

export const isValidPassword = async (req, res) => {
    
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname