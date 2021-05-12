<template>
  <div id="app">
    <div v-if="!$global.$connect">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/login">Login</router-link>
      </div>
    </div>
    <router-view
      v-on:getID="getID"
      @getDoc="getDoc"
      :namespace="namespace"
      :room="room"
      :clientID="clientID"/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        //connect: false,
        namespace: "",
        room: "",
        clientID: "",
      }
    },

    methods: {
      getID: function (c) {
        //this.namespace = ns;
        //this.room = r;
        this.clientID = c;
        //console.log(this.namespace, this.room);
        //this.connect = true;
        this.$router.push({
          name: 'Doclist', 
          /*params: {
            namespace: this.namespace,
            room: this.room,
            clientID: this.clientID,
          }*/
	});
      },

      getDoc (ns, r) {
        this.namespace = ns;
        this.room = r;
        console.log(this.namespace, this.room);
        this.$global.$connect = true;
        console.log(this.$global.$connect);
        this.$router.push({
          name: 'Editor',
        });
      },

    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
