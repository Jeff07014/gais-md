<template>
  <div style="height:inherit">
    <div class="nav-size">
      <ul class="tabs nav-ul">
        <li class="tab right">
          <router-link to="/home">Home</router-link>
        </li>
        <li class="tab right">
          <router-link to="/about">About</router-link>
        </li>
        <li class="tab right">
          <router-link to="/test">Test</router-link>
        </li>
        <li class="tab right">
          <router-link to="/login">Login</router-link>
        </li>
      </ul>
    </div>
    <transition name="fade" mode="out-in">
      <router-view 
        class="router-size"
        @getID="getID"/>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
/*import Home from './Home.vue'
import About from './About.vue'
import Login from '@/components/Login.vue'*/
import M from 'materialize-css'

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
  },

  mounted() {
    M.AutoInit();
  }
}
</script>

<style scope>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .7s ease;
  }
  
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  
  .tabs .tab a{
    color:#000000;
  }
  
  .tabs .tab a:hover,.tabs .tab a.active {
    /* background-color:transparent;*/
    color:#536dfe;
  }
  
  .tabs .tab a:focus,.tabs .tab a:focus.active {
    background-color:#3e6c9422;
    color:#3e6c94;
  }
  
  .tabs .tab.disabled a,.tabs .tab.disabled a:hover {
    color:rgba(255,255,255,0.7);	
  }
  
  .tabs .indicator {
    background-color:#3e6c94;
  }
  
  .router-size {
    height:90%;
    padding-top:30px;
  }
  
  .nav-size {
    height:10%;
  }

  .nav-ul {
    list-style:none;
    padding-inline-start:0 !important;
  }
</style>
