<template>
    <div class="p-4">
        <h1>Home Page</h1>
        <Button
            label="Fetch Data"
            icon="pi pi-download"
            class="p-button-raised p-button-primary mr-2"
            @click="fetchData"
        />
        <Message v-if="error" severity="error" :life="3000">
            {{ error }}
        </Message>
        <Card v-if="data" class="mt-4">
            <template #title> Fetched Data </template>
            <template #content>
                <pre>{{ data }}</pre>
            </template>
        </Card>
    </div>
</template>

<script>
import Button from 'primevue/button';
import Message from 'primevue/message';
import Card from 'primevue/card';
import api from '../services/api';

export default {
    name: 'Home',
    components: {
        Button,
        Card,
        Message
    },
    data() {
        return {
            data: null,
            error: null
        };
    },
    methods: {
        async fetchData(){
            try {
                const response = await api.get('/zutat/ohne-rezept');
                this.data = response.data;
                this.error = null;
            } catch (err) {
                this.error = 'Failed to fetch data. Check console for details';
                console.error(err);
            }
        }
    }
}
</script>