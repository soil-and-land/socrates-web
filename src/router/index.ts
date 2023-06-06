import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../components/Home.vue';
import Input from '../components/Input.vue';
import Help from "../components/Help.vue";
import Contact from "../components/Contact.vue";
import About from "../components/About.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/input',
      name: 'input',
      component: Input
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

export default router
