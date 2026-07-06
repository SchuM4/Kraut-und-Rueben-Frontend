<template>
    <div class="bestellung-card" @click="toggleExpanded">
        <div class="bestellung-card__header">
            <div class="bestellung-card__kunde">
                <h3>{{ bestellung.kunde.vorname }} {{ bestellung.kunde.nachname }}</h3>
                <p class="bestellung-card__meta">
                    {{ formattedDatum }} &middot; {{ formattedBetrag }}
                </p>
                <p class="bestellung-card__email">{{ bestellung.kunde.emailadresse }}</p>
            </div>
            <span class="bestellung-card__chevron" :class="{ 'is-open': expanded }">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        </div>

        <div v-if="expanded" class="bestellung-card__details" @click.stop>
            <div class="bestellung-card__divider"></div>

            <section class="bestellung-card__section">
                <h4>Kundendaten</h4>
                <div class="bestellung-card__row">
                    <span>Geburtsdatum</span>
                    <span class="bestellung-card__row-value">{{ formattedGeburtsdatum }}</span>
                </div>
                <div class="bestellung-card__row">
                    <span>Telefonnummer</span>
                    <span class="bestellung-card__row-value">{{ bestellung.kunde.telefonnummer }}</span>
                </div>
            </section>

            <div v-if="bestellung.rezepte && bestellung.rezepte.length" class="bestellung-card__divider"></div>

            <section v-if="bestellung.rezepte && bestellung.rezepte.length" class="bestellung-card__section">
                <h4>Rezepte</h4>
                <div class="bestellung-card__row" v-for="rezept in bestellung.rezepte" :key="rezept.id">
                    <span>{{ rezept.bezeichnung }}</span>
                    <span class="bestellung-card__row-value">{{ rezept.portionen }} Portionen</span>
                </div>
            </section>

            <div v-if="bestellung.zutaten && bestellung.zutaten.length" class="bestellung-card__divider"></div>

            <section v-if="bestellung.zutaten && bestellung.zutaten.length" class="bestellung-card__section">
                <h4>Zutaten</h4>
                <div class="bestellung-card__row" v-for="zutat in bestellung.zutaten" :key="zutat.id">
                    <span>{{ zutat.bezeichnung }}</span>
                    <span class="bestellung-card__row-value">{{ zutat.bestellmenge }} {{ zutat.bezugseinheit }}</span>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BestellungCard',
    props: {
        bestellung: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            expanded: false
        };
    },
    computed: {
        formattedDatum() {
            const datum = new Date(this.bestellung.bestelldatum);
            if (isNaN(datum)) return this.bestellung.bestelldatum;
            return datum.toLocaleDateString('de-DE');
        },
        formattedGeburtsdatum() {
            const datum = new Date(this.bestellung.kunde.geburtsdatum);
            if (isNaN(datum)) return this.bestellung.kunde.geburtsdatum;
            return datum.toLocaleDateString('de-DE');
        },
        formattedBetrag() {
            return this.bestellung.rechnungsbetrag.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
            });
        }
    },
    methods: {
        toggleExpanded() {
            this.expanded = !this.expanded;
        }
    }
};
</script>

<style scoped>
.bestellung-card {
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin: 0.5rem;
    cursor: pointer;
    background: #17181a;
    color: #f2f2f2;
    transition: background 0.2s ease;
    width: 100%;
    max-width: 480px;
}

.bestellung-card:hover {
    background: #1d1e21;
}

.bestellung-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.bestellung-card__kunde h3 {
    margin: 0 0 0.4rem 0;
    font-size: 1.15rem;
    font-weight: 600;
    color: #fff;
}

.bestellung-card__meta {
    margin: 0 0 0.25rem 0;
    color: #9a9a9a;
    font-size: 0.9rem;
}

.bestellung-card__email {
    margin: 0;
    color: #7a7a7a;
    font-size: 0.85rem;
}

.bestellung-card__chevron {
    color: #9a9a9a;
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
    flex-shrink: 0;
    margin-top: 0.2rem;
}

.bestellung-card__chevron.is-open {
    transform: rotate(180deg);
}

.bestellung-card__divider {
    border-top: 1px solid #2c2d30;
    margin: 1rem 0;
}

.bestellung-card__details {
    cursor: default;
}

.bestellung-card__section {
    margin-bottom: 0.25rem;
}

.bestellung-card__section h4 {
    margin: 0 0 0.6rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
}

.bestellung-card__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.35rem 0;
    font-size: 0.9rem;
    color: #cfcfcf;
}

.bestellung-card__row-value {
    color: #9a9a9a;
}
</style>