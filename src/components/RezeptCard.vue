<template>
  <Card class="recipe-card" :class="{ 'recipe-card--expanded': expanded }" @click="toggleExpand">
    <template #header>
      <div class="recipe-image-wrapper">
        <img
          v-if="recipe.bild && !imageError"
          :src="imageSrc"
          :alt="recipe.bezeichnung"
          class="recipe-image"
          @error="imageError = true"
        />
        <div v-else class="recipe-image-placeholder">
          <i class="pi pi-image" />
        </div>
      </div>
    </template>

    <template #title>
      <div class="recipe-title-row">
        <span>{{ recipe.bezeichnung }}</span>
        <i class="pi expand-icon" :class="expanded ? 'pi-chevron-up' : 'pi-chevron-down'" />
      </div>
    </template>

    <template #subtitle>
      <span>{{ recipe.portionen }} Portionen</span>
      <span class="subtitle-separator">·</span>
      <span>{{ totalNutrition.kalorienKcal }} kcal gesamt</span>
    </template>

    <template #content>
      <div v-if="categories.length" class="tag-row">
        <Tag
          v-for="cat in categories"
          :key="cat"
          :value="cat"
          severity="success"
        />
      </div>

      <div v-if="expanded" class="expanded-content" @click.stop>
        <Divider />

        <h4 class="section-heading">Zutaten</h4>
        <ul class="ingredient-list">
          <li v-for="item in recipe.zutaten" :key="item.zutatDTO.id">
            <span class="ingredient-name">{{ item.zutatDTO.bezeichnung }}</span>
            <span class="ingredient-amount">{{ item.menge }} {{ item.einheit }}</span>
          </li>
        </ul>

        <Divider />

        <h4 class="section-heading">Zubereitung</h4>
        <p class="preparation-text">{{ recipe.beschreibung }}</p>

        <Divider />

        <h4 class="section-heading">Nährwerte</h4>
        <table class="nutrition-table">
          <thead>
            <tr>
              <th></th>
              <th>Gesamtes Rezept</th>
              <th>Pro Portion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in nutritionRows" :key="row.key">
              <td class="nutrition-label">{{ row.label }}</td>
              <td>{{ row.total }} {{ row.unit }}</td>
              <td>{{ row.perPortion }} {{ row.unit }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="allergene.length" class="allergen-section">
          <h4 class="section-heading">Allergene</h4>
          <div class="tag-row">
            <Tag
              v-for="allergen in allergene"
              :key="allergen"
              :value="allergen"
              severity="warn"
              icon="pi pi-exclamation-triangle"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';

// Unit conversion tables used to scale each ingredient's nutrition values
// (given per `bezugsmenge` in `bezugseinheitBezeichnung`) down to the
// actual amount used in the recipe (`menge` in `einheit`).
const MASS_TO_GRAMS = {
  gramm: 1,
  g: 1,
  kilogramm: 1000,
  kg: 1000,
};

const VOLUME_TO_ML = {
  milliliter: 1,
  ml: 1,
  liter: 1000,
  l: 1000,
};

const NUTRITION_FIELDS = [
  { key: 'kalorienKcal', label: 'Kalorien', unit: 'kcal', decimals: 0 },
  { key: 'kalorienKj', label: 'Energie', unit: 'kJ', decimals: 0 },
  { key: 'proteinG', label: 'Protein', unit: 'g', decimals: 1 },
  { key: 'zuckerG', label: 'Zucker', unit: 'g', decimals: 1 },
  { key: 'fettG', label: 'Fett', unit: 'g', decimals: 1 },
  { key: 'gesaettFettsaeurenG', label: 'davon gesättigte Fettsäuren', unit: 'g', decimals: 1 },
  { key: 'ballaststoffeG', label: 'Ballaststoffe', unit: 'g', decimals: 1 },
  { key: 'natriumG', label: 'Natrium', unit: 'g', decimals: 2 },
];

export default {
  name: 'RecipeCard',
  components: { Card, Tag, Divider },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    imageBasePath: {
      type: String,
      default: 'assets/images/recipes/',
    },
  },
  data() {
    return {
      expanded: false,
      imageError: false,
    };
  },
  computed: {
    imageSrc() {
      return `${this.imageBasePath}${this.recipe.bild}`;
    },
    // A dietary category only applies to the whole recipe if every single
    // ingredient carries it (e.g. the recipe is only "Vegan" if all
    // ingredients are vegan) — so we intersect rather than union.
    categories() {
      const lists = (this.recipe.zutaten || []).map(
        (item) => new Set(item.zutatDTO.ernaehrungskategorien || [])
      );
      if (!lists.length) return [];
      const [first, ...rest] = lists;
      return [...first].filter((cat) => rest.every((set) => set.has(cat)));
    },
    // Allergens work the other way around: if any single ingredient
    // contains an allergen, the whole recipe is flagged for it.
    allergene() {
      const all = new Set();
      (this.recipe.zutaten || []).forEach((item) => {
        (item.zutatDTO.allergene || []).forEach((a) => all.add(a));
      });
      return [...all];
    },
    totalNutrition() {
      const totals = {};
      NUTRITION_FIELDS.forEach((field) => {
        totals[field.key] = 0;
      });

      (this.recipe.zutaten || []).forEach((item) => {
        const dto = item.zutatDTO;
        const ratio = this.getRatio(
          item.menge,
          item.einheit,
          dto.bezugsmenge,
          dto.bezugseinheitBezeichnung
        );
        NUTRITION_FIELDS.forEach((field) => {
          totals[field.key] += (dto[field.key] || 0) * ratio;
        });
      });

      NUTRITION_FIELDS.forEach((field) => {
        totals[field.key] = this.round(totals[field.key], field.decimals);
      });
      return totals;
    },
    perPortionNutrition() {
      const portionen = this.recipe.portionen || 1;
      const perPortion = {};
      NUTRITION_FIELDS.forEach((field) => {
        perPortion[field.key] = this.round(
          this.totalNutrition[field.key] / portionen,
          field.decimals
        );
      });
      return perPortion;
    },
    nutritionRows() {
      return NUTRITION_FIELDS.map((field) => ({
        key: field.key,
        label: field.label,
        unit: field.unit,
        total: this.totalNutrition[field.key],
        perPortion: this.perPortionNutrition[field.key],
      }));
    },
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    },
    round(value, decimals) {
      const factor = 10 ** decimals;
      return Math.round(value * factor) / factor;
    },
    // Scales an ingredient's nutrition values (given per `bezugsmenge` of
    // `bezugseinheit`) to the amount actually used in the recipe (`menge`
    // of `einheit`). Converts within mass (g/kg) or volume (ml/l) families.
    // If the units aren't in the same family (e.g. "Stück" vs "Kilogramm",
    // as happens for a few ingredients in the sample data), there's no
    // reliable way to convert without an assumed average weight — this
    // falls back to treating the two quantities as directly comparable
    // numbers, which is an approximation worth flagging to whoever enters
    // that ingredient data.
    getRatio(menge, einheit, bezugsmenge, bezugseinheit) {
      const e = (einheit || '').toLowerCase();
      const b = (bezugseinheit || '').toLowerCase();

      if (MASS_TO_GRAMS[e] !== undefined && MASS_TO_GRAMS[b] !== undefined) {
        return (menge * MASS_TO_GRAMS[e]) / (bezugsmenge * MASS_TO_GRAMS[b]);
      }
      if (VOLUME_TO_ML[e] !== undefined && VOLUME_TO_ML[b] !== undefined) {
        return (menge * VOLUME_TO_ML[e]) / (bezugsmenge * VOLUME_TO_ML[b]);
      }
      return menge / bezugsmenge;
    },
  },
};
</script>

