// main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import QuizStart from './views/QuizStart.vue'
import QuizQuestion from './views/QuizQuestion.vue'
import QuizResult from './views/QuizResult.vue'
import './style.css'

const routes = [
  { path: '/', component: Home },
  { path: '/quiz', component: QuizStart },
  { path: '/quiz/question/:id', component: QuizQuestion, props: true },
  { path: '/quiz/result', component: QuizResult }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')