<script>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'

export default {
  name: 'IngredientCard',
  components: {
    Card,
    Tag,
    Divider
  },
  props: {
    ingredient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      allergenSeverity: 'warn',
      categorySeverity: 'success'
    }
  },
  computed: {
    stockSeverity() {
      if (this.ingredient.bestand <= 0) return 'danger'
      if (this.ingredient.bestand < 10) return 'warn'
      return 'success'
    },
    stockLabel() {
      if (this.ingredient.bestand <= 0) return 'Nicht auf Lager'
      if (this.ingredient.bestand < 10) return 'Bald ausverkauft'
      return 'Auf Lager'
    }
  },
  methods: {
    fmt(value, unit = '') {
      if (value === null || value === undefined) return '–'
      return `${value}${unit}`
    }
  }
}
</script>

<template>
  <Card class="ingredient-card" style="border: 1px solid white;">
    <template #title>
      <div class="card-header">
        <span class="ingredient-name">{{ ingredient.bezeichnung }}</span>
        <Tag :value="stockLabel" :severity="stockSeverity" />
      </div>
    </template>

    <template #subtitle>
      {{ ingredient.bestand }} {{ ingredient.bezugseinheitBezeichnung }}
      <span v-if="ingredient.bezugsmenge !== 1">
        (à {{ ingredient.bezugsmenge }} {{ ingredient.bezugseinheitBezeichnung }})
      </span>
      · Lieferant: {{ ingredient.lieferantenName }}
    </template>

    <template #content>
      <div class="nutrition-grid">
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.kalorienKcal, ' kcal') }}</span>
          <span class="label">Kalorien</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.kalorienKj, ' kJ') }}</span>
          <span class="label">Brennwert</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.proteinG, ' g') }}</span>
          <span class="label">Protein</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.zuckerG, ' g') }}</span>
          <span class="label">Zucker</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.fettG, ' g') }}</span>
          <span class="label">Fett</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.gesaettFettsaeurenG, ' g') }}</span>
          <span class="label">davon gesättigt</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.ballaststoffeG, ' g') }}</span>
          <span class="label">Ballaststoffe</span>
        </div>
        <div class="nutrition-item">
          <span class="value">{{ fmt(ingredient.natriumG, ' g') }}</span>
          <span class="label">Natrium</span>
        </div>
      </div>

      <Divider v-if="ingredient.allergene?.length || ingredient.ernaehrungskategorien?.length" />

      <div v-if="ingredient.ernaehrungskategorien?.length" class="tag-row">
        <Tag
          v-for="cat in ingredient.ernaehrungskategorien"
          :key="cat"
          :value="cat"
          :severity="categorySeverity"
        />
      </div>

      <div v-if="ingredient.allergene?.length" class="tag-row">
        <Tag
          v-for="allergen in ingredient.allergene"
          :key="allergen"
          :value="allergen"
          :severity="allergenSeverity"
          icon="pi pi-exclamation-triangle"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.ingredient-card {
  width: 100%;
  max-width: 360px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.ingredient-name {
  font-size: 1.05rem;
  font-weight: 600;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 1rem;
  margin-top: 0.5rem;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
}

.nutrition-item .value {
  font-weight: 600;
  font-size: 0.95rem;
}

.nutrition-item .label {
  font-size: 0.75rem;
  color: var(--p-text-muted-color, #6b7280);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}
</style>
