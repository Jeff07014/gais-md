<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view
        @getID="getID"
        @getDoc="getDoc"
        @changeDoc="changeDoc"
        :namespace="namespace"
        :elementID="elementID"
        :room="room"
        :tags="docTags"
        :session="session"
        :filelist="filelist"
        :clientID="clientID"/>
    </transition>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        // connect: false,
        namespace: "",
        room: "",
        clientID: "",
        filelist: [],
        session: {},
        elementID: "",
        docTags: [], // 建index 的時候用來暫存正在編輯的文件的tag
      }
    },

    methods: {
      getID (c) {
        this.setProp(c).then(() => {
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
            this.session = c.session;
            resolve();
          });
        })
      },

      getDoc (ns, r, eID, tags) {
        this.namespace = ns;
        this.room = r;
        this.elementID = eID;
        this.docTags = tags;
        /*console.log(this.elementID);*/
        console.log(ns, r, eID, tags);
        this.$global.$connect = true;
        // console.log(this.$global.$connect);
        this.$router.push({
          name: 'Editor',
        });
      },

      changeDoc(doc) {
            this.filelist = doc;
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
