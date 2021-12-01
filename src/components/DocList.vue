<template>
  <div style="text-align:center">

    <ul id="slide-out" class="collapsible sidenav sidenav-fixed side-ul">
      <li>
        <div class="row">
          <div class="col s3">
            <img src="../assets/user-icon.svg" alt="userImage" style="margin-top:20px;width:50px">
          </div>
          <h3 class="col s9">{{ clientId }}</h3>
        </div>
      </li>
      <li>
        <div class="collapsible-header" @click="addFile()">
          <i class="material-icons large icon-demo">add</i>add new file
        </div>
        <div class="collapsible-body"></div>
      </li>
      <!-- <li> -->
      <!--   <h3>Tag filter</h3> -->
      <!-- </li> -->
      <!-- <li> -->
      <!--   <div class="divider"></div> -->
      <!-- </li> -->
      <li>
        <div id="tag" class="collapsible-header">tag filter</div>
        <div class="collapsible-body">
          <ul>
            <li v-for="tag in tagPool" :key="tag" style="margin-left:20px">
              <label>
                <input
                  class="filled-in"
                  type="checkbox"
                  :value="tag"
                  v-model="testArray"
                  @change="filter"
                />
                <span>{{tag}}</span>
              </label>
            </li>
          </ul>
        </div>
      </li>
      <li class="logout">
        <div class="collapsible-header" @click="logout()">Logout</div>
        <div class="collapsible-body"></div>
      </li>
    </ul>
    <div class="main">
      <div>
        <h1>FILELIST</h1>
        <div class="row">
          <div class="col s2"></div>
          <div class="input-field col s8">
            <input id="queryString" type="text" class="validate active" v-model="queryString">
            <label for="queryString">search</label>
          </div>
          <div class="col s1">
            <button data-target="slide-out" class="btn cyan darken-1" style="margin-top:20px" @click="searchNote()">
              <i class="material-icons large icon-demo">search</i>
            </button>
          </div>
        </div>
      </div>
      <div v-for="i in Math.floor((filelist.length + 2) / 3)" :key="i.id" class="row">
        <div class="" v-for="j in (Math.floor((filelist.length - (i - 1) * 3) / 3) !== 0 ? 3 : (filelist.length - (i - 1) * 3) % 3)" :key="j.id">
          <div class="col s4" v-if="filelist[((i - 1) * 3) + (j - 1)].isShow == true">
            <div class="docs card blue-grey" @click="getDoc(filelist[((i - 1) * 3) + (j - 1)])">
              <div class="card-content white-text" v-for="(value, name) in filelist[((i - 1) * 3) + (j - 1)]" :key="value.id">
                <span class="card-title" v-if="name == 'room'">{{ value }}</span>
                <div class="card-action" v-if="name == 'tags'">
                  <div v-for="tag in value" class="chip" :key="tag.id">{{ tag }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor } from 'tiptap'
import { Collaboration } from 'tiptap-extension-collaboration'
import M from 'materialize-css'

export default {
  name: 'DocList',
  props: {
    clientID: {
      type: String,
      required: true,
    },
        
    filelist: {
      type: Array,
    },
  },

  data () {
    return {
      clientId: this.clientID,
      tagPool: null,
      tagChoose: null,
      testArray: [],
      queryString: '',
      queryHandler: new Editor({
          extensions: [
            new Collaboration({
            socketServerBaseURL: 'http://127.0.0.1:6002',
            namespace: 'queryHandler',
            room: 'queryHandler',
            clientID: this.clientId,

            debounce: 250,
            keepFocusOnBlur: false,

            onConnected: (state) => {
                console.log('queryHandler:', state);
            },
            onConnectedFailed: (error) => {
                console.log(error);
            },
            onResponse: (res) => {
                console.log(res);
                this.$emit('changeDoc', res);
            },
            onDisconnected: () => {},
            onClientsUpdate: () => {},
            onSaving: () => {},
            onSaved: () => {},
            })
        ] 
      })
    }
  },

  beforeCreate: function () {
    if (!this.$store.getters.isLogined) {
      // console.log("Not authenticated yet");
      this.$router.push('/login');
    } else {
      console.log("id:", this.clientId);
    }
  },

  methods: {
    getDoc(doc) {
      this.$emit('getDoc', doc.namespace, doc.room, doc.id, doc.tags);
    },

    log() {
      // console.log(this.filelist);
    },

    tagset() {
      this.tagPool = new Set();
      this.tagChoose = new Set();

      this.filelist.forEach((file) => {
        this.tagPool = this.tagPool.union(file.tags);
        file.isShow = true;
      });
      // console.log(this.tagPool);
    },

    filter(){
      this.tagChoose = new Set(this.testArray);
      var newTagPool = new Set();
      this.filelist.forEach((file) => {
        file.isShow = false;
        if(this.tagChoose.intersection(file.tags).size === this.tagChoose.size){
          file.isShow = true;
          newTagPool = newTagPool.union(file.tags);
        }
      });
      this.tagPool = newTagPool;
    },

	searchNote() {
      this.queryHandler.extensions.extensions.find((e) => e.name === 'collaboration').searchNote(this.queryString);
	},

    logout() {
      this.$http.post('http://127.0.0.1:3003/users/logout', { account: this.account, password: this.password });
      this.$store.commit('dataRemoving');
      this.$gAuth.signOut();
      this.$router.push('/home')
        .then(() => {
          setTimeout(() => {
            this.$global.$connect = false;
            // console.log(this.$global.$connect);
          }, 1000)
        });
    },

    addFile() {
      this.$http.post('http://127.0.0.1:3003/query', { cmd: 'addFile', account: this.clientID })
        .then(res => {
          console.log(res);
        });
    },
  },

  mounted () {
    this.clientId = this.$store.getters.getClientID;
    this.filelist = this.$store.getters.getFileList;  
    this.elem = document.querySelectorAll('.sidenav');
    this.instance = M.Sidenav.init(this.elem);
    this.elem2 = document.querySelectorAll('.collapsible');
    this.instance = M.Collapsible.init(this.elem2);
    this.filelist.forEach((file) => {
        file.isShow = true;
    });
    console.log(this.filelist);
    Set.prototype.isSuperset = function(subset) {
        for (var elem of subset) {
            if (!this.has(elem)) {
                return false;
            }
        }
        return true;
    }

    Set.prototype.union = function (setB) {
        var union = new Set(this);
        for (var elem of setB) {
            union.add(elem);
        }
        return union;
    }

    Set.prototype.intersection = function(setB) {
        var intersection = new Set();
        for (var elem of setB) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    }

    Set.prototype.difference = function(setB) {
        var difference = new Set(this);
        for (var elem of setB) {
            difference.delete(elem);
        }
        return difference;
    }
    this.tagset();

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.docs {
  height:300px;
  margin-bottom:20px;
}

.row {
  margin:20px;
}

.doc {
  width:50%;
  height:inherit;
}

.side-ul{
  padding-inline-start: 0 !important;
  text-align: left;
}

ul li {
  list-style-type: none;
  border-bottom: 1px solid #ddd;
}

.user-name {
  margin-left: 0px;
}

.main {
  padding-left: 300px;
}

.logout {
  position: absolute;
  bottom: 60px;
  width: 300px;
  border-top: 1px solid #ddd;
}
</style>
