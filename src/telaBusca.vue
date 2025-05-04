<template>
    <div
        class="container"
        style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; font-family: 'Arial', sans-serif;"
    >
    <img :src="require('@/assets/EcoMapLogo.png')" style="width: 200px; margin-bottom: 20px;" />

        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
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
    </div>

  
    <img 
        :src="require('@/assets/folha-direita-cima.png')" 
        style="position: fixed; top: 0; right: 0; width: 200px;" 
      />
  
      <img
        :src="require('@/assets/folha-esquerda-baixo.png')"
        style="position: fixed; bottom: 0; left: 0; width: 200px; transform: translateY(5px);"
      />
      <img
        :src="require('@/assets/lixeira.png')"
        style="position: fixed; bottom: 0; right: 0; width: 200px; transform: translateY(5px);"
      />
  
  </template>
  
  <script>
  export default {
    data() {
      return {
        residuo: ''
      };
    },
    methods: {
      Buscar() {
        if (this.residuo.trim() !== '') {
          this.$router.push({ name: 'TelaResultados', query: { q: this.residuo } });
        }
      }
    }
  };
  
  </script>
  