<style scoped>
.recipe-card {
  width: 320px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.recipe-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.recipe-image-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--p-surface-100, #f4f4f4);
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recipe-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-surface-400, #ccc);
  font-size: 2rem;
}

.recipe-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.expand-icon {
  font-size: 0.9rem;
  color: var(--p-text-muted-color, #888);
}

.subtitle-separator {
  margin: 0 0.4rem;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.section-heading {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.ingredient-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ingredient-list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.ingredient-name {
  color: var(--p-text-color, #333);
}

.ingredient-amount {
  color: var(--p-text-muted-color, #777);
  white-space: nowrap;
  margin-left: 1rem;
}

.preparation-text {
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-line;
  margin: 0;
}

.nutrition-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.nutrition-table th {
  text-align: right;
  font-weight: 600;
  padding: 0.3rem 0.4rem;
  border-bottom: 1px solid var(--p-surface-200, #e5e5e5);
}

.nutrition-table th:first-child {
  text-align: left;
}

.nutrition-table td {
  padding: 0.3rem 0.4rem;
  text-align: right;
  border-bottom: 1px solid var(--p-surface-100, #f0f0f0);
}

.nutrition-label {
  text-align: left !important;
  color: var(--p-text-muted-color, #555);
}

.allergen-section {
  margin-top: 1rem;
}
</style>