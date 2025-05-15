import { collection, query, where, getDocs } from "firebase/firestore";
import fetch from "node-fetch"; 
import { db } from '../firebase'; 

export async function buscaPontos(residuo, procurados = []) {
  const termo = residuo.trim();
  if (!termo || procurados.length === 3) return { instru: "", locais: [], mapCenter: null };

  const novosProcurados = [...procurados];
  if (!novosProcurados.includes(termo)) {
    novosProcurados.push(termo);
  }

  try {
    console.log(db)
    const q = query(
      collection(db, "residuos"),
      where("nome", "==", termo)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { instru: "Nenhum resultado encontrado.", locais: [], mapCenter: null };
    }

    const docSnap = querySnapshot.docs[0];
    const docData = docSnap.data();

    let instru = "Nenhuma instrução encontrada.";
    if (novosProcurados.length === 1) {
      instru = docData.instru || instru;
    } else {
      const apiKey = process.env.VUE_APP_GPT_API_KEY;
      const endpoint = "https://api.openai.com/v1/chat/completions";

      const resposta = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: "Dê instruções basicas de descarte para os seguintes materiais em poucos tópicos: " + novosProcurados.join(", "),
            },
          ],
        }),
      });

      const data = await resposta.json();
      instru = data.choices[0].message.content;
    }

    const novosLocais = (docData.locais || []).map((p, i) => ({
      lat: p.latitude,
      lng: p.longitude,
      descricao: (docData.infoLocais || [])[i] || "Sem descrição",
    }));

    const mapCenter = novosLocais.length > 0 ? novosLocais[0] : null;

    return { instru, locais: novosLocais, mapCenter, novosProcurados };
  } catch (error) {
    console.error("Erro ao buscar instruções:", error);
    return { instru: "Erro ao buscar dados.", locais: [], mapCenter: null };
  }
}
