<template>
    <div
      class="container"
      style="position: fixed; top: 0; left: 0; width: 100%; display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 10px; padding: 20px; font-family: 'Arial', sans-serif;"
    >
      <input
        type="text"
        placeholder="Escreva aqui o resíduo que deseja descartar"
        v-model="residuo"
        @keyup.enter="Buscar"
        style="width: 400px; padding: 10px; font-size: 1rem; border: 2px solid #ccc; border-radius: 8px; text-align: left; font-weight: bold; color: #555;"
      />
      <img 
        :src="require('@/assets/busca.png')" 
        style="width: 24px; cursor: pointer;" 
        @click="Buscar"
      />
      
    </div>

    <div style="margin-top: 80px; display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; align-items: center">
      <span 
        v-for="(busca, index) in procurados" 
        :key="index" 
        style="background-color: #e0f7fa; border-radius: 20px; font-family: 'Arial', sans-serif; padding: 8px 16px; font-size: 0.9rem; font-weight: bold; color: #00796b; display: inline-flex; align-items: center; gap: 8px"
      >
        {{ busca }}
        <img 
          :src="require('@/assets/X.png')" 
          style="width: 16px; height: 16px; cursor: pointer;" 
          @click="Remover(index)"
        />
      </span>
    </div>


    <div
      style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; position: relative; margin-top: 70px;"
    >
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
        <img :src="require('@/assets/instru.png')" style="width: 120px;" />
        <p v-if="instru" style="margin-top: 10px; width: 80%; text-align: center; font-size: 1rem; color: #333; white-space: pre-line;">
          {{ instru }}
        </p>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
        <img :src="require('@/assets/pontos.png')" style="width: 150px;" />
        <GMapMap
          :center="mapCenter"
          :zoom="12"
          style="width: 500px; height: 450px; margin-top: 20px;"
        >
          <GMapMarker
            v-for="(local, index) in locais"
            :key="index"
            :position="local"
            :title="local.descricao"
            @click="abrirGoogleMaps(local)"

          />
        </GMapMap>
      </div>
    </div>


    <img 
      :src="require('@/assets/folha-direita-cima.png')" 
      style="position: fixed; top: 0; right: 0; width: 150px;" 
    />

    <img
      :src="require('@/assets/folha-esquerda-baixo.png')"
      style="position: fixed; top: 0; left: 0; width: 150px; transform: rotate(90deg) translateX(-20px);"
    />

    <img
      :src="require('@/assets/lixeira.png')"
      style="position: fixed; bottom: 0; right: 0; width: 150px; transform: translateY(5px);"
    />

    <img 
      :src="require('@/assets/EcoMapLogo.png')" 
      style="position: fixed ; bottom: 0; left: 0; width: 200px; transform: translateX(10px) translateY(-5px); cursor: pointer; " 
      @click="$router.push({ name: 'TelaBusca' })"
    />

  </template>
  
  <script>
    import { collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '@/firebase'; 
    import { GMapMap, GMapMarker } from '@fawmi/vue-google-maps';

    export default {
      components: {
        GMapMap,
        GMapMarker
      },
      data() {
        return {
          residuo: '',
          instru: '',
          locais: [],
          procurados: [],
          mapCenter: {lat: -23.5505, lng: -46.6333},
        };
      },
      methods: {
        async Remover(index) {
          try {
            const q = query(
              collection(db, 'residuos'), 
              where('nome', '==', this.procurados[index])
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const docSnap = querySnapshot.docs[0];
              const docData = docSnap.data();

              const removeLocais = (docData.locais || []).map(p => ({
                lat: p.latitude,
                lng: p.longitude
              }));

              removeLocais.forEach(novo => {
                const existe = this.locais.some(
                  l => l.lat === novo.lat && l.lng === novo.lng
                );
                if (existe) {
                  this.locais.splice(novo, 1);
                }
              });

              this.procurados.splice(index, 1);
              if (this.procurados.length == 0) {
                this.instru = "Nenhum material inserido"
              } 
              else if (this.procurados.length == 1) {
                const q = query(
                  collection(db, 'residuos'), 
                  where('nome', '==', this.procurados[0])
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                  const docSnap = querySnapshot.docs[0];
                  const docData = docSnap.data();
                  this.instru = docData.instru || 'Nenhuma instrução encontrada.';
                }
              } else {
                const apiKey = process.env.VUE_APP_GPT_API_KEY;
                const endpoint = "https://api.openai.com/v1/chat/completions";
                const resposta = await fetch(endpoint, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                      { role: "user", content: "Dê instruções basicas de descarte para os seguintes materias em poucos tópicos:" + this.procurados }
                    ]
                  })
                });
                const data = await resposta.json();
                this.instru = (data.choices[0].message.content);
              }
            } else {
              this.instru = 'Nenhum resultado encontrado.';
              this.locais = [];
            }
          } catch (error) {
            console.error('Erro ao buscar instruções:', error);
            this.instru = 'Erro ao buscar dados.';
          }
        },

        async Buscar() {
          const termo = this.residuo.trim();
          if (!termo || this.procurados.length == 3) return;

          if (!this.procurados.includes(termo)) {
            this.procurados.push(termo);
          }

          try {
            const q = query(
              collection(db, 'residuos'), 
              where('nome', '==', this.residuo)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              console.log(this.procurados.length)
              const docSnap = querySnapshot.docs[0];
              const docData = docSnap.data();
              if (this.procurados.length == 0) {
                this.instru = "Nenhum material inserido"
              } 
              else if (this.procurados.length == 1) {
                this.instru = docData.instru || 'Nenhuma instrução encontrada.';
              } else {
                const apiKey = process.env.VUE_APP_GPT_API_KEY;
                const endpoint = "https://api.openai.com/v1/chat/completions";
                const resposta = await fetch(endpoint, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                      { role: "user", content: "Dê instruções basicas de descarte para os seguintes materias em poucos tópicos:" + this.procurados }
                    ]
                  })
                });

                const data = await resposta.json();
                this.instru = (data.choices[0].message.content);
              }
              
              const novosLocais = (docData.locais || []).map((p, i) => ({
                lat: p.latitude,
                lng: p.longitude,
                descricao: (docData.infoLocais || [])[i] || 'Sem descrição'
              }));

              novosLocais.forEach(novo => {
                const existe = this.locais.some(
                  l => l.lat === novo.lat && l.lng === novo.lng
                );
                if (!existe) {
                  this.locais.push(novo);
                }
              });

              if (this.locais.length === novosLocais.length && novosLocais.length > 0) {
                this.mapCenter = novosLocais[0];
              }

              if (this.locais.length > 0) {
                this.mapCenter = this.locais[0];
              }
            } else {
              this.instru = 'Nenhum resultado encontrado.';
              this.locais = [];
            }
          } catch (error) {
            console.error('Erro ao buscar instruções:', error);
            this.instru = 'Erro ao buscar dados.';
          }
          this.residuo = '';
        },
        abrirGoogleMaps(local) {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${local.lat},${local.lng}`;
          window.open(url, '_blank');
        }

      },
      mounted() {
        const pesquisa = this.$route.query.q;
        if (pesquisa) {
          this.residuo = pesquisa;
          this.Buscar();
        }
      },
    };

  </script>
  