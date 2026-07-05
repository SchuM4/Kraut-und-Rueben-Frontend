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
                <div class="filter-row" v-if="selectedAction === 'teureBestellungen'">
                    <div style="display: flex; flex-direction: column; justify-content: center; gap: 4px;">
                        <Select v-model="selectedName" :options="kundennamen" optionLabel="label" optionValue="label"
                            placeholder="Nachname auswählen" class="action-select" />
                        <InputNumber v-model="rechnugnsbetrag" mode="decimal" :minFractionDigits="0"
                            :maxFractionDigits="2" placeholder="0.0" />
                    </div>
                    <Button label="Go" icon="pi pi-list" @click="getTeureBestellungenEinesKunden(selectedName, rechnugnsbetrag)" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'durchschnittNaehrwert'">
                    <InputNumber v-model="rechnugnsbetrag" placeholder="Mindestbestand" showButtons :min="0" />
                    <Button label="Niedriger Bestand" icon="pi pi-exclamation-triangle"
                        @click="getZutatenMitNiedrigemBestand(rechnugnsbetrag)" />
                </div>

                <div class="filter-row" v-else-if="selectedAction === 'bestellungsanzahl'">
                    <InputText v-model="kundenname" placeholder="Beispiel GmbH" />
                    <Button label="Nach Lieferant" icon="pi pi-truck"
                        @click="getZutatenVonEinemLieferant(kundenname)" />
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

            <Message v-else-if="!bestellungen.length" severity="info" :closable="false">
                Keine Zutaten gefunden.
            </Message>

            <div v-else class="ingredient-grid">
                <BestellungCard v-for="bestellung in bestellungen"
                :key="bestellung.id" :bestellung="bestellung"/>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api';
import BestellungCard from '../components/BestellungCard.vue';
import { Button, InputText, InputNumber, Card, Divider, Message, ProgressSpinner, Select } from 'primevue';

export default {
    name: 'zutaten',
    components: {
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
            bestellungen: [],
            loading: false,
            error: null,
            rechnugnsbetrag: 0,
            kundennamen: [
                { label: 'Bauer', value: 'bauer' },
                { label: 'Becker', value: 'becker' },
                { label: 'Fischer', value: 'fischer' },
                { label: 'Hoffman', value: 'hoffman' },
                { label: 'Klein', value: 'Klein' },
                { label: 'Koch', value: 'koch' },
                { label: 'Meyer', value: 'meyer' },
                { label: 'Müller', value: 'mueller' },
                { label: 'Neumann', value: 'neumann' },
                { label: 'Richter', value: 'richter' },
                { label: 'Schmidt', value: 'schmidt' },
                { label: 'Schneider', value: 'schneider' },
                { label: 'Schröder', value: 'schroeder' },
                { label: 'Scwarz', value: 'schwarz' },
                { label: 'Schäfer', value: 'schaefer' },
                { label: 'Wagner', value: 'wagner' },
                { label: 'Weber', value: 'weber' },
                { label: 'Wolf', value: 'wolf' },
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
    methods: {
        async getTeureBestellungenEinesKunden(nachname, betrag) {
            await this.fetchData(
                () => api.get(`/bestellung/teure?nachname=${nachname}&betrag=${betrag}`),
                'Bestellungen können nicht geladen werden'
            );
        },
        async getZutatenMitNiedrigemBestand(bestand) {
            await this.fetchData(
                () => api.get(`/zutat/niedrig-bestand?bestand=${bestand}`),
                'Zutaten mit niedrigem Bestand können nicht geladen werden'
            );
        },
        async getZutatenVonEinemLieferant(lieferantenname) {
            await this.fetchData(
                () => api.get(`/zutat/lieferant?lieferant=${lieferantenname}`),
                `Keine Zutaten von Lieferant ${lieferantenname} gefunden`
            );
        },
        async fetchData(requestFn, fallbackErrorMessage) {
            this.bestellungen = [];
            this.loading = true;
            this.error = null;
            try {
                const response = await requestFn();
                this.bestellungen = response.data;
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