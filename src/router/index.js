import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Bestellungen from "../views/Bestellungen.vue";
import Zutaten from "../views/Zutaten.vue";
import Rezepte from "../views/Rezepte.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home   
    },
    {
        path: '/bestellungen',
        name: "bestellungen",
        component: Bestellungen
    },
    {
        path: '/zutaten',
        name: 'zutaten',
        component: Zutaten
    },
    {
        path: '/rezepte',
        name: 'rezepte',
        component: Rezepte
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;