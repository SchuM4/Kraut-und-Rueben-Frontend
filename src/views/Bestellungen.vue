<template>
    <div class="zutaten-page">
        <Card class="filter-card">
            <template #title>Bestellungen durchsuchen</template>
            <template #content>
                <div class="filter-row">
                    <Select v-model="selectedAction" :options="actionOptions" optionLabel="label" optionValue="value"
                        placeholder="Aktion auswählen" class="action-select" />
                </div>

                <Divider v-if="selectedAction" />
                <div class="filter-row" v-if="selectedAction === 'teureBestellungen'" :key="'teure'">
                    <div style="display: flex; flex-direction: column; justify-content: center; gap: 4px;">
                        <Select v-model="selectedName" :options="kundennamen" optionLabel="label" optionValue="label"
                            placeholder="Nachname auswählen" class="action-select" />
                        <InputNumber v-model="rechnungsbetrag" mode="decimal" :minFractionDigits="0"
                            :maxFractionDigits="2" placeholder="0.0" />
                    </div>
                    <Button label="Go" icon="pi pi-list"
                        @click="getTeureBestellungenEinesKunden(selectedName, rechnungsbetrag)" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'durchschnittNaehrwert'" :key="'durchschnitt'">
                    <Select v-model="selectedCustomerId" :options="kundennamen" optionLabel="label" optionValue="value"
                        placeholder="Nachname auswählen" class="action-select" />
                    <Button label="Go" icon="pi pi-check" @click="getDurchschnittNaehrwerte(selectedCustomerId)" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'bestellungsanzahl'" :key="'bestellanzahl'">
                    <Button label="Go" icon="pi pi-list"
                        @click="getBestellungsanzahlProKunde()" />
                </div>
            </template>
        </Card>

        <div class="results-section">
            <div v-if="loading" class="status-message" :key="'loading'">
                <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
                <span>Verarbeitung...</span>
            </div>

            <Message v-else-if="error" severity="error" :closable="false" :key="'error'">
                {{ error }}
            </Message>

            <Message v-else-if="isResponseEmpty" severity="info" :closable="false" :key="'notFound'">
                Nicht gefunden.
            </Message>

            <div v-else-if="selectedAction === 'teureBestellungen'" class="ingredient-grid" :key="'bestellungCard'">
                <BestellungCard v-for="bestellung in responseData" :key="bestellung.id" :bestellung="bestellung" />
            </div>

            <div v-else-if="selectedAction === 'durchschnittNaehrwert'" :key="'nutrition'">
                <AverageNutritionCard :durchschnitt="responseData" style="border: 1px solid white;"/>
            </div>

            <div v-else-if="selectedAction === 'bestellungsanzahl'" class="ingredient-grid" :key="'bestellanzahlCard'">
                <KundeBestellanzahlCard v-for="item in responseData" :key="item.kunde.id"
                :kunde="item.kunde" :anzahl="item.anzahl" style="border: 1px solid white;"/>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api';
import BestellungCard from '../components/BestellungCard.vue';
import AverageNutritionCard from '../components/AverageNutritionCard.vue';
import KundeBestellanzahlCard from '../components/KundeBestellanzahlCard.vue';
import { Button, InputText, InputNumber, Card, Divider, Message, ProgressSpinner, Select } from 'primevue';

export default {
    name: 'zutaten',
    components: {
        KundeBestellanzahlCard,
        AverageNutritionCard,
        BestellungCard,
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
            responseData: [],
            loading: false,
            error: null,
            rechnungsbetrag: 0,
            selectedCustomerId: -1,
            kundennamen: [
                { label: 'Bauer', value: '12' },
                { label: 'Becker', value: '8' },
                { label: 'Fischer', value: '4' },
                { label: 'Hoffman', value: '9' },
                { label: 'Klein', value: '14' },
                { label: 'Koch', value: '11' },
                { label: 'Meyer', value: '6' },
                { label: 'Müller', value: '1' },
                { label: 'Neumann', value: '17' },
                { label: 'Richter', value: '13' },
                { label: 'Schmidt', value: '2' },
                { label: 'Schneider', value: '3' },
                { label: 'Schröder', value: '16' },
                { label: 'Scwarz', value: '18' },
                { label: 'Schäfer', value: '10' },
                { label: 'Wagner', value: '7' },
                { label: 'Weber', value: '5' },
                { label: 'Wolf', value: '15' },
            ],
            selectedName: null,
            selectedAction: null,
            actionOptions: [
                { label: 'Teure Bestellungen', value: 'teureBestellungen' },
                { label: 'Durchscnittlicher Nährwert per Kunde', value: 'durchschnittNaehrwert' },
                { label: 'Bestellungsanzahl pro Kunde', value: 'bestellungsanzahl' }
            ]
        };
    },
    computed: {
        isResponseEmpty() {
            if (this.selectedAction === 'durchschnittNaehrwert') {
                return !this.responseData || Object.keys(this.responseData).length === 0;
            }
            return !this.responseData || this.responseData.length === 0;
        }
    },
    watch: {
        selectedAction() {
            this.responseData = [];
            this.error = null;
        }
    },
    methods: {
        async getTeureBestellungenEinesKunden(nachname, betrag) {
            await this.fetchData(
                () => api.get(`/bestellung/teure?nachname=${nachname}&betrag=${betrag}`),
                'Bestellungen können nicht geladen werden'
            );
        },
        async getDurchschnittNaehrwerte(kundennr) {
            await this.fetchData(
                () => api.get(`/bestellung/durchschnitt-naehrwert?kundennr=${kundennr}`),
                'Bestellungen des Kunden können nicht geladen werden'
            );
        },
        async getBestellungsanzahlProKunde() {
            await this.fetchData(
                () => api.get(`/bestellung/anzahl`),
                `Keine Bestellungen gefunden`
            );
        },
        async fetchData(requestFn, fallbackErrorMessage) {
            this.responseData = null;
            this.loading = true;
            this.error = null;
            try {
                const response = await requestFn();
                this.responseData = response.data;
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