<template>
  <div>
    <transition-group name="fade">
      <div key=1 v-if="connect">
        <CollabEditor
          :namespace="namespace"
          :room="room">
        </CollabEditor>
      </div>
      <div key=2 v-else>
<!--
      <input v-model="namespace">
      <input v-model="room">
      <button @click="connectEditor">Join Editor</button>
-->
        <Login v-on:getInput="getInput" />
      </div>
    </transition-group>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
//import TopBar from './components/TopBar.vue'
import CollabEditor from './components/CollabEditor.vue'
import Login from './components/Login.vue'
// import Markdown from './components/Markdown.vue'

export default {
  name: 'App',
  components: {
    //Markdown,
    CollabEditor,
    Login,
  },

  data() {
    return {
      editorsConf: [],
      namespace: "namespace1/project1",
      room: "doc1",
      connect: false,
    }
  },

  methods: {
    
    getInput: function(ns, r) {
      this.namespace = ns;
      console.log(ns);
      this.room = r;
      console.log(r);
      this.connect = true
    }
  }
  /*props: {
    inputdata: String
  }*/
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

strong {
  font-weight:700;
}

</style>
