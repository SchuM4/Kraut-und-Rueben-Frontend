<template>
    <div class="home-page">
        <img src="../assets/kraut-und-rueben.png" alt="Kraut und Rüben" class="home-logo" />
    </div>
</template>

<script>
export default {
    name: 'home'
};
</script>

<style scoped>
.home-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 4rem);
    background-color: #1d1e21;
    padding: 2rem;
}

.home-logo {
    max-width: 480px;
    width: 100%;
    height: auto;
}
</style>
