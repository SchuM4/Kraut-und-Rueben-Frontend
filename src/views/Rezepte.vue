<template>
    <div class="zutaten-page">
        <Card class="filter-card">
            <template #title>Rezepte durchsuchen</template>
            <template #content>
                <div class="filter-row">
                    <Select v-model="selectedAction" :options="actionOptions" optionLabel="label" optionValue="value"
                        placeholder="Aktion auswählen" class="action-select" />
                </div>

                <Divider v-if="selectedAction" />
                
                <div class="filter-row" v-if="selectedAction === 'bestimmtesRezept'">
                    <Select v-model="selectedRecipe" :options="recipeNames" optionLabel="label" optionValue="label"
                    placeholder="Rezept auswählen" class="action-select"/>
                    <Button label="Go" icon="pi pi-list" @click="getBestimmtenRezept(selectedRecipe)"/>
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'eineZutat'">
                    <InputText v-model="zutat" placeholder="Zucchini" />
                    <Button label="Go" icon="pi pi-list"
                        @click="getRezepteMitZutat(zutat)" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'wenigerZutaten'">
                    <Button label="Weniger Zutaten" icon="pi pi-list" @click="getRezepteMitWenigerAlsFuenfZutaten()" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'wenigerZutatenKategorie'">
                    <Select v-model="selectedCategory" :options="categories" optionLabel="label" optionValue="label"
                    placeholder="Kategorie auswählen" class="action-select"/>
                    <Button label="Go" icon="pi pi-list" @click="getRezepteMitWenigerAlsFuenfZutatenVonKategorie(selectedCategory)"/>
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'bestellanzahl'">
                    <Button label="Go" icon="pi pi-list" @click="getRezepteSortiertNachBestellanzahl" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'portionsanzahl'">
                    <InputNumber v-model="bestellanzahl" placeholder="Portionen" showButtons :min="0" />
                    <Button label="Go" icon="pi pi-list" @click="getRezepteMitMindestPortionen(bestellanzahl)"/>
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'kalorien'">
                    <InputText v-model="calories" placeholder="Portionen" showButtons :min="0" />
                    <Button label="Go" icon="pi pi-list" @click="getRezepteMitMaxKalorien(calories)"/>
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'ernaehrungskategorie'">
                    <Select v-model="selectedCategory" :options="categories" optionLabel="label" optionValue="label"
                    placeholder="Kategorie auswählen" class="action-select"/>
                    <Button label="Go" icon="pi pi-list" @click="getRezepteEinerKategorie(selectedCategory)"/>
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
                <RezeptCard v-for="recipe in recipes" :key="recipe.rezeptnr" :recipe="recipe"/>
            </div>
        </div>
    </div>
</template>

<script>
import RezeptCard from '../components/RezeptCard.vue';
import api from '../services/api';
import { Button, InputText, InputNumber, Card, Divider, Message, ProgressSpinner, Select } from 'primevue';

export default {
    name: 'rezepte',
    components: {
        RezeptCard,
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
            bestellanzahl: 0,
            calories: 0,
            zutat: '',
            selectedAction: null,
            actionOptions: [
                { label: 'Ein Rezept', value: 'bestimmtesRezept' },
                { label: 'Rezepte mit einer Zutat', value: 'eineZutat' },
                { label: 'Rezepte mit weniger als 5 Zutaten', value: 'wenigerZutaten' },
                { label: 'Rezepte mit weniger als 5 Zutaten & aus einer Kategorie', value: 'wenigerZutatenKategorie'},
                { label: 'Rezepte sortiert nach Bestellanzahl', value: 'bestellanzahl'},
                { label: 'Rezepte nach Portionsanzahl filtern', value: 'portionsanzahl'},
                { label: 'Rezepte nach Kalorien filtern', value: 'kalorien'},
                { label: 'Rezepte nach einer Ernährungskategorie filtern', value: 'ernaehrungskategorie'}
            ],
            selectedRecipe: null,
            recipeNames: [
                { label: 'Spaghetti Bolognese', value: 'spaghettiBolognese'},
                { label: 'Hähnchen-Gemüse-Pfanne', value: 'haehnchenGemuesePfanne'},
                { label: 'Lachs mit Basmatireis', value: 'lachsMitBasmatireis'},
                { label: 'Veganes Linsen-Curry', value: 'veganesLinsenCurry'},
                { label: 'Caprese-Salat', value: 'capreseSalat'},
                { label: 'Kartoffel-Gratin', value: 'kartoffelGratin'},
                { label: 'Brokkoli-Garnelen-Pfanne', value: 'brokkoliGarnelenPfanne'},
                { label: 'Vollkornbrot mit Honig', value: 'vollkornbrotMitHonig'},
                { label: 'Schweineschnitzel mit Kartoffelsalat', value: 'schweineschnitzelMitKartoffelsalat'},
                { label: 'Gemüsesuppe', value: 'gemüsesuppe'},
                { label: 'Thunfisch-Salat', value: 'thunfischSalat'},
                { label: 'Haferflocken-Bowl', value: 'haferflockenBowl'},
                { label: 'Käse-Omelett', value: 'kaeseOmelett'},
                { label: 'Kichererbsen-Bowl', value: 'kichererbsenBowl'},
                { label: 'Buntes Gemüse-Couscous', value: 'buntesGemüseCouscous'},
                { label: 'Thaicurry mit Hähnchen', value: 'thaicurryMitHaehnchen'},
                { label: 'Kartoffelsuppe', value: 'kartoffelsuppe'},
                { label: 'Milchreis mit Apfelmus', value: 'milchreisMitApfelmus'},
                { label: 'Sommerlicher Couscous-Salat', value: 'sommerlicherCouscousSalat'},
            ],
            categories: [
                { label: 'Vegan', value: 'vegan'},
                { label: 'Vegetarisch', value: 'vegetarisch'},
                { label: 'Glutenfrei', value: 'glutenfrei'},
                { label: 'Laktosefrei', value: 'laktosefrei'},
                { label: 'Low Carb', value: 'lowCarb'},
                { label: 'High Protein', value: 'highProtein'},
                { label: 'Bio', value: 'bio'},
                { label: 'Paleo', value: 'paleo'},
                { label: 'Zuckerfrei', value: 'zuckerfrei'},
                { label: 'Histaminarm', value: 'histaminarm'},
            ],
            selectedCategory: null
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
                () => api.get(`/rezept/zutat?zutatname=${zutat}`),
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