<template>
  <!--transition name="fade"-->
    <div v-if="insert" style="background:white;width:100%;height:100%;position:fixed;z-index:1000">
      <div class="col s12" style="padding-top:150px;text-align:center;padding-left:30%;padding-right:30%">
        <img src="../assets/logo.png">
        <h1 style="padding-bottom:70px"><b>GAIS Markdown Editor</b></h1>
        <div class="row">
          <div class="col s12">
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">create</i>
                <input id="namespace" placeholder="namespace1/project1" type="text" class="validate" v-model="namespace">
                <label for="namespace">Namespace</label>
              </div>
              <div class="input-field col s12">
                <i class="material-icons prefix">create</i>
                <input id="room" placeholder="doc1" type="text" class="validate" v-model="room">
                <label for="room">Room</label>
              </div>
            </div>
            <div style="padding:20px">
              <button class="btn-large waves-effect waves-light" type="submit" @click="login()">Join
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
      namespace: "namespace1/project1",
      room: "doc1",
    }
  },

  methods: {
    login: function() {
     // var tmp = document.getElementById('name').value;
     // this.$GLOBAL.name = tmp;
     this.$emit('getInput', this.namespace, this.room);
     this.insert = false;
    }
  },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
