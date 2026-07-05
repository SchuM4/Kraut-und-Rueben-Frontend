<template>
  <div>
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.to" :to="item.to" custom v-slot="{ href, navigate }">
          <a :href="href" v-bind="props.action" @click="navigate">
            {{ item.label }}
          </a>
        </router-link>
      </template>
    </Menubar>
    <div class="p-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar';

export default {
  name: 'App',
  components: {
    Menubar,
  },
  data() {
    return {
      items: [
        {
          label: 'Home',
          to: '/',
        },
        {
          label: 'Bestellungen',
          to: '/bestellungen',
        },
        {
          label: 'Zutaten',
          to: '/zutaten'
        },
        {
          label: 'Rezepte',
          to: '/rezepte'
        }
      ],
    };
  },
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
