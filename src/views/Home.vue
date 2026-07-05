<template>
  <div class="ingredient-list">
    <Button @click="fetchData">Zutaten ohne rezpet</Button>
    <p v-if="loading">Lade Zutaten...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else class="ingredient-grid">
      <IngredientCard
        v-for="ingredient in ingredients"
        :key="ingredient.id"
        :ingredient="ingredient"
      />
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import IngredientCard from '../components/IngredientCard.vue';

export default {
    name: 'Home',
    components: {
        IngredientCard
    },
    data() {
        return {
            ingredients: [],
            loading: false,
            error: null
        };
    },
    methods: {
        async fetchData(){
            try {
                this.loading = true;
                const response = await api.get('/zutat/ohne-rezept');
                this.ingredients = response.data;
                this.error = null;
            } catch (err) {
                this.error = 'Failed to fetch data. Check console for details';
                console.error(err);
            }  finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.ingredient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
</style>