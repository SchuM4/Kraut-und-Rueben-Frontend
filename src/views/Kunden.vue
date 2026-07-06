<template>
    <div class="zutaten-page">
        <Card class="filter-card">
            <template #title>Kunden verwalten</template>
            <template #content>
                <div class="filter-row">
                    <Select v-model="selectedCustomer" :options="actionOptions" optionLabel="label" optionValue="value" 
                    placeholder="Kunde auswählen" class="action-select" />
                    <Button label="Delete" severity="danger" @click="deleteCustomer(selectedCustomer)"/>
                </div>
            </template>
        </Card>

        <div class="results-section">
            <div v-if="loading" class="status-message">
                <ProgressSpinner style="width: 32px; height: 32px" strokeWidth="4" />
                <span>Verarbeitung</span>
            </div>

            <Message v-else-if="error" severity="error" :closable="false">
                {{ error }}
            </Message>

            <Message v-else-if="success" severity="success" :closable="true">
                Kunde mit id {{ selectedCustomer }} wurde erfolgreich anonymisiert
            </Message>

            <Message v-else-if="hasAttempted" severity="info" :closable="false">
                Kunde nicht gefunden oder schon anonymisiert.
            </Message>
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
            loading: false,
            error: null,
            success: false,
            hasAttempted: false,
            selectedCustomer: null,
            actionOptions: [
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
        };
    },
    methods: {
        async deleteCustomer(customerId) {
            if (!customerId) return;
            this.loading = true;
            this.error = null;
            this.success = false;
            this.hasAttempted = true;
            try {
                await api.delete(`/api/kunden/${customerId}/anonymisieren`);
                this.success = true;
            } catch (err) {
                if (err.response) {
                    this.error = `Fehler ${err.response.status}: Kunde nicht gefunden oder schon anonymisiert`;
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