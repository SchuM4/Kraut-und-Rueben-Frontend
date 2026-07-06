<template>
  <div class="durchschnitt-card">
    <div class="durchschnitt-card__header">
      <h3>{{ durchschnitt.kundeDto.vorname }} {{ durchschnitt.kundeDto.nachname }}</h3>
      <p class="durchschnitt-card__email">{{ durchschnitt.kundeDto.emailadresse }}</p>
    </div>

    <div class="durchschnitt-card__divider"></div>

    <div class="durchschnitt-card__section">
      <h4>&Oslash; Nährwerte pro Bestellung</h4>
      <div class="durchschnitt-card__row">
        <span>Kalorien</span>
        <span class="durchschnitt-card__row-value">{{ formatValue(durchschnitt.avgKalorien) }} kcal</span>
      </div>
      <div class="durchschnitt-card__row">
        <span>Protein</span>
        <span class="durchschnitt-card__row-value">{{ formatValue(durchschnitt.avgProtein) }} g</span>
      </div>
      <div class="durchschnitt-card__row">
        <span>Kohlenhydrate</span>
        <span class="durchschnitt-card__row-value">{{ formatValue(durchschnitt.avgKohlenhydrate) }} g</span>
      </div>
      <div class="durchschnitt-card__row">
        <span>davon Zucker</span>
        <span class="durchschnitt-card__row-value">{{ formatValue(durchschnitt.avgZucker) }} g</span>
      </div>
      <div class="durchschnitt-card__row">
        <span>Fett</span>
        <span class="durchschnitt-card__row-value">{{ formatValue(durchschnitt.avgFett) }} g</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KundenDurchschnittCard',
  props: {
    durchschnitt: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatValue(value) {
      if (typeof value !== 'number') return value;
      return value.toLocaleString('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
  }
};
</script>

<style scoped>
.durchschnitt-card {
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  margin: 0.5rem;
  background: #17181a;
  color: #f2f2f2;
  width: 100%;
  max-width: 480px;
}

.durchschnitt-card__header h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
}

.durchschnitt-card__email {
  margin: 0;
  color: #7a7a7a;
  font-size: 0.85rem;
}

.durchschnitt-card__divider {
  border-top: 1px solid #2c2d30;
  margin: 1rem 0;
}

.durchschnitt-card__section h4 {
  margin: 0 0 0.6rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.durchschnitt-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  font-size: 0.9rem;
  color: #cfcfcf;
}

.durchschnitt-card__row-value {
  color: #9a9a9a;
}
</style>