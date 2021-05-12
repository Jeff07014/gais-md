<template>
  <!--transition name="fade"-->
    <div v-if="insert" style="background:white;width:100%;height:100%;position:fixed;z-index:1000">
      <div class="col s12" style="padding-top:20px;text-align:center;padding-left:30%;padding-right:30%">
        <img src="../assets/logo.png">
        <h1 style="padding-bottom:70px"><b>GAIS Markdown Editor</b></h1>
        <div class="row">
          <div class="col s12">
            <div class="row">
                <!--
              <div class="input-field col s12">
                <i class="material-icons prefix">create</i>
                <input id="namespace" placeholder="namespace1/project1" type="text" class="validate" v-model="namespace">
                <label for="namespace" class="active">Namespace</label>
              </div>
              <div class="input-field col s12">
                <i class="material-icons prefix">create</i>
                <input id="room" placeholder="doc1" type="text" class="validate" v-model="room">
                <label for="room" class="active">Room</label>
              </div>
                -->
                <div class="input-field col s12" @click="restore">
                <i class="material-icons prefix">create</i>
                <input id="clientID" placeholder="user" type="text" :class="{ errbar: emptyname, validate: true}" v-model="clientID">
                <label for="clientID" :class="{ errfont:emptyname, active: true }">ClientID</label>
              </div>
            </div>
            <div class="collap">
              <transition name="collapse" mode="in-out">
                <div v-if="emptyname" class="collap-body">
                  <span class="errmsg">please enter a user name.</span>
                </div>
              </transition>
            </div>
            <div style="padding:20px">
              <button class="btn-large waves-effect waves-light" type="submit" @click="login()">Login
                <i class="material-icons right">login</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!--/transition-->
</template>

<script>

export default {
  data (){
    return {
      insert: true,
      //namespace: "namespace1/project1",
      //room: "doc1",
      clientID: "user",
      emptyname: false,
    }
  },

  methods: {
    login: function() {
     // var tmp = document.getElementById('name').value;
     // this.$GLOBAL.name = tmp;
     // this.$emit('getID', this.namespace, this.room);
      if (this.clientID === "") {
        this.emptyname = true;
      }
      else {
        this.$emit('getID', this.clientID);
        this.insert = false;
      }
    },

    restore () {
      this.emptyname = false;
    }
  },
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.errmsg {
  color:red;
  font-size:15px;
}

.collap {
  display: flex;
  flex-direction:column;
  justify-content:flex-start;
  height: 30px;
}

.collap-body {
  overflow:hidden;
  transition:flex 1s ease;
  height:auto;
  flex:1;
}

.collapse {
  &-enter,
  &-leave-to {
    flex: 0;
  }
}

.errbar {
  border-bottom: 1px solid red !important;
  -webkit-box-shadow: 0 1px 0 0 red;
  box-shadow: 0 1px 0 0 red !important;
}

.errfont {
  color: red !important;
}
</style>
