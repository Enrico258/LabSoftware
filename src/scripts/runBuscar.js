import { buscaPontos } from "../utils/buscaPontos.js";
import dotenv from "dotenv";
dotenv.config();

const residuo = process.argv[2] || "papel";
const procurados = [];

buscaPontos(residuo, procurados).then(result => {
  console.log("Locais:", result.locais);
});
