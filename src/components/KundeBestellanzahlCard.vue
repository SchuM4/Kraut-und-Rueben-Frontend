<template>
    <div class="kunde-anzahl-card">
        <div class="kunde-anzahl-card__header">
            <span class="kunde-anzahl-card__name">
                {{ kunde.vorname }} {{ kunde.nachname }}
            </span>
            <span class="kunde-anzahl-card__email">{{ kunde.emailadresse }}</span>
        </div>

        <div class="kunde-anzahl-card__body">
            <div class="kunde-anzahl-card__row">
                <span class="kunde-anzahl-card__label">Geburtsdatum</span>
                <span class="kunde-anzahl-card__value">{{ kunde.geburtsdatum }}</span>
            </div>
            <div class="kunde-anzahl-card__divider"></div>

            <div class="kunde-anzahl-card__row">
                <span class="kunde-anzahl-card__label">Telefonnummer</span>
                <span class="kunde-anzahl-card__value">{{ kunde.telefonnummer }}</span>
            </div>
            <div class="kunde-anzahl-card__divider"></div>

            <div class="kunde-anzahl-card__row kunde-anzahl-card__row--highlight">
                <span class="kunde-anzahl-card__label">Anzahl Bestellungen</span>
                <span class="kunde-anzahl-card__value kunde-anzahl-card__value--strong">{{ anzahl }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'KundeBestellanzahlCard',
    props: {
        kunde: {
            type: Object,
            required: true
        },
        anzahl: {
            type: Number,
            required: true
        }
    }
}
</script>

<style scoped>
.kunde-anzahl-card {
    background-color: #17181a;
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    color: #e4e4e4;
    font-family: inherit;
}

.kunde-anzahl-card__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 0.75rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #2a2b2e;
}

.kunde-anzahl-card__name {
    font-size: 1.05rem;
    font-weight: 600;
    color: #ffffff;
}

.kunde-anzahl-card__email {
    font-size: 0.85rem;
    color: #9a9a9a;
    margin-top: 0.15rem;
}

.kunde-anzahl-card__body {
    display: flex;
    flex-direction: column;
}

.kunde-anzahl-card__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0;
}

.kunde-anzahl-card__row--highlight .kunde-anzahl-card__label {
    color: #ffffff;
}

.kunde-anzahl-card__divider {
    height: 1px;
    background-color: #2a2b2e;
}

.kunde-anzahl-card__label {
    font-size: 0.9rem;
    color: #9a9a9a;
}

.kunde-anzahl-card__value {
    font-size: 0.9rem;
    color: #e4e4e4;
}

.kunde-anzahl-card__value--strong {
    font-weight: 600;
    color: #ffffff;
}
</style>