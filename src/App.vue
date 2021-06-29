<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view
        @getID="getID"
        @getDoc="getDoc"
        :namespace="namespace"
        :room="room"
        :filelist="filelist"
        :clientID="clientID"/>
    </transition>
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
        filelist: [],
      }
    },

    methods: {
      getID (c) {
        this.setProp(c).then(() => {
          console.log(this.filelist);
          this.$router.push({
            name: 'Doclist', 
          });
        })
      },

      setProp (c) {
        return new Promise(resolve => {
          setTimeout(() => {
            this.clientID = c.account;
            this.filelist = c.filelist;
            resolve();
          });
        })
      },

      getDoc (ns, r) {
        this.namespace = ns;
        this.room = r;
        // console.log(this.namespace, this.room);
        this.$global.$connect = true;
        // console.log(this.$global.$connect);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity .7s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
