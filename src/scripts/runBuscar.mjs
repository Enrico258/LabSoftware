import { buscaPontos } from "../utils/buscaPontos.mjs";

const residuo = process.argv[2] || "papel";
const procurados = [];

buscaPontos(residuo, procurados).then(result => {
  console.log("Locais:", result.locais);
});
