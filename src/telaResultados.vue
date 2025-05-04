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

    <div
      style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; position: relative; margin-top: 100px;"
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
          mapCenter: {lat: -23.5505, lng: -46.6333}
        };
      },
      methods: {
        async Buscar() {
          try {
            const q = query(
              collection(db, 'residuos'), 
              where('nome', '==', this.residuo)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const docSnap = querySnapshot.docs[0];
              const docData = docSnap.data();
              console.log('Locais recebidos do Firebase:', docData.locais);

              this.instru = docData.instru || 'Nenhuma instrução encontrada.';
              this.locais = (docData.locais || []).map(p => ({
                lat: p.latitude,
                lng: p.longitude
              }));
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
        },

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
  