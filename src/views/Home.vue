<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
      <!-- Modal Trigger -->
  <button data-target="modal1" class="btn modal-trigger">Modal</button>
  <!-- Modal Structure -->
  <div id="modal1" class="modal">
    <div class="modal-content">
      <h4>Modal Header</h4>
      <p>A bunch of text</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import M from 'materialize-css'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },

  data () {
    return {
        elems: '',
        instances: '',
    }
  },

  mounted () {
      this.elems = document.querySelectorAll('.modal');
      this.instances = M.Modal.init(this.elems);
  },

}
</script>

<style>
  .home{
    text-align:center;
  }
</style>
