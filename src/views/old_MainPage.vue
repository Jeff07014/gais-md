<template>
  <div>
    <div id="nav">
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <transition name="fade" mode="out-in">
      <router-view 
        v-on:getID="getID"/>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
/*import Home from './Home.vue'
import About from './About.vue'
import Login from '@/components/Login.vue'*/

export default {
  name: 'Home',
  components: {
    /*Home,
    About,
    Login,*/
  },

  methods: {
    getID: function (c) {
      // console.log(c);
      this.$emit('getID', c);
    },
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .7s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
