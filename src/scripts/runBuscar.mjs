import { buscaPontos } from "../utils/buscaPontos.mjs";
import assert from 'assert';

const residuo = process.argv[2] || "papel";
const procurados = [];
const esperado = [
  {
    lat: -23.52706555974304,
    lng: -46.64853237116456,
    descricao: 'Ecoponto Barra Funda\n' +
      '\n' +
      'R. Cônego Vicente Miguel Marino, 22 - Barra Funda, São Paulo - SP, 01135-020\n' +
      '\n' +
      'Descartes: Papel, papelão e plástico'
  },
  {
    lat: -23.538257888025996,
    lng: -46.69256772129104,
    descricao: 'Reciclagem de papel Pompeia\n' +
      '\n' +
      'R. Estevão Barbosa, 192 - Pompeia, São Paulo - SP, 05030-100\n' +
      '\n' +
      'Descartes: Papel e papelão'
  }
];


buscaPontos(residuo, procurados).then(result => {
  assert.deepStrictEqual(result.locais, esperado);
  console.log("✅ Teste passou: locais estão corretos.");
  process.exit(0);
});


