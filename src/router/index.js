import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Bestellungen from "../views/Bestellungen.vue";

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;