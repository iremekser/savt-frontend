import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Reservation from "../views/Reservation.vue";
import MyReservations from "../views/MyReservations.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/reservation/:id",
    name: "reservation",
    component: Reservation
  },
  {
    path: "/my-reservations",
    name: "myReservations",
    component: MyReservations
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
