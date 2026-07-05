<template>
    <div class="zutaten-page">
        <Card class="filter-card">
            <template #title>Zutaten durchsuchen</template>
            <template #content>
                <div class="filter-row">
                    <Select v-model="selectedAction" :options="actionOptions" optionLabel="label" optionValue="value"
                        placeholder="Aktion auswählen" class="action-select" />
                </div>

                <Divider v-if="selectedAction" />

                <div class="filter-row" v-if="selectedAction === 'ohneRezept'">
                    <Button label="Zutaten ohne Rezept" icon="pi pi-list" @click="getZutatenOhneRezept()" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'niedrigerBestand'">
                    <InputNumber v-model="bestand" placeholder="Mindestbestand" showButtons :min="0" />
                    <Button label="Niedriger Bestand" icon="pi pi-exclamation-triangle"
                        @click="getZutatenMitNiedrigemBestand(bestand)" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'nachLieferant'">
                    <InputText v-model="lieferantenname" placeholder="Beispiel GmbH" />
                    <Button label="Nach Lieferant" icon="pi pi-truck"
                        @click="getZutatenVonEinemLieferant(lieferantenname)" />
                </div>
            </template>
        </Card>

        <div class="results-section">
            <div v-if="loading" class="status-message">
                <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
                <span>Lade Zutaten...</span>
            </div>

            <Message v-else-if="error" severity="error" :closable="false">
                {{ error }}
            </Message>

            <Message v-else-if="!recipes.length" severity="info" :closable="false">
                Keine Rezepte gefunden.
            </Message>

            <div v-else class="ingredient-grid">
                
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api';
import IngredientCard from '../components/IngredientCard.vue';
import { Button, InputText, InputNumber, Card, Divider, Message, ProgressSpinner, Select } from 'primevue';

export default {
    name: 'zutaten',
    components: {
        IngredientCard,
        Button,
        InputText,
        InputNumber,
        Card,
        Divider,
        Message,
        ProgressSpinner,
        Select
    },
    data() {
        return {
            recipes: [],
            loading: false,
            error: null,
            bestand: 0,
            lieferantenname: '',
            selectedAction: null,
            actionOptions: [
                { label: 'Zutaten ohne Rezept', value: 'ohneRezept' },
                { label: 'Zutaten mit niedrigem Bestand', value: 'niedrigerBestand' },
                { label: 'Zutaten von einem Lieferant', value: 'nachLieferant' }
            ]
        };
    },
    methods: {
        async getBestimmtenRezept(bezeichnung) {
            await this.fetchRecipes(
                () => api.get(`/rezept/zutaten?rezeptname=${bezeichnung}`),
                `Keine Rezepte mit dem Namen ${bezeichnung} gefunden`
            );
        },
        async getRezepteMitZutat(zutat) {
            await this.fetchRecipes(
                () => api.get(`/rezept/zutaten?rezeptname=${zutat}`),
                `Keine Rezepte mit der Zutat ${zutat} gefunden`
            );
        },
        async getRezepteMitWenigerAlsFuenfZutaten() {
            await this.fetchRecipes(
                () => api.get(`/rezept/wenige-zutaten`),
                `Keine Rezepte mit weniger als 5 Zutaten gefunden`
            )
        },
        async getRezepteMitWenigerAlsFuenfZutatenVonKategorie(kategorie) {
            await this.fetchRecipes(
                () => api.get(`/rezept/wenige-zutaten/kategorie?kategorie=${kategorie}`),
                `Keine Rezepte mit weniger als 5 Zutaten von ${kategorie} gefunden`
            )
        },
        async getRezepteSortiertNachBestellanzahl() {
            await this.fetchRecipes(
                () => api.get(`/rezept/sortiert-nach-bestellanzahl`),
                `Keine Rezepte gefunden`
            )
        },
        async getRezepteMitMindestPortionen(portionen) {
            await this.fetchRecipes(
                () => api.get(`/rezept/mindest-portionen?mindestPortionen=${portionen}`),
                `Keine ${portionen}-portion Rezepte gefunden`
            )
        },
        async getRezepteMitMaxKalorien(maxKalorien) {
            await this.fetchRecipes(
                () => api.get(`/rezept/max-kalorien?maxKalorien=${maxKalorien}`),
                `Keine Rezepte mit weniger als ${maxKalorien} Kcal gefunden`
            )
        },
        async getRezepteEinerKategorie(kategorie) {
            await this.fetchRecipes(
                () => api.get(`/rezept/ernaehrungskategorie?ernaehrungskategorie=${kategorie}`),
                `Keine Rezepte in der Kategorie ${kategorie} gefunden`
            )
        },
        async fetchRecipes(requestFn, fallbackErrorMessage) {
            this.recipes = [];
            this.loading = true;
            this.error = null;
            try {
                const response = await requestFn();
                this.recipes = response.data;
            } catch (err) {
                if (err.response) {
                    this.error = `Fehler ${err.response.status}: ${fallbackErrorMessage}`;
                } else if (err.request) {
                    this.error = 'Keine Antwort vom Server erhalten';
                } else {
                    this.error = `Request error: ${err.message}`;
                }
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.zutaten-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
}

.filter-card {
    width: 100%;
}

.filter-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.results-section {
    min-height: 200px;
}

.status-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--p-text-muted-color, #6b7280);
}

.ingredient-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}
</style>